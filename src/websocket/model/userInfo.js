export default class UserInfo {
    uid = '';
    name = '';
    displayName = '';
    gender = 0;
    portrait = '';
    mobile = '';
    email = '';
    address = '';
    social = '';
    extra = '';
    type = 0; //0 normal; 1 robot; 2 thing;
    updateDt = 1550652404513;

    static convert2UserInfo(jsonObj){
        let userInfo = new UserInfo();
        userInfo.uid = jsonObj.uid;
        userInfo.name = jsonObj.name;
        userInfo.displayName = jsonObj.displayName;
        userInfo.gender = jsonObj.gender;
        userInfo.portrait = jsonObj.portrait;
        userInfo.mobile = jsonObj.mobile;
        userInfo.email = jsonObj.email;
        userInfo.address = jsonObj.address;
        userInfo.social = jsonObj.social;
        userInfo.extra = jsonObj.extra;
        userInfo.type = jsonObj.type;
        userInfo.updateDt = jsonObj.updateDt;
        return userInfo;
    }
}