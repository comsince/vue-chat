import vueWebSocket from "./index";

export class WebSocketClient {
    
    getDisplayName(userId){
       return vueWebSocket.getUserInfo(userId);
    }

}

const self = new WebSocketClient();
export default self;