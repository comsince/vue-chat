import MessageContent from '../../websocket/message/messageContent';
import MessageContentType from '../../websocket/message/messageContentType';
import StringUtils from "../../websocket/utils/StringUtil"
export default class CallStartMessageContent extends MessageContent {
  callId;
  targetId;
  connectTime;
  endTime;
  status;
  audioOnly;

  constructor(callId, targetId, audioOnly){
    super(MessageContentType.VOIP_CONTENT_TYPE_START);
    this.callId = callId;
    this.targetId = targetId;
    this.audioOnly = audioOnly;
  }

  digest() {
      if (this.audioOnly) {
          return '[语音通话]';
      } else {
          return '[视频通话]';
      }
  }

  encode() {
      let payload = super.encode();
      payload.content = this.callId;

      let obj = {
          c: this.connectTime,
          e: this.endTime,
          s: this.status,
          a: this.audioOnly ? 1 : 0,
          t:this.targetId
      };
      payload.binaryContent = StringUtils.utf8_to_b64(JSON.stringify(obj));
      return payload;
  };

  decode(payload) {
      super.decode(payload);
      this.callId = payload.content;
      let json = StringUtils.b64_to_utf8(payload.binaryContent);
      let obj = JSON.parse(json);

      this.connectTime = obj.c;
      this.endTime = obj.e;
      this.status = obj.s;
      this.audioOnly = (obj.a === 1);
      this.targetId = obj.t;
  }
}