import AbstractMessageHandler from "./abstractmessagehandler";
import { MS, PUB_ACK } from "../../constant";
import LocalStore from "../store/localstore";

export default class SendMessageHandler extends AbstractMessageHandler{

    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == MS;
    }

    processMessage(proto){
        var content = JSON.parse(proto.content);
        console.log("SendMessageHandler messageId "+content.messageId+" timestamp "+content.timestamp);
        LocalStore.updateSendMessageCount();
    }
}