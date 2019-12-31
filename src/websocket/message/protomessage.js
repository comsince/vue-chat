import { USER_ID } from "../../constant";
import MessageStatus from "./messageStatus";
import ConversationType from "../model/conversationType";
import ProtoMessageContent from "./protomessageContent";

/**
 * 聊天信息content，在发送的时候转换为json消息体发送
 */
export default class ProtoMessage {
    conversationType;
    target;
    line;
    from = '';
    content = {}; 
    messageId = 0;
    direction = 0;
    status = 0;
    messageUid = 0;
    timestamp = 0;
    to = '';


    static toProtoMessage(obj){
        let protoMessage = new ProtoMessage();
        if(obj.from == USER_ID){
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
            if(obj.from != USER_ID){
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
}