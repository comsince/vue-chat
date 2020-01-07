import GroupType from './groupType'
export default class GroupInfo {
    target = '';
    name = '';
    portrait = '';
    owner = '';
    type = GroupType.Normal;
    memberCount = 0;
    extra = '';
    updateDt = 0;

    static convert2GroupInfo(jsonObj){
       var groupInfo = new GroupInfo();
       groupInfo.target = jsonObj.target;
       groupInfo.name = jsonObj.name;
       groupInfo.portrait = jsonObj.portrait;
       groupInfo.owner = jsonObj.owner;
       groupInfo.type = jsonObj.type;
       groupInfo.memberCount = jsonObj.memberCount;
       groupInfo.extra = jsonObj.extra;
       groupInfo.updateDt = jsonObj.updateDt;
       return groupInfo;
    }
}