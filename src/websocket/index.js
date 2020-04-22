import {PUBLISH, FP, UPUI, MP, MS, KEY_VUE_USER_ID, KEY_VUE_DEVICE_ID, DISCONNECT, GPGI, GQNUT, US, FAR, FRP, FHR, MMI, GPGM} from '../constant'
import {decrypt,encrypt} from './utils/aes'
import {CONNECT} from '../constant'
import {WebSocketProtoMessage} from './message/websocketprotomessage'
import ConnectAckHandler from './handler/connectackhandler';
import GetFriendResultHandler from './handler/getfriendresultHandler';
import GetUserInfoHandler from './handler/getuserinfoHandler';
import ReceiveMessageHandler from './handler/receiveMessageHandler';
import NotifyMessageHandler from './handler/notifyMessageHandler';
import GetGroupInfoHandler from './handler/getGroupInfoHandler';
import SendMessageHandler from './handler/sendMessageHandler';
import UploadTokenHandler from './handler/getUploadtokenHandler'
import LocalStore from './store/localstore';
import SearchUserResultHandler from './handler/searchUserResultHandler';
import FriendAddRequestHandler from './handler/friendAddRequestHandler';
import NotifyFriendRequestHandler from './handler/notifyFriendRequestHandler';
import FriendRequestHandler from './handler/friendRequestHandler';
import HandleFriendRequestHandler from './handler/handleFriendRequestHandler';
import NotifyFriendHandler from './handler/notifyFriendHandler';
import ModifyInfoHandler from './handler/modifyMyInfoHandler';
import GetGroupMemberHandler from './handler/getGroupMemberHandler';

export default class VueWebSocket {
    handlerList = [];
    userDisconnect = false;
    isconnected = false;

    constructor(ws_protocol,ip,port,heartbeatTimeout,reconnectInterval,binaryType,vuexStore){
        this.ws_protocol = ws_protocol;
        this.ip= ip;
        this.port = port;
        this.heartbeatTimeout = heartbeatTimeout;
        this.reconnectInterval = reconnectInterval;
        this.binaryType = binaryType;
        this.url = ws_protocol + '://' + ip + ':'+ port;
        this.vuexStore = vuexStore;
        this.initHandlerList();
    }

    connect(isReconncect){
        this.ws = new WebSocket(this.url);
        console.log("current url "+this.url+" status "+this.ws.readyState);
        this.ws.binaryType = this.binaryType;
        var websocketObj = this;
        this.ws.onopen = function (event) {
            console.log("ws open");
            websocketObj.isconnected = true;
            websocketObj.lastInteractionTime(new Date().getTime());
            websocketObj.pingIntervalId = setInterval(() => {
                 websocketObj.ping();
             }, websocketObj.heartbeatTimeout);
             websocketObj.userDisconnect = false;
             //发送connect指令
             websocketObj.sendConnectMessage();
        }
        this.ws.onmessage = function(event) {
            console.log("ws onmessage["+event.data+"]");
            websocketObj.processMessage(event.data);
            websocketObj.lastInteractionTime(new Date().getTime());
        }
        this.ws.onclose = function(event) {
            websocketObj.isconnected = false;
            console.log("ws onclose");
            websocketObj.ws.close();
            clearInterval(websocketObj.pingIntervalId);
            if(!websocketObj.userDisconnect){
                console.log("reconnect websocket");
                websocketObj.reconnect(event);
            }
        }
        this.ws.onerror = function(event) {
            console.log("connect error");
        }
    }

    reconnect(event){
        var websocketObj = this;
        setTimeout(() => {
            websocketObj.connect(true);
        }, this.reconnectInterval);
    }

    lastInteractionTime(actionTime){
        this.actionTime = actionTime;
    }

    getLastActionTime(){
        return this.actionTime;
    }

    ping(){
        this.send('心跳内容')
    }

    send(data){
        console.log("send message "+data);
        if(this.isconnected){
            this.ws.send(data);
        } else {
            console.log("curent websocket is close");
        }
        
    }

    /**
     * 分发vuex action
     */
    sendAction(type,data){
        this.vuexStore.dispatch(type,data);
    }

    initHandlerList(){
        this.handlerList.push(new ConnectAckHandler(this));
        this.handlerList.push(new GetFriendResultHandler(this));
        this.handlerList.push(new GetUserInfoHandler(this));
        this.handlerList.push(new ReceiveMessageHandler(this));
        this.handlerList.push(new NotifyMessageHandler(this));
        this.handlerList.push(new GetGroupInfoHandler(this));
        this.handlerList.push(new SendMessageHandler(this));
        this.handlerList.push(new UploadTokenHandler(this));
        this.handlerList.push(new SearchUserResultHandler(this));
        this.handlerList.push(new FriendAddRequestHandler(this));
        this.handlerList.push(new NotifyFriendRequestHandler(this));
        this.handlerList.push(new FriendRequestHandler(this));
        this.handlerList.push(new HandleFriendRequestHandler(this));
        this.handlerList.push(new NotifyFriendHandler(this));
        this.handlerList.push(new ModifyInfoHandler(this));
        this.handlerList.push(new GetGroupMemberHandler(this));
    }

    processMessage(data){
        var protoObj = JSON.parse(data);
        for(var i = 0; i < this.handlerList.length; i++){
            if(this.handlerList[i].match(protoObj)){
                 this.handlerList[i].processMessage(protoObj);
            }
        }
    }

    /**
     * 链接建立信息
     */
    sendConnectMessage(){
        console.log("userToken "+localStorage.getItem('vue-token'));
        let allToken = decrypt(localStorage.getItem('vue-token'));
        console.log("decryptToken "+allToken);
        let pwd = allToken.substring(0,allToken.indexOf('|'));
        allToken = allToken.substring(allToken.indexOf('|')+1);
        let secret = allToken.substring(0,allToken.indexOf('|'));
        console.log('[pwd]->'+pwd+' [secret]->'+secret);
        let pwdAesBase64 = encrypt(pwd,secret);
        console.log('encrypt pwd: '+pwdAesBase64);

        var websocketprotomessage =  new WebSocketProtoMessage();
        websocketprotomessage.setSignal(CONNECT);
        var connectMessage = {
            userName: LocalStore.getUserId(),
            password: pwdAesBase64,
            clientIdentifier: localStorage.getItem(KEY_VUE_DEVICE_ID)
        }
        websocketprotomessage.content = connectMessage;
        console.log(websocketprotomessage.toJson());
        this.send(websocketprotomessage.toJson());
    }


    sendDisConnectMessage(){
        var websocketprotomessage = new WebSocketProtoMessage();
        websocketprotomessage.setSignal(DISCONNECT);
        var disconnectMessage = {
            clearSession : 1
        }
        websocketprotomessage.content = disconnectMessage;
        console.log(websocketprotomessage.toJson());
        this.send(websocketprotomessage.toJson());
        this.userDisconnect = true;
    }

    /**
     * 获取朋友列表
     */
    getFriend(){
        this.sendPublishMessage(FP,{version : 0});
    }

    searchUser(keyword){
        var content = {
            keyword: keyword,
            fuzzy: 1,
            page: 0
        }
        this.sendPublishMessage(US,content);
    }

    sendFriendAddRequest(value){
        this.sendPublishMessage(FAR,value);
    }

    getFriendRequest(version){
        this.sendPublishMessage(FRP,{
            version: version
        });
    }

    handleFriendRequest(value){
        this.sendPublishMessage(FHR,value);
    }
    
    /**
     * 获取用户详细信息
     */
    getUserInfos(userIds){
        this.sendPublishMessage(UPUI,userIds);
    }

    /**
     * 
     * @param {用户信息} info: {
     * type:  0
     * value: 
     * }
     */
    modifyMyInfo(info){
        this.sendPublishMessage(MMI,info);
    }

    /**
     * 
     * @param {群组id} groupId 
     * @param {是否需要刷新} refresh 
     */
    getGroupInfo(groupId,refresh){
        var groupIds = [];
        groupIds.push(groupId);
        this.sendPublishMessage(GPGI,groupIds);
    }

    getGroupMember(groupId,refresh){
       this.sendPublishMessage(GPGM,{
           groupId: groupId,
           version: 0
       })
    }

    pullMessage(messageId,type = 0,pullType = 0,sendMessageCount = 0){
        this.sendPublishMessage(MP,{
            messageId: messageId,
            type: type,
            pullType : pullType,
            sendMessageCount: sendMessageCount
        });
    }

    getUploadToken(mediaType){
       var content = {
        mediaType: mediaType
       };
       this.sendPublishMessage(GQNUT,content);
    }

    /**
     * 
     * @param {子信令} subsignal 
     * @param {消息体内容} content 
     */
    sendPublishMessage(subsignal,content){
        var websocketprotomessage = new WebSocketProtoMessage();
        websocketprotomessage.setSignal(PUBLISH);
        websocketprotomessage.setSubSignal(subsignal);
        websocketprotomessage.setContent(content);
        this.send(websocketprotomessage.toJson());
    }

    sendMessage(protoMessage){
       this.sendPublishMessage(MS,protoMessage);
    }
}