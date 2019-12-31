
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
        console.log('constuctor');
    }

    setMessageId(messageId){
        this.messageId = messageId;
    }

    setSignal(signal){
        this.signal = signal;
    }

    setSubSignal(subSignal){
        this.subsignal = subSignal;
    }

    setContent(content){
        this.content = content; 
    }

    toJson(){
        let message = {
            signal : this.signal,
            subsignal : this.subsignal == null ? 'NONE' : this.subsignal,
            message_id : this.messageId == null ? 0 : this.messageId,
            content : this.content
        }

        return JSON.stringify(message);
    }
}