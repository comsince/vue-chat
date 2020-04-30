import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GC, ERROR_CODE, SUCCESS_CODE } from "../../constant";

export default class CreateGroupHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GC;
    }
}