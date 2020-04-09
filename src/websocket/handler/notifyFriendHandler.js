import AbstractMessageHandler from "./abstractmessagehandler";
import { FN, PUBLISH } from "../../constant";
import Logger from "../utils/logger";

export default class NotifyFriendHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUBLISH && proto.subSignal == FN;
    }

    processMessage(proto){
        if(proto.content && proto.content != ''){
            var friendNotify = JSON.parse(proto.content);
            Logger.log("friend head "+friendNotify.head);
            this.vueWebsocket.getFriend();
        }
    }
}