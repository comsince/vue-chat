import MessageContent from '../../websocket/message/messageContent';
import MessageContentType from '../../websocket/message/messageContentType';
import StringUtils from "../../websocket/utils/StringUtil"
export default class CallSignalMessageContent extends MessageContent {
    callId;
    payload;
  
    constructor(mentionedType = 0, mentionedTargets = []) {
        super(MessageContentType.VOIP_CONTENT_TYPE_SIGNAL, mentionedType, mentionedTargets);
    }
  
    digest() {
        return '';
    }
  
    encode() {
        let payload = super.encode();
        payload.content = this.callId;
        payload.binaryContent = StringUtils.utf8_to_b64(this.payload);
        return payload;
    };
  
    decode(payload) {
        super.decode(payload);
        this.callId = payload.content;
        this.payload = StringUtils.b64_to_utf8(payload.binaryContent);
    }
  }