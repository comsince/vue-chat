import { CONNECT_ACK } from "../../constant";
import AbstractMessageHandler from "./abstractmessagehandler";
import LocalStore from "../store/localstore";

export default class ConnectAckHandler extends AbstractMessageHandler{
    constructor(vueWebsocket){
         super(vueWebsocket);
    }
    match(protoObj){
        return protoObj.signal == CONNECT_ACK;
    }

    processMessage(data){
        console.log("ConnectAckHandler process message");
        var connectAcceptedMessage = JSON.parse(data.content);
        console.log("connectAcceptedMessage friendHead "+connectAcceptedMessage.friendHead+" messageHead "+connectAcceptedMessage.messageHead);
        //拉取朋友列表
        this.vueWebsocket.getFriend();
        let lastMessageSeq = LocalStore.getLastMessageSeq();
        if(!lastMessageSeq){
            lastMessageSeq = '0';
            this.vueWebsocket.sendAction('changetFirstLogin',true);
        } else {
            this.vueWebsocket.sendAction('changetFirstLogin',false);
        }
        //好友请求信息
        this.vueWebsocket.getFriendRequest(LocalStore.getFriendRequestVersion());
        //初始拉取消息列表
        this.vueWebsocket.pullMessage(lastMessageSeq,0,0,LocalStore.getSendMessageCount());
        LocalStore.setLastMessageSeq(connectAcceptedMessage.messageHead);
    }
}