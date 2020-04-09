import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, UPUI } from "../../constant";
import UserInfo from "../model/userInfo";

export default class GetUserInfoHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == UPUI;
    }

    processMessage(proto){
       if(proto.content != null){
           var userInfoList = JSON.parse(proto.content);
           var stateFriendList = [];
           var userInfos = [];
           for(var i in userInfoList){
               var displayName = userInfoList[i].displayName === '' ? userInfoList[i].mobile : userInfoList[i].displayName;
               stateFriendList.push({
                id: parseInt(i) + 1,
                wxid: userInfoList[i].uid, //微信号
                initial: userInfoList[i].uid.substring(0,1), //姓名首字母
                img: userInfoList[i].portrait, //头像
                signature: "", //个性签名
                nickname: displayName,  //昵称
                sex: 0,   //性别 1为男，0为女
                remark: displayName,  //备注
                area: userInfoList[i].address,  //地区
               });
               userInfos.push(UserInfo.convert2UserInfo(userInfoList[i]));
           }
           console.log("state user size "+stateFriendList.length);
           this.vueWebsocket.sendAction("updateUserInfos",userInfos);
           this.vueWebsocket.sendAction("updateFriendList",stateFriendList);
       }
    }
}