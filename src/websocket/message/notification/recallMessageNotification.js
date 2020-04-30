import NotificationMessageContent from './notificationMessageContent'
import MessageContentType from '../messageContentType';
import StringUtils from '../../utils/StringUtil'
import webSocketCli from '../../websocketcli'

export default class RecallMessageNotification extends NotificationMessageContent {
    operatorId = '';
    messageUid = '';

    constructor(operatorId, messageUid) {
        super(MessageContentType.RecallMessage_Notification);
        this.operatorId = operatorId;
        this.messageUid = messageUid;
    }

    formatNotification() {
        if(this.fromSelf){
            return "您撤回了一条消息";
        }else {
            return webSocketCli.getDisplayName(this.operatorId) + "撤回了一条消息";
        }
    }

    encode() {
        let payload = super.encode();
        payload.content = this.operatorId;
        payload.binaryContent = StringUtils.utf8_to_b64(this.messageUid.toString());
        return payload;
    };

    decode(payload) {
        super.decode(payload);
        this.operatorId = payload.content;
        this.messageUid = StringUtils.b64_to_utf8(payload.binaryContent);
    }
}