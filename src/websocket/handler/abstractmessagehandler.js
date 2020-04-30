import MessageHandler from "./messageHandler";
import Logger from "../utils/logger";
import FutureResult from '../future/futureResult';
import { SUCCESS_CODE, ERROR_CODE } from "../../constant";
/**
 * 关于promise返回说明
 * 1.对于操作型消息，一般只需要返回成功与失败即可
 * 2.对于结果型消息，一般判断是否为空
 */
export default class AbstractMessageHandler extends MessageHandler{

    constructor(vueWebsocket){
        super();
        this.vueWebsocket = vueWebsocket;
    }

    get vueWebsocketClient(){
        return this.vueWebsocket;
    }

    processMessage(proto){
        Logger.log("AbstractMessageHandler messageId "+proto.messageId +" proto content "+proto.content);
        var promiseReslove = this.vueWebsocket.resolvePromiseMap.get(proto.messageId);
        if(promiseReslove){
            clearTimeout(promiseReslove.timeoutId);
            if(proto.content == ''){
                promiseReslove.resolve(new FutureResult(ERROR_CODE,proto.content));
            } else {
                promiseReslove.resolve(new FutureResult(SUCCESS_CODE,this.notifyContent(proto.content)));
            }   
            this.vueWebsocket.resolvePromiseMap.delete(proto.messageId);
        }
    }

    notifyContent(content){
       return content
    }

}