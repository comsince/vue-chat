import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FALS } from "../../constant";

export default class SetFriendAliasRequestHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FALS;
    }

}