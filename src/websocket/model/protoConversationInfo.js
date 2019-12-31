export default class ProtoConversationInfo{
    conversationType;
    target;
    line;
    lastMessage = {};
    timestamp = 0;
    draft = '';
    unreadCount = {};
    isTop = false;
    isSilent = false;
}