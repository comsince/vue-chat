import AbstractMessageHandler from "./abstractmessagehandler";
import { PUBLISH, RMN } from "../../constant";

export default class NotifyRecallMessageHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUBLISH && proto.subSignal == RMN;
    }

    processMessage(proto){
       if(proto.content){
            var notifyRecalMessage = JSON.parse(proto.content);
            console.log("from user "+notifyRecalMessage.fromUser + " messageUid "+notifyRecalMessage.messageUid);
            this.vueWebsocket.sendAction('updateMessageContent',notifyRecalMessage);
       }
    }

}