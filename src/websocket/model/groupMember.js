export default class GroupMember {
    groupId = '';
    memberId = '';
    alias = '';
    type = 0;
    updateDt = 0;
    diplayName = '';
    avatarUrl = '';

    static convert2GroupMember(jsonObj){
        var groupMember = new GroupMember();
        groupMember.memberId = jsonObj.memberId;
        groupMember.alias = jsonObj.alias;
        groupMember.type = jsonObj.type;
        groupMember.updateDt = jsonObj.updateDt;
        return groupMember;
    }
}