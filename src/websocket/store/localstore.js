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

    static clearLocalStore(){
        localStorage.setItem("coversations","");
        localStorage.setItem("last_message_seq","");
        localStorage.setItem("messages","");
        localStorage.setItem("send_message_count",0);
    }
}