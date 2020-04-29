import AbstractMessageHandler from "./abstractmessagehandler";
import { MS, PUB_ACK } from "../../constant";
import LocalStore from "../store/localstore";
import Logger from "../utils/logger";
import MessageStatus from "../message/messageStatus";

export default class SendMessageHandler extends AbstractMessageHandler{

    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == MS;
    }

    processMessage(proto){
        Logger.log("sendMessage Handler messageId "+proto.messageId)
        if(this.vueWebsocket.resolvePromiseMap.has(proto.messageId)){
            var promiseReslove = this.vueWebsocket.resolvePromiseMap.get(proto.messageId);
            if(proto.content != ''){
                var content = JSON.parse(proto.content);
                console.log("SendMessageHandler messageId "+content.messageId+" timestamp protoMessageId "+promiseReslove.protoMessageId);
                this.vueWebsocket.sendAction("updateProtoMessageUid",{
                    messageId: promiseReslove.protoMessageId,
                    messageUid: content.messageId
                });
                //update messageStatus
                this.vueWebsocket.sendAction("updateMessageStatus",{
                    messageId: promiseReslove.protoMessageId,
                    status: MessageStatus.Sent
                });
                LocalStore.updateSendMessageCount();
                promiseReslove.resolve('success');
            } else {
                this.vueWebsocket.sendAction("updateMessageStatus",{
                    messageId: promiseReslove.protoMessageId,
                    status: MessageStatus.SendFailure
                });
                promiseReslove.resolve('fail');
            }
            clearTimeout(promiseReslove.timeoutId);
            this.vueWebsocket.resolvePromiseMap.delete(proto.messageId);
        }

    }
}