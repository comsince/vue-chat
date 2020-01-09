import AbstractMessageHandler from "./abstractmessagehandler";
import { MP, PUB_ACK } from "../../constant";
import Message from "../message/message";
import ProtoMessage from "../message/protomessage";
import ProtoConversationInfo from '../model/protoConversationInfo'
import LocalStore from "../store/localstore";
import UnreadCount from "../model/unReadCount";

export default class ReceiveMessageHandler extends AbstractMessageHandler {
      conversations = [];

      match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == MP;
      }

      processMessage(proto){
        LocalStore.resetSendMessageCount();
        var content = JSON.parse(proto.content);
        console.log("current "+content.current+" head "+content.head+" messageCount "+content.messageCount);
        for(var protoMessage of content.messageResponseList){
          var protoMessage = ProtoMessage.toProtoMessage(protoMessage);
          this.addProtoMessage(protoMessage);
          this.createAndUpdateConversation(protoMessage);
        } 
        this.vueWebsocket.sendAction('changetFirstLogin',false);     
      }

      /**
       * 根据消息动态创建与更新会话列表
       */
      createAndUpdateConversation(protoMessage){
         var protoConversationInfo = new ProtoConversationInfo();
         protoConversationInfo.conversationType = protoMessage.conversationType;
         protoConversationInfo.target = protoMessage.target;
         protoConversationInfo.line = 0;
         protoConversationInfo.top = false;
         protoConversationInfo.slient = false;
         protoConversationInfo.timestamp = protoMessage.timestamp;
         protoConversationInfo.lastMessage = protoMessage;
         protoConversationInfo.unreadCount = new UnreadCount();
         this.vueWebsocket.sendAction('updateConversationInfo',protoConversationInfo);
      }


      addProtoMessage(protoMessage){
         this.vueWebsocket.sendAction('addProtoMessage',protoMessage);
      }
}