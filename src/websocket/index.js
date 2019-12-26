import {USER_ID,TOKEN,CLINET_ID, PUBLISH, FP} from '../constant'
import {decrypt,encrypt} from './utils/aes'
import {CONNECT} from '../constant'
import {ProtoMessage} from './message/protomessage'
import ConnectAckHandler from './handler/connectackhandler';
import GetFriendResultHandler from './handler/getfriendresultHandler';

export default class VueWebSocket {
    handlerList = [];

    constructor(ws_protocol,ip,port,heartbeatTimeout,reconnectInterval,binaryType){
        this.ws_protocol = ws_protocol;
        this.ip= ip;
        this.port = port;
        this.heartbeatTimeout = heartbeatTimeout;
        this.reconnectInterval = reconnectInterval;
        this.binaryType = binaryType;
        this.url = ws_protocol + '://' + ip + ':'+ port;
        this.initHandlerList();
    }

    connect(isReconncect){
        this.ws = new WebSocket(this.url);
        console.log("current url "+this.url+" status "+this.ws.readyState);
        this.ws.binaryType = this.binaryType;
        var websocketObj = this;
        this.ws.onopen = function (event) {
            console.log("ws open");
            websocketObj.lastInteractionTime(new Date().getTime());
            websocketObj.pingIntervalId = setInterval(() => {
                 websocketObj.ping();
             }, websocketObj.heartbeatTimeout);
             //发送connect指令
             websocketObj.sendConnectMessage();
        }
        this.ws.onmessage = function(event) {
            console.log("ws onmessage["+event.data+"]");
            websocketObj.processMessage(event.data);
            websocketObj.lastInteractionTime(new Date().getTime());
        }
        this.ws.onclose = function(event) {
            console.log("ws onclose");
            clearInterval(websocketObj.pingIntervalId);
            websocketObj.reconnect(event);
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
        this.ws.send(data);
    }

    sendMessage(){

    }


    initHandlerList(){
        this.handlerList.push(new ConnectAckHandler(this));
        this.handlerList.push(new GetFriendResultHandler(this));
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
        console.log("userToken "+TOKEN);
        let allToken = decrypt(TOKEN);
        console.log("decryptToken "+allToken);
        let pwd = allToken.substring(0,allToken.indexOf('|'));
        allToken = allToken.substring(allToken.indexOf('|')+1);
        let secret = allToken.substring(0,allToken.indexOf('|'));
        console.log('[pwd]->'+pwd+' [secret]->'+secret);
        let pwdAesBase64 = encrypt(pwd,secret);
        console.log('encrypt pwd: '+pwdAesBase64);

        var protoMessage =  new ProtoMessage();
        protoMessage.setSignal(CONNECT);
        var connectMessage = {
            userName: USER_ID,
            password: pwdAesBase64,
            clientIdentifier: CLINET_ID
        }
        protoMessage.content = connectMessage;
        console.log(protoMessage.toJson());
        this.send(protoMessage.toJson());
    }

    getFriend(){
        var  protoMessage  = new ProtoMessage();
        protoMessage.setSignal(PUBLISH);
        protoMessage.setSubSignal(FP);
        protoMessage.setContent({version : 0});
        this.send(protoMessage.toJson());
    }    
}