import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GPGM } from "../../constant";
import GroupMember from "../model/groupMember";

export default class GetGroupMemberHandler extends AbstractMessageHandler {
     match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GPGM;
     }

     processMessage(proto){
        if(proto.content){
           var groupMemberList = JSON.parse(proto.content);
           var groupMembers = [];
           for(var groupMember of groupMemberList){
               groupMembers.push(GroupMember.convert2GroupMember(groupMember));
           }
           this.vueWebsocket.sendAction("updateTempGroupMember",groupMembers);
        }
     }
}