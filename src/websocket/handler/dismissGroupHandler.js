import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GD } from "../../constant";

export default class DismissGroupHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GD;
    }
}