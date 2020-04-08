import AbstractMessageHandler from "./abstractmessagehandler";
import { PUBLISH, FRN } from "../../constant";
import Logger from "../utils/logger";

export default class NotifyFriendRequestHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUBLISH && proto.subSignal == FRN;
    }


    processMessage(proto){
        if(proto.content != null){
           var friendRequestNotification = JSON.parse(proto.content);
           Logger.log("friend request version "+friendRequestNotification.version);
           this.vueWebsocket.getFriendRequest(friendRequestNotification.version);
        }
    }
}