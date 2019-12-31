import { CONNECT_ACK } from "../../constant";
import AbstractMessageHandler from "./abstractmessagehandler";

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
        //console.log("connectAcceptedMessage friendHead "+connectAcceptedMessage.friendHead+" messageHead "+connectAcceptedMessage.c);
        //拉取朋友列表
        this.vueWebsocket.getFriend();
        //初始拉取消息列表
        this.vueWebsocket.pullMessage(connectAcceptedMessage.messageHead,0);
    }
}