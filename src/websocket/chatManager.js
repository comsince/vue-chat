export default class ChatManager {
    static onReceiveMessageListeners = [];

    static addReceiveMessageListener(listener){
        this.onReceiveMessageListeners.push(listener);
    }

    static onReceiveMessage(protoMessage){
         for(var messageListener of this.onReceiveMessageListeners){
             messageListener.onReceiveMessage(protoMessage);
         }
    }

    static removeOnReceiveMessageListener(){
        ChatManager.onReceiveMessageListeners = [];
    }
}