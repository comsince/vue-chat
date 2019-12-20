export default class VueWebSocket {
    constructor(ws_protocol,ip,port,heartbeatTimeout,reconnectInterval,binaryType){
        this.ws_protocol = ws_protocol;
        this.ip= ip;
        this.port = port;
        this.heartbeatTimeout = heartbeatTimeout;
        this.reconnectInterval = reconnectInterval;
        this.binaryType = binaryType;
        this.url = ws_protocol + '://' + ip + ':'+ port;
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
        }
        this.ws.onmessage = function(event) {
            console.log("ws onmessage");
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
}