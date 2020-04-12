import AbstractMessageHandler from "./abstractmessagehandler";
import { MMI, PUB_ACK } from "../../constant";
import Logger from "../utils/logger";

export default class ModifyInfoHandler extends AbstractMessageHandler{
   match(proto){
    return proto.signal == PUB_ACK && proto.subSignal == MMI;
   }

   processMessage(proto){
       if(proto && proto.content != ''){
          Logger.log("modify myInfo "+proto.content);
       }
   }
}