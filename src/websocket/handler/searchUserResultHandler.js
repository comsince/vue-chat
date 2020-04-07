import AbstractMessageHandler from "./abstractmessagehandler";
import { US,PUB_ACK } from "../../constant";
import Logger from "../utils/logger";
import UserInfo from "../model/userInfo";

export default class SearchUserResultHandler extends AbstractMessageHandler{
   match(proto){
     return proto.signal == PUB_ACK && proto.subSignal == US;
   }

   processMessage(proto){
     var searchUserList = JSON.parse(proto.content);
     this.vueWebsocket.sendAction("updateSearchUser",searchUserList);
   }
}