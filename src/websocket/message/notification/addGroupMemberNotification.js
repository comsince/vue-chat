import MessageContentType from '../messageContentType';

import GroupNotificationContent from './groupNotification';
import StringUtils from '../../utils/StringUtil'
import webSocketCli from '../../websocketcli'

export default class AddGroupMemberNotification extends GroupNotificationContent {
    invitor = '';
    invitees = [];

    constructor(invitor, invitees) {
        super(MessageContentType.AddGroupMember_Notification);
        this.invitor = invitor;
        this.invitees = invitees;
    }

    formatNotification() {
        let notifyStr;
        if (this.invitees.length === 1 && this.invitees[0] === this.invitor) {
          if (this.fromSelf) {
              return '您加入了群组';
          } else {
              return webSocketCli.getDisplayName(this.invitor) + ' 加入了群组';
          }
        }

        if (this.fromSelf) {
            notifyStr = '您邀请:';
        } else {
            notifyStr = webSocketCli.getDisplayName(this.invitor) + '邀请:';
        }

        let membersStr = '';
        this.invitees.forEach(m => {
            membersStr += ' ' + webSocketCli.getDisplayName(m);
        });

        return notifyStr + membersStr + '加入了群组';
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            o: this.invitor,
            ms: this.invitees,
        };
        payload.binaryContent = StringUtils.utf8_to_b64(JSON.stringify(obj));
        return payload;
    };

    decode(payload) {
        super.decode(payload);
        let json = StringUtils.b64_to_utf8(payload.binaryContent);
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.invitor = obj.o;
        this.invitees = obj.ms;
    }
}