import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FP } from "../../constant";

export default class GetFriendResultHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FP;
    }

    processMessage(proto){
        var friendList  = JSON.parse(proto.content);
        for(var i in friendList){
            console.log(friendList[i].friendUid);
        }
    }
}