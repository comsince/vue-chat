import AbstractMessageHandler from "./abstractmessagehandler";
import { GPGI, PUB_ACK } from "../../constant";
import GroupInfo from "../model/groupInfo";

export default class GetGroupInfoHandler extends AbstractMessageHandler{

    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GPGI;
    }

    processMessage(proto){
        if(proto.content != null){
           var groupInfoList = JSON.parse(proto.content);
           var groups = [];
           for(var groupInfo of groupInfoList){
               groups.push(GroupInfo.convert2GroupInfo(groupInfo));
           }
           this.vueWebsocket.sendAction("updateGroupInfos",groups);
        }
    }
}