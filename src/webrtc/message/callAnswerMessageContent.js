import MessageContent from '../../websocket/message/messageContent';
import MessageContentType from '../../websocket/message/messageContentType';
import StringUtils from "../../websocket/utils/StringUtil"

export default class CallAnswerMessageContent extends MessageContent {
    callId;
    audioOnly;
  
    constructor(mentionedType = 0, mentionedTargets = []) {
        super(MessageContentType.VOIP_CONTENT_TYPE_ACCEPT, mentionedType, mentionedTargets);
    }
  
    digest() {
        return '';
    }
  
    encode() {
        let payload = super.encode();
        payload.content = this.callId;
  
        var obj;
        if (this.audioOnly) {
            obj = '1';
        } else {
            obj = '0';
        }
        payload.binaryContent = StringUtils.utf8_to_b64(obj);
        return payload;
    };
  
    decode(payload) {
        super.decode(payload);
        this.callId = payload.content;
        let str = StringUtils.b64_to_utf8(payload.binaryContent);
  
        this.audioOnly = (str === '1');
    }
  }