import AbstractMessageHandler from "./abstractmessagehandler";
import { PUBLISH, MN } from "../../constant";
import LocalStore from "../store/localstore";

export default class NotifyMessageHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUBLISH && proto.subSignal == MN;
    }

    processMessage(proto){
        console.log("notifymessage "+proto.content);
        let notify = JSON.parse(proto.content);
        console.log("notify messageHead "+notify.messageHead+" notify type "+notify.type);
        //更新messageHead
        LocalStore.resetSendMessageCount();
        LocalStore.setLastMessageSeq(notify.messageHead);
        this.vueWebsocket.pullMessage(notify.messageHead,notify.type,1);
    }
}