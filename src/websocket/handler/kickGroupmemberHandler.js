import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GKM } from "../../constant";

export default class KickGroupMemberHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GKM;
    }
}