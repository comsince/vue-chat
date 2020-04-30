import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GQ } from "../../constant";

export default class QuitGroupHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GQ;
    }
}