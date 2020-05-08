import MessageContentType from "./messageContentType";

export default class ProtoMessageContent{
    type;
    searchableContent;
    pushContent;
    content;
    binaryContent; // base64 string, 图片时，不包含头部信息:data:image/png;base64,
    localContent;
    mediaType;
    remoteMediaUrl;
    localMediaPath;
    mentionedType = 0;
    mentionedTargets = [];

    static toProtoMessageContent(content){
        var protoMessageContent = new ProtoMessageContent();
        protoMessageContent.type = content.type;
        protoMessageContent.content = content.content;
        protoMessageContent.searchableContent = content.searchableContent;
        protoMessageContent.pushContent = content.pushContent;
        protoMessageContent.binaryContent = content.binaryContent;
        protoMessageContent.localContent = content.localContent;
        protoMessageContent.mediaType = content.mediaType;
        protoMessageContent.remoteMediaUrl = content.remoteMediaUrl;
        protoMessageContent.localMediaPath = content.localMediaPath;
        protoMessageContent.mentionedType = content.mentionedType;
        protoMessageContent.mentionedTargets = content.mentionedTargets;
        return protoMessageContent;
    }

    static typeToContent(messageContent){
        var showText = "您有新的消息";
        switch(messageContent.type){
            case MessageContentType.Image:
                showText = "[图片]";
                break;
            case MessageContentType.File:
                showText = "[文件]";
                break;
            case MessageContentType.Video:
                showText = "[视频]";
                break;
            case MessageContentType.VOIP_CONTENT_TYPE_START:
                showText = "[网络电话]";
                break;
            case MessageContentType.Tip_Notification:
                showText =  '[通知消息]';   
        }
        return showText;
    }
}