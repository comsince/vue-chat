import CallStartMessageContent from "./message/callStartMessageContent";
import ChatManager  from "../websocket/chatManager";
import OnReceiverMessageListener from "../websocket/listener/onReceiverMessageListener";
import MessageConfig from '../websocket/message/messageConfig'
import CallAnswerMessageContent from "./message/callAnswerMessageContent";
import CallSignalMessageContent from "./message/callSignalMessageContent";
import CallAnswerTMessageContent from "./message/callAnswerTMessageContent";

export default class VoipClient extends OnReceiverMessageListener{
  
    myPeerConnection;
    webcamStream;
    mediaConstraints = {
        audio: true,            // We want an audio track
        video: true
      };

    transceiver;


    constructor(store){
      super();
      this.store = store;
      ChatManager.addReceiveMessageListener(this);
    }  
    
    

    startCall(target,isAudioOnly){
        //创建session
        //发送callmessage
        var callStartMessageContent = new CallStartMessageContent(target+new Date().getTime(),target,isAudioOnly);
        this.offerMessage(callStartMessageContent);
        //如果时视频，启动预览
        this.startPreview();
    }


    offerMessage(messageConent){
        this.store.dispatch('sendMessage', messageConent);
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

        if(content instanceof CallAnswerMessageContent){
            console.log("callId "+content.callId+" isAudioOnly "+content.audioOnly);
        } else if(content instanceof CallAnswerTMessageContent){
           console.log("callId "+content.callId+" isAudioOnly "+content.audioOnly);
        }else if(content instanceof CallSignalMessageContent){
          console.log("payload "+content.payload);
        }

      }
    }

    async startPreview(){
      this.log("Starting to prepare an invitation");
      if (this.myPeerConnection) {
        alert("You can't start a call because you already have one open!");
      } else {
        // Call createPeerConnection() to create the RTCPeerConnection.
        // When this returns, myPeerConnection is our RTCPeerConnection
        // and webcamStream is a stream coming from the camera. They are
        // not linked together in any way yet.
    
        this.createPeerConnection();
    
        // Get access to the webcam stream and attach it to the
        // "preview" box (id "local_video").
    
        try {
          this.webcamStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
          document.getElementById("video-local").srcObject = this.webcamStream;
        } catch(err) {
          this.handleGetUserMediaError(err);
          return;
        }
    
        // Add the tracks from the stream to the RTCPeerConnection
    
        try {
          this.webcamStream.getTracks().forEach(
            this.transceiver = track => this.myPeerConnection.addTransceiver(track, {streams: [this.webcamStream]})
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
        this.log("*** Negotiation needed");
    
        // try {
        //     log("---> Creating offer");
        //     const offer = await this.myPeerConnection.createOffer();
        
        //     // If the connection hasn't yet achieved the "stable" state,
        //     // return to the caller. Another negotiationneeded event
        //     // will be fired when the state stabilizes.
        
        //     if (myPeerConnection.signalingState != "stable") {
        //         log("     -- The connection isn't stable yet; postponing...")
        //         return;
        //     }
        
        //     // Establish the offer as the local peer's current
        //     // description.
        
        //     log("---> Setting local description to the offer");
        //     await myPeerConnection.setLocalDescription(offer);
        
        //     // Send the offer to the remote peer.
        
        //     log("---> Sending the offer to the remote peer");
        //     // sendToServer({
        //     //     name: myUsername,
        //     //     target: targetUsername,
        //     //     type: "video-offer",
        //     //     sdp: myPeerConnection.localDescription
        //     // });
        // } catch(err) {
        //     log("*** The following error occurred while handling the negotiationneeded event:");
        //     reportError(err);
        // };
    }


    // Handles |icecandidate| events by forwarding the specified
   // ICE candidate (created by our local ICE agent) to the other
   // peer through the signaling server.
    //接收来自信令服务器发送来的ICE candidate事件消息
    handleICECandidateEvent(event) {
        if (event.candidate) {
          this.log("*** Outgoing ICE candidate: " + event.candidate.candidate);
        //   sendToServer({
        //     type: "new-ice-candidate",
        //     target: targetUsername,
        //     candidate: event.candidate
        //   });
        }
    }


    // Handle |iceconnectionstatechange| events. This will detect
    // when the ICE connection is closed, failed, or disconnected.
    //
    // This is called when the state of the ICE agent changes.

    handleICEConnectionStateChangeEvent(event) {
        this.log("*** ICE connection state changed to " + myPeerConnection.iceConnectionState);
    
        switch(myPeerConnection.iceConnectionState) {
            case "closed":
            case "failed":
            case "disconnected":
                closeVideoCall();
                break;
        }
    }


    // Set up a |signalingstatechange| event handler. This will detect when
// the signaling connection is closed.
//
// NOTE: This will actually move to the new RTCPeerConnectionState enum
// returned in the property RTCPeerConnection.connectionState when
// browsers catch up with the latest version of the specification!

    handleSignalingStateChangeEvent(event) {
       this.log("*** WebRTC signaling state changed to: " + myPeerConnection.signalingState);
       switch(myPeerConnection.signalingState) {
         case "closed":
            closeVideoCall();
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

    handleTrackEvent(event) {
       this.log("*** Track event");
    //    document.getElementById("received_video").srcObject = event.streams[0];
    //    document.getElementById("hangup-button").disabled = false;
    }


    handleICEGatheringStateChangeEvent(event) {
       this.log("*** ICE gathering state changed to: " + myPeerConnection.iceGatheringState);
    }


    // Close the RTCPeerConnection and reset variables so that the user can
// make or receive another call if they wish. This is called both
// when the user hangs up, the other user hangs up, or if a connection
// failure is detected.

    closeVideoCall() {
        var localVideo = document.getElementById("video-local");
    
        this.log("Closing the call");
    
        // Close the RTCPeerConnection
    
        if (myPeerConnection) {
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
        
            this.myPeerConnection.getTransceivers().forEach(transceiver => {
                transceiver.stop();
            });
        
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