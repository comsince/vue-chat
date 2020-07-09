import OnReceiverMessageListener from "../websocket/listener/onReceiverMessageListener";
import ChatManager from "../websocket/chatManager";
import CallStartMessageContent from "./message/callStartMessageContent";
import CallSession from "./callSession";
import CallState from "./callState";
import SendMessage from "../websocket/message/sendMessage";
import CallAnswerMessageContent from "./message/callAnswerMessageContent";
import CallSignalMessageContent from "./message/callSignalMessageContent";
import CallByeMessageContent from "./message/callByeMessageContent";
import CallEndReason from "./callEndReason";
import Participant from "./participant";
import kurentoUtils from "kurento-utils"
import MessageConfig from '../websocket/message/messageConfig'
import LocalStore from "../websocket/store/localstore";

export default class GroupCallClient extends OnReceiverMessageListener {
    currentSession;
    currentSessionCallback;
    currentEngineCallback;
    //是否群组聊天发起人
    isInitiator;
    participants = {};

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

    /**
     * 开始群组音视频通话
     * @param target 群组会话target
     * @param tos 邀请的用户target 数组列表
     * @param isAudioOnly 是否仅仅是音频聊天
     */
    startCall(target,tos,isAudioOnly){
        this.isInitiator = true;
        //创建session
        var newSession = this.newSession(target,isAudioOnly,target + new Date().getTime());
        newSession.setState(CallState.STATUS_OUTGOING);
        this.currentSession = newSession;
        console.log("create new session "+this.currentSession.clientId+" callId "+this.currentSession.callId);
        //发送callmessage
        var callStartMessageContent = new CallStartMessageContent(newSession.callId,target,isAudioOnly);
        this.sendMessage(target,callStartMessageContent,tos);
    }


    answerCall(audioOnly){
      this.isInitiator = false;
      console.log("isInitiator "+this.isInitiator);
      this.currentSession.setState(CallState.STATUS_CONNECTING);
      var answerMesage = new CallAnswerMessageContent()
      answerMesage.isAudioOnly = audioOnly;
      answerMesage.callId = this.currentSession.callId;
      this.sendMessage(this.currentSession.clientId,answerMesage);
    }

    /**
     * 结束群组音视频通话
     */
    endCall(tos){
      //发起者发送End call指令
      if(this.isInitiator){
        this.sendByeMessage(tos)
      } else {
         this.sendSignalMessage({
           type: 'leaveRoom'
         })
      }

      this.currentSession.endCall(CallEndReason.REASON_RemoteHangup,LocalStore.getUserId()); 
    }

    closeCall(){
      for(var key in this.participants){
        this.participants[key].dispose()
     }
    }

    sendByeMessage(tos){
      var byeMessage = new CallByeMessageContent();
      this.sendMessage(this.currentSession.clientId,byeMessage,tos)
    }

    sendSignalMessage(msg){
      var callSignalMessageContent = new CallSignalMessageContent();
              //callSignalMessageContent.callId = this.currentSession.callId;
      callSignalMessageContent.payload = JSON.stringify(msg);
      this.sendMessage(this.currentSession.clientId,callSignalMessageContent);
    }

    onReceiveMessage(protoMessage){
      console.log(" receive message "+protoMessage.direction)
        if(new Date().getTime() - protoMessage.timestamp < 90000 && protoMessage.direction === 1 && protoMessage.conversationType == 1){
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
                //这里client 要指定为group的target
                this.currentSession = this.newSession(protoMessage.target,content.audioOnly,content.callId);
                console.log("before receive call tos "+protoMessage.tos+" from "+protoMessage.from)
                //去除自己，加入对方的id
                var tos = protoMessage.tos;
                tos.splice(tos.findIndex(item => item === LocalStore.getUserId()), 1);
                tos.push(protoMessage.from)
                this.currentSession.tos = tos
                console.log("after receive call tos "+this.currentSession.tos)
                this.currentSession.setState(CallState.STATUS_INCOMING);
                this.currentEngineCallback.onReceiveCall(this.currentSession);
              }
              
            } else if(content instanceof CallSignalMessageContent){
              if(this.currentSession && this.currentSession.callState != CallState.STATUS_IDLE){
                console.log("current state "+this.currentSession.callState+" call signal payload "+content.payload);
                this.handleSignalMsg(content.payload);
              }
            } else if(content instanceof CallByeMessageContent){
                if(!this.currentSession || this.currentSession.callState === CallState.STATUS_IDLE ){
                  return;
                }
                this.endCall();
            }
          }
        }
    }


    async handleSignalMsg(payload){
      var signalMessage = JSON.parse(payload);
      var type = signalMessage.type;
      console.log('message type '+type+" name "+signalMessage.name);
      //新的用户来临
      if(type === "newParticipantArrived"){
          var name = signalMessage.name;
          console.log("new participant name "+name)
          this.onNewParticipant(name)
      } else if(type == "existingParticipants"){
          var existingParticipants = signalMessage.data;
          console.log("existingParticipants "+signalMessage.data)
          this.onExistingParticipants(signalMessage)
      } else if(type == "participantLeft"){
          var participantLeft = signalMessage.name;
          console.log("participantLeft "+participantLeft)
          this.onParticipantLeft(participantLeft)
      } else if(type == 'iceCandidate'){
          this.participants[signalMessage.name].rtcPeer.addIceCandidate(signalMessage.candidate, function (error) {
                if (error) {
                console.error("Error adding candidate: " + error);
                return;
                }
          });
      } else if(type == 'receiveVideoAnswer'){
        this.onReceiverAnswer(signalMessage)
	    }
    }
    


    newSession(clientId, audioOnly, callId){
        var session = new CallSession(this);
        session.clientId = clientId;
        session.audioOnly = audioOnly;
        session.callId = callId;
        session.sessionCallback = this.currentSessionCallback;
        return session;
    }

    sendMessage(target,messageConent,tos = ''){
        this.store.dispatch('sendMessage', new SendMessage(target,messageConent,tos));
    }

    rejectOtherCall(callId,clientId){
        var byeMessage = new CallByeMessageContent();
        byeMessage.callId = callId;
        this.log('reject other callId '+callId +" clientId "+clientId);
        this.sendMessage(clientId,byeMessage);
    }

    onReceiverAnswer(result){
      this.participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
        if (error) return console.error (error);
      });
    }


    onExistingParticipants(msg) {
      console.log("audioOnly "+this.currentSession.audioOnly)
      var constraints = {
        audio : true,
        video : {
          mandatory : {
            maxWidth : 320,
            maxFrameRate : 15,
            minFrameRate : 15
          }
        }
      };
      var currentUserId = LocalStore.getUserId();
      var participant = new Participant(this.currentSession.clientId,currentUserId,this);
      this.participants[currentUserId] = participant;
      var video = participant.getVideoElement();
      console.log("person video "+video.tagName)
    
      var options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: participant.onIceCandidate.bind(participant),
            // iceServers: [{"urls":"turn:turn.liyufan.win:3478","username":"wfchat","credential":"wfchat"}]
          }
      var _this = this
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
        function(error) {
          if(error) {
            if(_this.currentSessionCallback){
                _this.currentSessionCallback.didError(error)
            }
            return console.error(error)
          }
          if(_this.currentSessionCallback){
             _this.currentSessionCallback.didCreateLocalVideoTrack()
          }
          this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });
      
      for(var sender of msg.data){
          this.receiveVideo(sender)
      }
    }

    receiveVideo(sender) {
      var participant = new Participant(this.currentSession.clientId,sender,this);
      this.participants[sender] = participant;
      var video = participant.getVideoElement();
      console.log("receiveVideo "+sender + " video "+video.tagName)

    
      var options = {
          remoteVideo: video,
          onicecandidate: participant.onIceCandidate.bind(participant),
          // iceServers: [{"urls":"turn:turn.liyufan.win:3478","username":"wfchat","credential":"wfchat"}]
        }
      var _this = this
      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
          function(error) {
            if(error) {
              return console.error(error);
            }
            if(_this.currentSessionCallback){
               _this.currentSessionCallback.didReceiveRemoteVideoTrack(null,sender)
            }
            this.generateOffer (participant.offerToReceiveVideo.bind(participant));
      });;
    }

    onNewParticipant(name){
        this.receiveVideo(name)
    }

    onParticipantLeft(name) {
      console.log('Participant ' + name + ' left');
      var participant = this.participants[name];
      participant.dispose();
      delete this.participants[name];
      this.currentSessionCallback.didCallEndWithReason(CallEndReason.REASON_Hangup,name)
    }
}