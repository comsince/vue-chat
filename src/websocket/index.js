import {PUBLISH, FP, UPUI, MP, MS, KEY_VUE_USER_ID, KEY_VUE_DEVICE_ID, DISCONNECT, GPGI, GQNUT, US, FAR, FRP, FHR, MMI, GPGM, GC, GQ, PUB_ACK, ERROR_CODE, MR, GAM, GMI, GKM, GD, GMURL, FALS} from '../constant'
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
import PromiseResolve from './future/promiseResolve';
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE} from '../constant/index'
import vuexStore from '../store'
import Logger from './utils/logger';
import GroupInfo from './model/groupInfo';
import GroupType from './model/groupType';
import GroupMember from './model/groupMember';
import GroupMemberType from './model/groupMemberType';
import CreateGroupHandler from './handler/createGroupHandler';
import QuitGroupHandler from './handler/quitGroupHandler';
import { fail } from 'assert';
import FutureResult from './future/futureResult';
import RecallMessageHandler from './handler/recallMessageHandler';
import NotifyRecallMessageHandler from './handler/notifyRecallMessageHandler';
import AddGroupMemberHandler from './handler/addGroupMemberHandler';
import KickGroupMemberHandler from './handler/kickGroupmemberHandler'
import DismissGroupHandler from './handler/dismissGroupHandler';
import GetMinioUploadUrlHandler from './handler/getMinioUploadUrlHandler';
import SetFriendAliasRequestHandler from './handler/setFriendAliasRequestHandler';
export default class VueWebSocket {
    handlerList = [];
    userDisconnect = false;
    isconnected = false;
    resolvePromiseMap = new Map();
    
    // constructor(ws_protocol,ip,port,heartbeatTimeout,reconnectInterval,binaryType,vuexStore){
    //     this.ws_protocol = ws_protocol;
    //     this.ip= ip;
    //     this.port = port;
    //     this.heartbeatTimeout = heartbeatTimeout;
    //     this.reconnectInterval = reconnectInterval;
    //     this.binaryType = binaryType;
    //     this.url = ws_protocol + '://' + ip + ':'+ port;
    //     this.vuexStore = vuexStore;
    //     this.initHandlerList();
    // }

    constructor(){
        this.ws_protocol = WS_PROTOCOL;
        this.ip= WS_IP;
        this.port = WS_PORT;
        this.heartbeatTimeout = HEART_BEAT_INTERVAL;
        this.reconnectInterval = RECONNECT_INTERVAL;
        this.binaryType = BINTRAY_TYPE;
        this.url = WS_PROTOCOL + '://' + WS_IP ;
        this.initHandlerList();
        this.connect(true);
    }

    // constructor(ws_protocol,ip,port,heartbeatTimeout,reconnectInterval,binaryType){
    //     this.ws_protocol = ws_protocol;
    //     this.ip= ip;
    //     this.port = port;
    //     this.heartbeatTimeout = heartbeatTimeout;
    //     this.reconnectInterval = reconnectInterval;
    //     this.binaryType = binaryType;
    //     this.url = ws_protocol + '://' + ip + ':'+ port;
    //     this.initHandlerList();
    // }

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
        vuexStore.dispatch(type,data);
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
        this.handlerList.push(new CreateGroupHandler(this));
        this.handlerList.push(new QuitGroupHandler(this));
        this.handlerList.push(new RecallMessageHandler(this));
        this.handlerList.push(new NotifyRecallMessageHandler(this));
        this.handlerList.push(new AddGroupMemberHandler(this));
        this.handlerList.push(new KickGroupMemberHandler(this));
        this.handlerList.push(new DismissGroupHandler(this));
        this.handlerList.push(new GetMinioUploadUrlHandler(this))
        this.handlerList.push(new SetFriendAliasRequestHandler(this))
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
    getFriend(version = 0){
        this.sendPublishMessage(FP,{version : version});
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

    async getUserInfo(userId){
        var promise = await this.sendPublishMessage(UPUI,[userId]);
        return promise
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

    async getGroupMember(groupId,refresh){
       return await this.sendPublishMessage(GPGM,{
           groupId: groupId,
           version: 0
       })
    }

    async addMembers(groupId,memberIds){
       var groupMembers = [];
       for(var memberId of memberIds){
            var groupMember = new GroupMember();
            groupMember.memberId = memberId;
            groupMember.type = GroupMemberType.Normal;
            groupMembers.push(groupMember);
       }
       return await this.sendPublishMessage(GAM,{
           groupId: groupId,
           groupMembers: groupMembers
       });
    }

    async kickeMembers(groupId,memberIds){
       return await this.sendPublishMessage(GKM,{
           groupId: groupId,
           memberIds: memberIds
       });
    }

    async createGroup(groupName,memberIds){
        var groupInfo = new GroupInfo();
        groupInfo.name = groupName;
        groupInfo.type = GroupType.Normal;
        var groupMembers = [];
        for(var memberId of memberIds){
            var groupMember = new GroupMember();
            groupMember.memberId = memberId;
            groupMember.type = memberId == LocalStore.getUserId() ? GroupMemberType.Owner : GroupMemberType.Normal;
            groupMembers.push(groupMember);
        }
        return await this.sendPublishMessage(GC,{
            groupInfo: groupInfo,
            groupMembers: groupMembers
        });
    }

    async modifyGroupInfo(info){
        return await this.sendPublishMessage(GMI,info);
    }

    async quitGroup(groupId){
       return await this.sendPublishMessage(GQ,{
           groupId: groupId
       });
    }

    async dismissGroup(groupId){
        return await this.sendPublishMessage(GD,{
            groupId: groupId
        });
    }

    async recallMessage(messageUid){
       return await this.sendPublishMessage(MR,{
            messageUid: messageUid
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

    async getMinioUploadUrl(mediaType,key){
        var content = {
            mediaType: mediaType,
            key: key
        }
        return await this.sendPublishMessage(GMURL,content)
    }

    async modifyFriendAlias(targetUid,alias){
        var content = {
            reason: alias,
            targetUserId: targetUid
        }
        return await this.sendPublishMessage(FALS,content)
    }

    /**
     * 
     * @param {子信令} subsignal 
     * @param {消息体内容} content 
     */
    sendPublishMessage(subsignal,content,protoMessageId = 0){
        var websocketprotomessage = new WebSocketProtoMessage();
        websocketprotomessage.setSignal(PUBLISH);
        websocketprotomessage.setSubSignal(subsignal);
        websocketprotomessage.setContent(content);
        var messageId = LocalStore.getMessageId();
        if(messageId > 65535){
            messageId = 0;
        }
        websocketprotomessage.setMessageId(++messageId);
        LocalStore.saveMessageId(messageId);
        this.send(websocketprotomessage.toJson());
        
        var vueWebSocket = this;
        var pubAckPromise = new Promise((resolve) => {
             var timeoutId = setTimeout(() => {
                 if(subsignal == MS){
                    var failProtoMessage = new WebSocketProtoMessage();
                    failProtoMessage.setSignal(PUB_ACK);
                    failProtoMessage.setSubSignal(subsignal)
                    failProtoMessage.setMessageId(messageId);
                    failProtoMessage.setContent('')
                    vueWebSocket.processMessage(failProtoMessage.toJson())
                 } else {
                    resolve(new FutureResult(ERROR_CODE,""));
                 }
                 
             },10000);
             var resolvePromise = new PromiseResolve(resolve,timeoutId);
             resolvePromise.protoMessageId = protoMessageId;
             vueWebSocket.resolvePromiseMap.set(messageId,resolvePromise);
        });
        return pubAckPromise;
    }

    sendMessage(protoMessage){
       this.sendPublishMessage(MS,protoMessage,protoMessage.messageId);
    }
}
