import AbstractMessageHandler from "./abstractmessagehandler";
import { MP, PUB_ACK } from "../../constant";
import Message from "../message/message";
import ProtoMessage from "../message/protomessage";
import ProtoConversationInfo from '../model/protoConversationInfo'
import LocalStore from "../store/localstore";
import UnreadCount from "../model/unReadCount";
import MessageConfig from "../message/messageConfig";
import PersistFlag from "../message/persistFlag";
import ChatManager from "../chatManager";

export default class ReceiveMessageHandler extends AbstractMessageHandler {
      conversations = [];

      match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == MP;
      }

      processMessage(proto){
        LocalStore.resetSendMessageCount();
        var content = JSON.parse(proto.content);
        console.log("current "+content.current+" head "+content.head+" messageCount "+content.messageCount);
        if(content.messageCount == 0){
          this.vueWebsocket.sendAction('changeEmptyMessageState',true);
        } else {
          this.vueWebsocket.sendAction('changeEmptyMessageState',false);
        }
        for(var protoMessage of content.messageResponseList){
          var protoMessage = ProtoMessage.toProtoMessage(protoMessage);
          if(MessageConfig.isDisplayableMessage(protoMessage)){
            this.addProtoMessage(protoMessage);
          }
          ChatManager.onReceiveMessage(protoMessage);
        } 
        this.vueWebsocket.sendAction('changetFirstLogin',false);     
      }

      addProtoMessage(protoMessage){
         this.vueWebsocket.sendAction('addProtoMessage',protoMessage);
      }
}