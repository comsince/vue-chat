import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, GQNUT } from "../../constant";
import LocalStore from "../store/localstore";

export default class UploadTokenHandler extends AbstractMessageHandler{
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == GQNUT;
    }

    processMessage(proto){
        if(proto.content){
            var uploadTokenResponse = JSON.parse(proto.content);
            var domain = uploadTokenResponse.domain;
            var token = uploadTokenResponse.token;
            console.log("domain "+domain+" token "+token);
            LocalStore.setUploadToken(domain,token);
        }
    }
}