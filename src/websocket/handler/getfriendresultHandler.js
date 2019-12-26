import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FP } from "../../constant";

export default class GetFriendResultHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FP;
    }

    processMessage(proto){
        var friendList  = JSON.parse(proto.content);
        var stateFriendList = [];
        for(var i in friendList){
            stateFriendList.push({
                id: parseInt(i) + 1,
                wxid: friendList[i].friendUid, //微信号
                initial: friendList[i].friendUid.substring(0,1), //姓名首字母
                img: 'static/images/newfriend.jpg', //头像
                signature: "", //个性签名
                nickname: friendList[i].friendUid,  //昵称
                sex: 0,   //性别 1为男，0为女
                remark: friendList[i].friendUid,  //备注
                area: "",  //地区
            });
        }
        this.vueWebsocket.sendAction("updateFriendList",stateFriendList);
    }
}