import CallSignalMessageContent from "./message/callSignalMessageContent";

export default class Participant {
    target;
    sender;
    groupCallClient;
    rtcPeer;

    constructor(target,sender,groupCallClient){
        this.target = target;
        this.sender = sender;
        this.groupCallClient = groupCallClient;
    }

    
    getVideoElement(){
      return document.getElementById(this.sender);
    }

    onIceCandidate(candidate, wp) {
        console.log("Local candidate" + JSON.stringify(candidate));

        var message = {
          type: 'onIceCandidate',
          candidate: candidate,
          name: name
        };
        this.sendSignalMessage(message);
    }

    offerToReceiveVideo(error, offerSdp, wp){
      if (error) return console.error ("sdp offer error"+error)
      console.log('Invoking SDP offer callback function');
      var msg =  { 
          type : "receiveVideoFrom",
          sender : this.sender,
          sdpOffer : offerSdp
      };
      this.sendSignalMessage(msg);
    }
    
    dispose() {
      console.log('Disposing participant ' + this.name);
      this.rtcPeer.dispose();
    }
    
    sendSignalMessage(msg){
      var callSignalMessageContent = new CallSignalMessageContent();
              //callSignalMessageContent.callId = this.currentSession.callId;
      callSignalMessageContent.payload = JSON.stringify(msg);
      this.groupCallClient.sendMessage(this.target,callSignalMessageContent);
    }
}