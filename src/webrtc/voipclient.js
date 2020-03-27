import CallStartMessageContent from "./message/callStartMessageContent";
import ChatManager  from "../websocket/chatManager";
import OnReceiverMessageListener from "../websocket/listener/onReceiverMessageListener";
import MessageConfig from '../websocket/message/messageConfig'
import CallAnswerMessageContent from "./message/callAnswerMessageContent";
import CallSignalMessageContent from "./message/callSignalMessageContent";
import CallAnswerTMessageContent from "./message/callAnswerTMessageContent";
import CallSession from "./callSession";
import CallByeMessageContent from "./message/callByeMessageContent";
import SendMessage from "../websocket/message/sendMessage";
import CallState from "./callState";
import CallEndReason from "./callEndReason";

export default class VoipClient extends OnReceiverMessageListener{
  
    myPeerConnection;
    webcamStream;
    mediaConstraints = {
        audio: true,            // We want an audio track
        video: true
      };
    sender;
    //是否为createOff发起人
    isInitiator;
    //当前会话
    currentSession;
    currentSessionCallback;
    currentEngineCallback;

    constructor(store){
      super();
      this.store = store;
      ChatManager.addReceiveMessageListener(this);
    }
    
    setCurrentSessionCallback(sessionCallback){
       this.currentSessionCallback = sessionCallback;
    }

    setCurrentEngineCallback(engineCallback){
        this.currentEngineCallback = engineCallback;
    }

    startCall(target,isAudioOnly){
        this.isInitiator = false;
        //创建session
        var newSession = this.newSession(target,isAudioOnly,target + new Date().getTime());
        newSession.setState(CallState.STATUS_OUTGOING);
        this.currentSession = newSession;
        console.log("create new session "+this.currentSession.clientId+" callId "+this.currentSession.callId);
        //发送callmessage
        var callStartMessageContent = new CallStartMessageContent(newSession.callId,target,isAudioOnly);
        this.offerMessage(target,callStartMessageContent);
        //如果时视频，启动预览
        this.startPreview();
    }

    cancelCall(){
      var byeMessage = new CallByeMessageContent();
      byeMessage.callId = this.currentSession.callId;
      this.offerMessage(this.currentSession.clientId,byeMessage);
      console.log("send bye message");
      this.currentSession.endCall(CallEndReason.REASON_RemoteHangup);
      this.currentSession = null;
    }

    answerCall(audioOnly){
        this.isInitiator = true;
        console.log("isInitiator "+this.isInitiator);
        this.currentSession.setState(CallState.STATUS_CONNECTING);
        var answerTMesage = new CallAnswerTMessageContent()
        answerTMesage.isAudioOnly = audioOnly;
        answerTMesage.callId = this.currentSession.callId;
        this.offerMessage(this.currentSession.clientId,answerTMesage);
        this.startPreview();
    }

    newSession(clientId, audioOnly, callId){
       var session = new CallSession(this);
       session.clientId = clientId;
       session.audioOnly = audioOnly;
       session.callId = callId;
       session.sessionCallback = this.currentSessionCallback;
       return session;
    }
    
    rejectOtherCall(callId,clientId){
      var byeMessage = new CallByeMessageContent();
      byeMessage.callId = callId;
      this.log('reject other callId '+callId +" clientId "+clientId);
      this.offerMessage(clientId,byeMessage);
    }

    offerMessage(target,messageConent){
        this.store.dispatch('sendMessage', new SendMessage(target,messageConent));
    }

    offerMessageByType(type){
      var callSignalMessageContent = new CallSignalMessageContent();
              callSignalMessageContent.callId = this.currentSession.callId;
              var jsonPayload = {
                 type: type,
                 sdp: this.myPeerConnection.localDescription.sdp
              }
      callSignalMessageContent.payload = JSON.stringify(jsonPayload);
      this.offerMessage(this.currentSession.clientId,callSignalMessageContent);
    }

    /**
     * 接收信令服务传递过来的消息
     */
    onReceiveMessage(protoMessage){
      //只处理接收消息，对于同一用户不同session会话忽略
      if(new Date().getTime() - protoMessage.timestamp < 90000 && protoMessage.direction === 1){
        let contentClazz = MessageConfig.getMessageContentClazz(protoMessage.content.type);
        if(contentClazz){
          let content = new contentClazz();
          try {
              content.decode(protoMessage.content);
          } catch(err){
            console.log('decode error');
          }
          if(this.currentSession){
            console.log("current call state "+this.currentSession.callState);
          }
          if(content instanceof CallStartMessageContent){
            console.log("receive call startmessage");
            if(this.currentSession && this.currentSession.callState !== CallState.STATUS_IDLE){
              this.rejectOtherCall(content.callId,protoMessage.from);
            } else {
              this.currentSession = this.newSession(protoMessage.from,content.audioOnly,content.callId);
              this.currentSession.setState(CallState.STATUS_INCOMING);
              this.currentEngineCallback.onReceiveCall(this.currentSession);
            }
            
          } else if(content instanceof CallAnswerMessageContent || content instanceof CallAnswerTMessageContent){
            this.isInitiator = false;
            if(this.currentSession  && this.currentSession.callState != CallState.STATUS_IDLE){
              console.log(" CallAnswerMessageContent callState "+this.currentSession.callState);
              if(protoMessage.from === this.currentSession.clientId && content.callId === this.currentSession.callId){
                if(this.currentSession.callState != CallState.STATUS_OUTGOING){

                  // this.rejectOtherCall(this.currentSession.callId,this.currentSession.clientId);
                } else if(this.currentSession.callState === CallState.STATUS_OUTGOING){
                  this.currentSession.setState(CallState.STATUS_CONNECTING);
                }
              }
            }
          } else if(content instanceof CallSignalMessageContent){
            if(this.currentSession && this.currentSession.callState != CallState.STATUS_IDLE){
              console.log("current state "+this.currentSession.callState+" call signal payload "+content.payload);
              if(this.currentSession.callState === CallState.STATUS_CONNECTING || this.currentSession.callState === CallState.STATUS_CONNECTED){
                if(protoMessage.from === this.currentSession.clientId && content.callId === this.currentSession.callId){
                  this.handleSignalMsg(content.payload);
                }
              } else {
                 this.currentSession.endCall(CallEndReason.REASON_AcceptByOtherClient);
                // this.currentSession.sessionCallback.didCallEndWithReason(CallEndReason.REASON_AcceptByOtherClient);
              }
            }
          } else if(content instanceof CallByeMessageContent){
             if(!this.currentSession || this.currentSession.callState === CallState.STATUS_IDLE || protoMessage.from != this.currentSession.clientId || content.callId != this.currentSession.callId){
               return;
             }
             this.cancelCall();
          }
        }
      }
    }

    async handleSignalMsg(payload){
        var signalMessage = JSON.parse(payload);
        var type = signalMessage.type;
        console.log('message type '+type);
        if(type === "candidate"){
          var rTCIceCandidateInit = {
            candidate: signalMessage.candidate,
            sdpMLineIndex: signalMessage.label,
            sdpMid: signalMessage.id
          }
          var candidate = new RTCIceCandidate(rTCIceCandidateInit);
          this.log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
          try {
            await this.myPeerConnection.addIceCandidate(candidate);
          } catch(err){
             this.reportError(err);
          }
          
        } else if(type === 'remove-candidates'){
           this.log("remove candidates ");
        } else {
          var desc = new RTCSessionDescription(signalMessage);
          if(type === 'answer'){
              await this.myPeerConnection.setRemoteDescription(desc);
          } else if(type === 'offer'){
              await this.myPeerConnection.setRemoteDescription(desc);
              await this.myPeerConnection.setLocalDescription(await this.myPeerConnection.createAnswer());
              //send answer message
              var callSignalMessageContent = new CallSignalMessageContent();
              callSignalMessageContent.callId = this.currentSession.callId;
              var jsonPayload = {
                 type: 'answer',
                 sdp: this.myPeerConnection.localDescription.sdp
              }
              callSignalMessageContent.payload = JSON.stringify(jsonPayload);
              this.offerMessage(this.currentSession.clientId,callSignalMessageContent);
          }
        }
    }

    async handleOfferMessage(){
      console.log("*** Negotiation needed "+this.isInitiator);
      if(!this.isInitiator){
        return;
      }
      try {
        console.log("---> Creating offer");
        const offer = await this.myPeerConnection.createOffer();
    
        // If the connection hasn't yet achieved the "stable" state,
        // return to the caller. Another negotiationneeded event
        // will be fired when the state stabilizes.
    
        if (this.myPeerConnection.signalingState != "stable") {
          console.log("     -- The connection isn't stable yet; postponing...")
          return;
        }
    
        // Establish the offer as the local peer's current
        // description.
    
        console.log("---> Setting local description to the offer");
        await this.myPeerConnection.setLocalDescription(offer);
    
        // Send the offer to the remote peer.
    
        console.log("---> Sending the offer to the remote peer");
        this.offerMessageByType('offer');
      } catch(err) {
        console.log("*** The following error occurred while handling the negotiationneeded event:");
        this.reportError(err);
      };
    }

    async startPreview(){
      this.log("Starting to prepare an invitation");
      if (this.myPeerConnection) {
        alert("You can't start a call because you already have one open!");
      } else {
        
    
        // Get access to the webcam stream and attach it to the
        // "preview" box (id "local_video").
    
        try {
          this.mediaConstraints = {
            audio: true,            // We want an audio track
            video: !this.currentSession.isAudioOnly
          }
          this.webcamStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
          if(!this.currentSession.isAudioOnly){
            this.currentSessionCallback.didCreateLocalVideoTrack(this.webcamStream);
          }
          
        } catch(err) {
          this.handleGetUserMediaError(err);
          return;
        }

        // Call createPeerConnection() to create the RTCPeerConnection.
        // When this returns, myPeerConnection is our RTCPeerConnection
        // and webcamStream is a stream coming from the camera. They are
        // not linked together in any way yet.
    
        this.createPeerConnection();
    
        // Add the tracks from the stream to the RTCPeerConnection
    
        try {
          this.webcamStream.getTracks().forEach(
            track => this.sender = this.myPeerConnection.addTrack(track, this.webcamStream)
          );
        } catch(err) {
          this.handleGetUserMediaError(err);
        }
      }
    }

    async createPeerConnection() {
        this.log("Setting up a connection...");
      
        // Create an RTCPeerConnection which knows to use our chosen
        // STUN server.
      
        this.myPeerConnection = new RTCPeerConnection({
          iceServers: [     // Information about ICE servers - Use your own!
            {
              urls: "turn:turn.liyufan.win:3478",  // A TURN server
              username: "wfchat",
              credential: "wfchat"
            }
          ]
        });
      
        // Set up event handlers for the ICE negotiation process.
      
        this.myPeerConnection.onicecandidate = this.handleICECandidateEvent;
        this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
        this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
        this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
        this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
        this.myPeerConnection.ontrack = this.handleTrackEvent;
      }


      // Called by the WebRTC layer to let us know when it's time to
     // begin, resume, or restart ICE negotiation.

    handleNegotiationNeededEvent = () =>  {
       this.handleOfferMessage();
    }


    // Handles |icecandidate| events by forwarding the specified
   // ICE candidate (created by our local ICE agent) to the other
   // peer through the signaling server.
    //接收来自信令服务器发送来的ICE candidate事件消息
    handleICECandidateEvent = (event) => {
        if (event.candidate) {
          console.log("*** Outgoing ICE candidate: " + event.candidate.candidate);
          var candidateMessageContent = new CallSignalMessageContent();
          candidateMessageContent.callId = this.currentSession.callId;
          var candidatePayload = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          }
          candidateMessageContent.payload = JSON.stringify(candidatePayload);
          this.offerMessage(this.currentSession.clientId,candidateMessageContent);
        }
    }


    // Handle |iceconnectionstatechange| events. This will detect
    // when the ICE connection is closed, failed, or disconnected.
    //
    // This is called when the state of the ICE agent changes.

    handleICEConnectionStateChangeEvent = (event) => {
      console.log("*** ICE connection state changed to " + this.myPeerConnection.iceConnectionState);
    
        switch(this.myPeerConnection.iceConnectionState) {
            case "connected":
                this.currentSession.setState(CallState.STATUS_CONNECTED); 
              break;
            case "closed":
            case "failed":
            case "disconnected":
                this.cancelCall();
                break;
        }
    }


    // Set up a |signalingstatechange| event handler. This will detect when
// the signaling connection is closed.
//
// NOTE: This will actually move to the new RTCPeerConnectionState enum
// returned in the property RTCPeerConnection.connectionState when
// browsers catch up with the latest version of the specification!

    handleSignalingStateChangeEvent = (event) => {
      console.log("*** WebRTC signaling state changed to: " + this.myPeerConnection.signalingState);
       switch(this.myPeerConnection.signalingState) {
         case "closed":
            this.cancelCall();
            break;
        }
    }


    // Called by the WebRTC layer when events occur on the media tracks
// on our WebRTC call. This includes when streams are added to and
// removed from the call.
//
// track events include the following fields:
//
// RTCRtpReceiver       receiver
// MediaStreamTrack     track
// MediaStream[]        streams
// RTCRtpTransceiver    transceiver
//
// In our case, we're just taking the first stream found and attaching
// it to the <video> element for incoming media.

    handleTrackEvent = (event) => {
      console.log("comming stream");
      if(this.currentSession.isAudioOnly){
         this.currentSessionCallback.didReceiveRemoteAudioTrack(event.streams[0]);
      } else {
        this.currentSessionCallback.didReceiveRemoteVideoTrack(event.streams[0]);
      }
    }


    handleICEGatheringStateChangeEvent = (event) => {
       console.log("*** ICE gathering state changed to: " + event);
    }


    // Close the RTCPeerConnection and reset variables so that the user can
// make or receive another call if they wish. This is called both
// when the user hangs up, the other user hangs up, or if a connection
// failure is detected.

    closeCall() {
        this.log("Closing the call");
        // Close the RTCPeerConnection
    
        if (this.myPeerConnection) {
            this.log("--> Closing the peer connection");
        
            // Disconnect all our event listeners; we don't want stray events
            // to interfere with the hangup while it's ongoing.
        
            this.myPeerConnection.ontrack = null;
            this.myPeerConnection.onnicecandidate = null;
            this.myPeerConnection.oniceconnectionstatechange = null;
            this.myPeerConnection.onsignalingstatechange = null;
            this.myPeerConnection.onicegatheringstatechange = null;
            this.myPeerConnection.onnotificationneeded = null;
        
            // Stop all transceivers on the connection
        
            // this.myPeerConnection.getTransceivers().forEach(transceiver => {
            //     transceiver.stop();
            // });

            this.myPeerConnection.removeTrack(this.sender);
        
            // Stop the webcam preview as well by pausing the <video>
            // element, then stopping each of the getUserMedia() tracks
            // on it.

            if(!this.currentSession.isAudioOnly){
              var localVideo = document.getElementById("wxCallLocalVideo");
              if (localVideo.srcObject) {
                  localVideo.pause();
                  localVideo.srcObject.getTracks().forEach(track => {
                  track.stop();
                  });
              }
            } else {
              this.webcamStream.getTracks.forEach(
                track => {
                  track.stop();
                }
              )
            }
            
        
            // Close the peer connection
        
            this.myPeerConnection.close();
            this.myPeerConnection = null;
            this.webcamStream = null;
        }
    
        // Disable the hangup button
    
        // document.getElementById("hangup-button").disabled = true;
        // targetUsername = null;
    }


    // Handle errors which occur when trying to access the local media
   // hardware; that is, exceptions thrown by getUserMedia(). The two most
   // likely scenarios are that the user has no camera and/or microphone
   // or that they declined to share their equipment when prompted. If
   // they simply opted not to share their media, that's not really an
   // error, so we won't present a message in that situation.

    handleGetUserMediaError(e) {
      this.log_error(e);
      switch(e.name) {
        case "NotFoundError":
          alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
          break;
        case "SecurityError":
        case "PermissionDeniedError":
          // Do nothing; this is the same as the user canceling the call.
          break;
        default:
          alert("Error opening your camera and/or microphone: " + e.message);
          break;
      }
      this.cancelCall();
    }


    reportError(errMessage) {
        this.log_error(`Error ${errMessage.name}: ${errMessage.message}`);
    }

    log_error(text) {
       var time = new Date();
       console.trace("[" + time.toLocaleTimeString() + "] " + text);
    }

    log(text) {
      var time = new Date();
      console.log("[" + time.toLocaleTimeString() + "] " + text);
    }

}