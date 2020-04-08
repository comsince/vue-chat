import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FHR } from "../../constant";
import Logger from "../utils/logger";

export default class HandleFriendRequestHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FHR;
    }

    processMessage(proto){
        if(proto.content && proto.content != ''){
           var message = JSON.parse(proto.content);
           Logger.log("handle friend request "+message);
        }
    }
}