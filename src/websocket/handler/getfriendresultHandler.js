import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FP } from "../../constant";

export default class GetFriendResultHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FP;
    }

    processMessage(proto){
        var friendList  = JSON.parse(proto.content);
        var userIds = [];
        for(var i in friendList){
            userIds[i] = friendList[i].friendUid;
        }
        this.vueWebsocket.getUserInfos(userIds);
    }
}