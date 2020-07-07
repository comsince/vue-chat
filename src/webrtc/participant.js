export default class Participant {
    target;
    groupCallClient;
    rtcPeer;

    constructor(target,groupCallClient){
        this.target = target;
        this.groupCallClient = groupCallClient;
    }

    
    getVideoElement(){
      return document.getElementById(this.target);
    }

    onIceCandidate(candidate, wp) {
        console.log("Local candidate" + JSON.stringify(candidate));

        var message = {
          id: 'onIceCandidate',
          candidate: candidate,
          name: name
        };
        this.groupCallClient.sendMessage(this.target,message)
    }

    offerToReceiveVideo(error, offerSdp, wp){
      if (error) return console.error ("sdp offer error")
      console.log('Invoking SDP offer callback function');
      var msg =  { id : "receiveVideoFrom",
          sender : this.target,
          sdpOffer : offerSdp
      };
      this.groupCallClient.sendMessage(msg);
    }
    
    dispose() {
      console.log('Disposing participant ' + this.name);
      this.rtcPeer.dispose();
	};
}