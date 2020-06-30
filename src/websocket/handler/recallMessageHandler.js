import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, MR } from "../../constant";

export default class RecallMessageHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == MR;
    }

    notifyContent(content){
        var content = JSON.parse(content);
        return content.code;
    }
}