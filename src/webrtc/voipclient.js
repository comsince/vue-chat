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

export default class VoipClient extends OnReceiverMessageListener{
  
    myPeerConnection;
    webcamStream;
    mediaConstraints = {
        audio: true,            // We want an audio track
        video: true
      };
    sender;
    //当前会话
    currentSession;
    currentSessionCallback;
    currentEngineCallback;

    constructor(store,engineCallback,sessionCallback){
      super();
      this.store = store;
      this.currentSessionCallback = sessionCallback;
      this.currentEngineCallback = engineCallback;
      ChatManager.addReceiveMessageListener(this);
    }  

    startCall(target,isAudioOnly){
        //创建session
        var newSession = this.newSession(target,isAudioOnly,target + new Date().getTime());
        this.currentSession = newSession;
        //发送callmessage
        var callStartMessageContent = new CallStartMessageContent(newSession.callId,target,isAudioOnly);
        this.offerMessage(target,callStartMessageContent);
        //如果时视频，启动预览
        this.startPreview();
    }

    answerCall(audioOnly){
        var answerTMesage = new CallAnswerTMessageContent()
        answerTMesage.isAudioOnly = audioOnly;
        answerTMesage.callId = this.currentSession.callId;
        this.offerMessage(this.currentSession.clientId,answerTMesage);
        //start peerconnection
        this.startPreview();
    }

    newSession(clientId, audioOnly, callId){
       var session = new CallSession();
       session.clientId = clientId;
       session.audioOnly = audioOnly;
       session.callId = callId;
       return session;
    }


    offerMessage(target,messageConent){
        this.store.dispatch('sendMessage', new SendMessage(target,messageConent));
    }

    /**
     * 接收信令服务传递过来的消息
     */
    onReceiveMessage(protoMessage){
      let contentClazz = MessageConfig.getMessageContentClazz(protoMessage.content.type);
      if(contentClazz){
        let content = new contentClazz();
        try {
            content.decode(protoMessage.content);
        } catch(err){
          console.log('decode error');
        }

        if(content instanceof CallStartMessageContent){
          this.currentSession = this.newSession(protoMessage.from,content.isAudioOnly,content.callId);
          this.currentEngineCallback.onReceiveCall(this.currentSession);
        } else if(content instanceof CallAnswerMessageContent){
            console.log("callId "+content.callId+" isAudioOnly "+content.audioOnly);
        } else if(content instanceof CallAnswerTMessageContent){
           console.log("callId "+content.callId+" isAudioOnly "+content.audioOnly);
        }else if(content instanceof CallSignalMessageContent){
          console.log("call signal payload "+content.payload);
          this.handleOfferMsg(content.payload);
        } else if(content instanceof CallByeMessageContent){
           console.log("call bye message");
           this.closeVideoCall();
           this.store.state.showChatBox = false;
        }

      }
    }

    async handleOfferMsg(payload){
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
          
        } else {
          var desc = new RTCSessionDescription(signalMessage);
          if(type === 'answer'){

          } else if(type === 'offer'){
              this.myPeerConnection.setRemoteDescription(desc);
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

    async startPreview(){
      this.log("Starting to prepare an invitation");
      if (this.myPeerConnection) {
        alert("You can't start a call because you already have one open!");
      } else {
        
    
        // Get access to the webcam stream and attach it to the
        // "preview" box (id "local_video").
    
        try {
          this.webcamStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
          this.currentSessionCallback.didCreateLocalVideoTrack(this.webcamStream);
          
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

    async handleNegotiationNeededEvent() {
      console.log("*** Negotiation needed");
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
      console.log("*** ICE connection state changed to " + event);
    
        switch(this.myPeerConnection.iceConnectionState) {
            case "closed":
            case "failed":
            case "disconnected":
                this.closeVideoCall();
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
            this.closeVideoCall();
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
      this.currentSessionCallback.didReceiveRemoteVideoTrack(event.streams[0]);
    }


    handleICEGatheringStateChangeEvent = (event) => {
       console.log("*** ICE gathering state changed to: " + event);
    }


    // Close the RTCPeerConnection and reset variables so that the user can
// make or receive another call if they wish. This is called both
// when the user hangs up, the other user hangs up, or if a connection
// failure is detected.

    closeVideoCall() {
        var localVideo = document.getElementById("wxCallLocalVideo");
    
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
        
            if (localVideo.srcObject) {
                localVideo.pause();
                localVideo.srcObject.getTracks().forEach(track => {
                track.stop();
                });
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