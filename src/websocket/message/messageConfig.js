import PersistFlag  from './persistFlag'
import UnknownMessageContent from './unknownMessageContent'
import MessageContentType from './messageContentType'
import TextMessageContent  from './textMessageContent'
import UnsupportMessageContent from './unsupportMessageContent'
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


    static MessageContents = [
        {
            name: 'text',
            flag: PersistFlag.Persist_And_Count,
            type: MessageContentType.Text,
            contentClazz: TextMessageContent,
        }
    ]; 
}