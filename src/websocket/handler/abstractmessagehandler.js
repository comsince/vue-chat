import MessageHandler from "./messageHandler";

export default class AbstractMessageHandler extends MessageHandler{

    constructor(vueWebsocket){
        super();
        this.vueWebsocket = vueWebsocket;
    }

    get vueWebsocketClient(){
        return this.vueWebsocket;
    }

}