import VueSocket from './index'

/**
 * 登录信令，格式如下
 * {
	"signal": "connect",
	"sub_signal": "conect_ack",
	"message_id": 0,
	"content": {
        "user":"",
        "token":""
    }
}
 */
export default class Login{
    constructor(vueSocket){
        this.vueSocket = vueSocket;
    }

    login(){

    }
}