export default class CallSession{
    callId;
    clientId;
    audioOnly;
    startTime;

    constructor(){
        this.startTime = new Date().getTime();
    }
}