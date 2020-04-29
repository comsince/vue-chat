
/**
 * websocket json 主协议
 * 
 * {
	"signal": "connect",
	"sub_signal": "conect_ack",
	"message_id": 0,
	"content": ""
    }
 */
export class WebSocketProtoMessage {
    signal;
    subSignal;

    constructor(){
        console.log('constuctor WebSocketProtoMessage');
    }

    setMessageId(messageId){
        this.messageId = messageId;
    }

    setSignal(signal){
        this.signal = signal;
    }

    setSubSignal(subSignal){
        this.subSignal = subSignal;
    }

    setContent(content){
        this.content = content; 
    }

    toJson(){
        let message = {
            signal : this.signal,
            subSignal : this.subSignal == null ? 'NONE' : this.subSignal,
            messageId : this.messageId == null ? 0 : this.messageId,
            content : this.content
        }

        return JSON.stringify(message);
    }
}