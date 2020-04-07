import AbstractMessageHandler from "./abstractmessagehandler";
import { FAR,PUB_ACK } from "../../constant";
import Logger from "../utils/logger";

export default class FriendAddRequestHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FAR;
    }

    processMessage(proto){
        var result  = JSON.parse(proto.content);
        Logger.log("friend add request result "+result);
    }
}