import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GC } from "../../constant";
import Logger from "../utils/logger";

export default class CreateGroupHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GC;
    }

    processMessage(proto){
        if(this.vueWebsocket.resolvePromiseMap.has(proto.messageId)){
           Logger.log("CreateGroupHandler messageId "+proto.messageId +" proto content "+proto.content);
           var promiseReslove = this.vueWebsocket.resolvePromiseMap.get(proto.messageId);
           clearTimeout(promiseReslove.timeoutId);
           promiseReslove.resolve(proto.content);
           this.vueWebsocket.resolvePromiseMap.delete(proto.messageId);
        }
    }
}