import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GMURL } from "../../constant";

export default class GetMinioUploadUrlHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GMURL;
    }
    notifyContent(content){
        var result = JSON.parse(content);
        return result;
    }
}