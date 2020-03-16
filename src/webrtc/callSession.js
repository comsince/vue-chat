export default class CallSession{
    callId;
    clientId;
    audioOnly;
    startTime;
    sessionCallback;

    constructor(){
        this.startTime = new Date().getTime();
    }
}