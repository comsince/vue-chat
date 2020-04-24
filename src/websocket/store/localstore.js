import { KEY_VUE_USER_ID } from "../../constant";

/**
 * 本地缓存，包括如下基本信息
 * 消息缓存
 * 消息当前序列号，用于消息拉取
 * 朋友列表信息
 * 群组信息
 */
export default class LocalStore {

    static saveConverSations(value){
        localStorage.setItem("coversations",JSON.stringify(value));
    }

    static getConversations(){
        let vaule = localStorage.getItem("coversations");
        return JSON.parse(vaule);
    }

    static getLastMessageSeq(){
        return localStorage.getItem("last_message_seq");
    }

    //设置上传token，根据不同media类型存储
    static setUploadToken(key,token){
        localStorage.setItem(key,token);
    }

    static getImageUploadToken(){
        return localStorage.getItem("http://image.comsince.cn/");
    }

    /**
     * messageSeq为string类型
     */
    static setLastMessageSeq(messageSeq){
        localStorage.setItem("last_message_seq",messageSeq);
    }

    static saveMessages(value){
        localStorage.setItem("messages",JSON.stringify(value));
    }

    static getMessages(){
        let value = localStorage.getItem("messages");
        return JSON.parse(value);
    }

    static saveUserInfoList(value){
        localStorage.setItem("user_infos_list",JSON.stringify(value));
    }

    static getUserInfoList(){
        let value = localStorage.getItem("user_infos_list");
        return JSON.parse(value);
    }

    /**
     * 记录消息发送条数主要时为了
     */
    static updateSendMessageCount(){
        let value = localStorage.getItem("send_message_count");
        if(value){
            value  = parseInt(value) + 1;
        } else {
            value = 1;
        }
        localStorage.setItem("send_message_count",value);
    }

    static getSendMessageCount(){
        let value = localStorage.getItem("send_message_count");
        if(!value){
            value = 0;
        }
        return value;
    }

    static resetSendMessageCount(){
        localStorage.setItem("send_message_count",0);
    }

    static getUserId(){
        return localStorage.getItem(KEY_VUE_USER_ID);
    }

    static setSelectTarget(value){
        localStorage.setItem("select_target",value);
    }

    static getSelectTarget(){
        return localStorage.getItem("select_target");
    }

    static setFriendRequestVersion(version){
        localStorage.setItem("friend_request_version",version);
    }

    static getFriendRequestVersion(){
        return localStorage.getItem("friend_request_version");
    }

    static saveMessageId(messageId){
       localStorage.setItem("message_id",messageId);
    }

    static getMessageId(){
        var messageId = localStorage.getItem("message_id");
        if(!messageId){
            messageId = 0;
        }
        return messageId;
    }

    static clearLocalStore(){
        localStorage.setItem("coversations","");
        localStorage.setItem("last_message_seq","");
        localStorage.setItem("messages","");
        localStorage.setItem("send_message_count",0);
        localStorage.setItem("select_target","");
        localStorage.setItem("friend_request_version",0);
        localStorage.setItem(KEY_VUE_USER_ID,'');
        localStorage.setItem("message_id",0);
    }
}