import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GAM } from "../../constant";

export default class AddGroupMemberHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GAM;
    }
}