import MessageStatus from "./messageStatus";
import ConversationType from "../model/conversationType";
import ProtoMessageContent from "./protomessageContent";
import LocalStore from "../store/localstore";

/**
 * 聊天信息content，在发送的时候转换为json消息体发送
 */
export default class ProtoMessage {
    conversationType;
    target;
    line;
    from = '';
    content = {}; 
    messageId = '0';
    direction = 0;
    status = 0;
    messageUid = '0';
    timestamp = 0;
    to = '';


    static toProtoMessage(obj){
        let currentUserId = LocalStore.getUserId();
        let protoMessage = new ProtoMessage();
        if(obj.from == currentUserId){
            protoMessage.direction = 0;
            protoMessage.status = MessageStatus.Sent;
        } else {
            protoMessage.direction = 1;
            protoMessage.status = MessageStatus.Unread;
        }
        protoMessage.messageId = obj.messageId;
        protoMessage.messageUid = obj.messageId;
        protoMessage.timestamp = obj.timestamp;
        protoMessage.conversationType = obj.conversationType;
        protoMessage.target = obj.target;
        protoMessage.from = obj.from;
        if(protoMessage.conversationType == ConversationType.Single){
            if(obj.from != currentUserId){
               protoMessage.target = obj.from;
               protoMessage.from = obj.from;
            } else {
                protoMessage.target = obj.target;
                protoMessage.from = obj.from;
            }
        }
        protoMessage.line = obj.line;
        protoMessage.content = ProtoMessageContent.toProtoMessageContent(obj.content);
        return protoMessage;
    }

    /***
     * 转为即将发送的protomessage
     */
    static convertToProtoMessage(message){
        var protoMessage = new ProtoMessage();
        protoMessage.conversationType = message.conversation.type;
        protoMessage.target = message.conversation.target;
        protoMessage.line = message.conversation.line;
        protoMessage.from = message.from;
        protoMessage.direction = message.direction;
        protoMessage.status = message.status;
        protoMessage.messageId = message.messageId;
        protoMessage.messageUid = message.messageUid;
        protoMessage.timestamp = message.timestamp;
        console.log("protomessage content "+message.content)
        var payload = message.content.encode();
        protoMessage.content = ProtoMessageContent.toProtoMessageContent(payload);
        return protoMessage;
    }
}