export default class SendMessage{
    target;
    messageContent;
    tos;

    constructor(target,messageContent,tos=''){
        this.target = target;
        this.messageContent = messageContent;
        this.tos = tos;
    }
}