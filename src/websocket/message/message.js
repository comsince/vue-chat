import Conversation from '../model/conversation'
import MessageStatus from './messageStatus'
import store from '../../store'
import LocalStore from '../store/localstore';
/***
 *  message in json format
    {
        "conversation":{
            "conversationType": 0, 
            "target": "UZUWUWuu", 
            "line": 0, 
        }
        "from": "UZUWUWuu", 
        "content": {
            "type": 1, 
            "searchableContent": "1234", 
            "pushContent": "", 
            "content": "", 
            "binaryContent": "", 
            "localContent": "", 
            "mediaType": 0, 
            "remoteMediaUrl": "", 
            "localMediaPath": "", 
            "mentionedType": 0, 
            "mentionedTargets": [ ]
        }, 
        "messageId": 52, 
        "direction": 1, 
        "status": 5, 
        "messageUid": 75735276990792720, 
        "timestamp": 1550849394256, 
        "to": ""
    }
 */
export default class Message {
    conversation = {};
    from = '';
    content = {}; 
    messageId = 0;
    direction = 0;
    status = 0;
    messageUid = 0;
    timestamp = 0;
    to = '';

    // static toMessage(obj){
    //     let msg = new Message();
    //     msg.conversation = new Conversation(obj.conversationType,obj.target,obj.line);
    //     msg.from = obj.from;
    //     msg.content = obj.content;
    //     msg.messageId = obj.messageId;
    //     if(obj.from == USER_ID){
    //         msg.direction = 0;
    //     } else {
    //         msg.direction = 1;
    //     }
    //     msg.status = obj.status;
    //     msg.messageUid = obj.messageId;
    //     msg.timestamp = obj.timestamp;
    //     msg.to = obj.target;
    //     return msg;
    // }

    static toMessage(state,sendMessage){
        var message = new Message();
        var target = sendMessage.target;
        if(!target){
            target = state.selectTarget;
        }
        console.log("to message target "+target);
        let stateConversationInfo =  state.conversations.find(conversation => conversation.conversationInfo.target === target);
        console.log("conversationtype "+stateConversationInfo.conversationInfo.conversationType +" target "+stateConversationInfo.conversationInfo.target);
        message.conversation = new Conversation(stateConversationInfo.conversationInfo.conversationType,
            stateConversationInfo.conversationInfo.target,
            stateConversationInfo.conversationInfo.line);
            console.log("send message content "+sendMessage.messageContent)
        message.content = sendMessage.messageContent;
        message.from = state.userId;
        message.status = MessageStatus.Sending;
        message.timestamp = new Date().getTime();
        message.direction = 0;
        message.messageId = new Date().getTime(); 
        return message;
    }

    //方法不支持重载
    static conert2Message(sendMessage){
        var message = new Message();
        var target = sendMessage.target;
        if(!target){
            target = store.state.selectTarget;
        }
        console.log("to message target "+target);
        let stateConversationInfo =  store.state.conversations.find(conversation => conversation.conversationInfo.target === target);
        console.log("conversationtype "+stateConversationInfo.conversationInfo.conversationType +" target "+stateConversationInfo.conversationInfo.target);
        message.conversation = new Conversation(stateConversationInfo.conversationInfo.conversationType,
            stateConversationInfo.conversationInfo.target,
            stateConversationInfo.conversationInfo.line);
        message.content = sendMessage.messageContent;
        message.from = LocalStore.getUserId();
        message.status = MessageStatus.Sending;
        message.timestamp = new Date().getTime();
        message.direction = 0;
        message.messageId = new Date().getTime(); 
        return message;
    }
}