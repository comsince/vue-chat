import PersistFlag  from './persistFlag'
import UnknownMessageContent from './unknownMessageContent'
import MessageContentType from './messageContentType'
import TextMessageContent  from './textMessageContent'
import UnsupportMessageContent from './unsupportMessageContent'
import CallStartMessageContent from '../../webrtc/message/callStartMessageContent'
import CallAnswerMessageContent from '../../webrtc/message/callAnswerMessageContent'
import CallAnswerTMessageContent from '../../webrtc/message/callAnswerTMessageContent'
import CallSignalMessageContent from '../../webrtc/message/callSignalMessageContent'
import ImageMessageContent from './imageMessageContent'
import CallByeMessageContent from '../../webrtc/message/callByeMessageContent'
import CallModifyMessageContent from '../../webrtc/message/callModifyMessageContent'
import CreateGroupNotification from './notification/createGroupNotification'
import ChangeGroupNameNotification from './notification/changeGroupNameNotification'
import NotificationMessageContent from './notification/notificationMessageContent'
import AddGroupMemberNotification from './notification/addGroupMemberNotification'
import QuitGroupNotification from './notification/quitGroupNotification'
import RecallMessageNotification from './notification/recallMessageNotification'
import KickoffGroupMemberNotification from './notification/kickoffGroupMemberNotification'
import DismissGroupNotification from './notification/dismissGroupNotification'
import LocalStore from '../store/localstore'
import VideoMessageContent from './videoMessageContent'
export default class MessageConfig{
    static getMessageContentClazz(type) {
        for (const content of MessageConfig.MessageContents) {
            if (content.type === type) {
                if (content.contentClazz) {
                    return content.contentClazz;
                } else {
                    return UnsupportMessageContent;
                }
            }
        }
        console.log(`message type ${type} is unknown`);
        return UnknownMessageContent;
    }

    static convert2MessageContent(from,protoMessageContent){
        var messageContent = null;
        var contentClazz =  this.getMessageContentClazz(protoMessageContent.type);
        if(contentClazz != UnsupportMessageContent){
           let content = new contentClazz();
           try {
               content.decode(protoMessageContent);
               if (content instanceof NotificationMessageContent) {
                    content.fromSelf = from === LocalStore.getUserId();
               }
               messageContent = content;
           }catch(error){
               console.log("decode message content error "+protoMessageContent);
           }
        } 
        return messageContent;
    }


    static getMessageContentPersitFlag(type) {
        for (const content of MessageConfig.MessageContents) {
            if (content.type === type) {
                return content.flag;
            }
        }
        return 0;
    }

    static isDisplayableMessage(protomessage){
        var messageContent =  protomessage.content;
        if(MessageConfig.getMessageContentPersitFlag(messageContent.type) == PersistFlag.Persist ||
             MessageConfig.getMessageContentPersitFlag(messageContent.type) == PersistFlag.Persist_And_Count){
           return true;
        }
        return false;
     }


    static MessageContents = [
        {
            name: 'unknown',
            flag: PersistFlag.Persist,
            type: MessageContentType.Unknown,
            contentClazz: UnknownMessageContent,
        },
        {
            name: 'text',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Text,
            contentClazz: TextMessageContent,
        },
        {
            name: 'ptext',
            flag: PersistFlag.Persist,
            type: MessageContentType.P_Text,
        },
        {
            name: 'voice',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Voice,
        },
        {
            name: 'image',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Image,
            contentClazz: ImageMessageContent,
        },
        {
            name: 'location',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Location,
        },
        {
            name: 'file',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.File,
        },
        {
            name: 'video',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Video,
            contentClazz: VideoMessageContent
        },
        {
            name: 'sticker',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Sticker,
        },
        {
            name: 'imageText',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.ImageText,
        },
        {
            name: 'tip',
            flag: PersistFlag.Persist,
            type: MessageContentType.Tip_Notification,
        },
        {
            name: 'typing',
            flag: PersistFlag.Transparent,
            type: MessageContentType.Typing,
        },
        {
            name: 'addGroupMemberNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.AddGroupMember_Notification,
            contentClazz: AddGroupMemberNotification
        },
        {
            name: 'changeGroupNameNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.ChangeGroupName_Notification,
            contentClazz: ChangeGroupNameNotification
        },
        {
            name: 'changeGroupPortraitNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.ChangeGroupPortrait_Notification,
        },
        {
            name: 'createGroupNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.CreateGroup_Notification,
            contentClazz: CreateGroupNotification
        },
        {
            name: 'dismissGroupNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.DismissGroup_Notification,
            contentClazz: DismissGroupNotification
        },
        {
            name: 'kickoffGroupMemberNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.KickOffGroupMember_Notification,
            contentClazz: KickoffGroupMemberNotification
        },
        {
            name: 'modifyGroupAliasNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.ModifyGroupAlias_Notification,
        },
        {
            name: 'quitGroupNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.QuitGroup_Notification,
            contentClazz: QuitGroupNotification,
        },
        {
            name: 'transferGroupOwnerNotification',
            flag: PersistFlag.Persist,
            type: MessageContentType.TransferGroupOwner_Notification,
        },
        {
            name: 'recall',
            flag: PersistFlag.Persist,
            type: MessageContentType.RecallMessage_Notification,
            contentClazz: RecallMessageNotification
        },
        {
            name: 'callStartMessageContent',
            flag: PersistFlag.Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_START,
            contentClazz: CallStartMessageContent,
        },
        {
            name: 'callAnswerMessageContent',
            flag: PersistFlag.No_Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_ACCEPT,
            contentClazz: CallAnswerMessageContent,
        },
        {
            name: 'callAnswerTMessageContent',
            flag: PersistFlag.Transparent,
            type: MessageContentType.VOIP_CONTENT_TYPE_ACCEPT_T,
            contentClazz: CallAnswerTMessageContent,
        },
        {
            name: 'callByeMessageContent',
            flag: PersistFlag.No_Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_END,
            contentClazz: CallByeMessageContent,
        },
        {
            name: 'callSignalMessageContent',
            flag: PersistFlag.Transparent,
            type: MessageContentType.VOIP_CONTENT_TYPE_SIGNAL,
            contentClazz: CallSignalMessageContent
        },
        {
            name: 'callModifyMessageContent',
            flag: PersistFlag.No_Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_MODIFY,
            contentClazz: CallModifyMessageContent,
        },
        {
            name: 'callAddParticipant',
            flag: PersistFlag.Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_ADD_PARTICIPANT,
        },
        {
            name: 'callMuteVideo',
            flag: PersistFlag.No_Persist,
            type: MessageContentType.VOIP_CONTENT_TYPE_MUTE_VIDEO,
        },
    ];
}