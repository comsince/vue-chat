import UnreadCount from "./unReadCount";

export default class ProtoConversationInfo{
    conversationType;
    target;
    line;
    lastMessage = {};
    timestamp = 0;
    draft = '';
    unreadCount = new UnreadCount();
    isTop = false;
    isSilent = false;
}