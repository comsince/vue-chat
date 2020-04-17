import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, FRP } from "../../constant";
import LocalStore from "../store/localstore";

export default class FriendRequestHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == FRP;
    }


    processMessage(proto){
        if(proto.content != null && proto.content != ''){
            var friendRequests = JSON.parse(proto.content);
            var validRequest = [];
            var targeIds = [];
            for(var friendRequest of friendRequests){
               if(friendRequest.from != LocalStore.getUserId()){
                  validRequest.push(friendRequest);
                  targeIds.push(friendRequest.from);
               }
            }
            this.vueWebsocket.getUserInfos(targeIds);
            this.vueWebsocket.sendAction("updateFriendRequest",validRequest);
        }
    }
}