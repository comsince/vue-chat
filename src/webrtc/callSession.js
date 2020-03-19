export default class CallSession{
    callId;
    clientId;
    audioOnly;
    startTime;
    sessionCallback;
    callState;

    constructor(){
        this.startTime = new Date().getTime();
    }

    setState(state){
       this.callState = state;
       if(this.sessionCallback){
           this.sessionCallback.didChangeState(this.callState);
       }
    }

    endCall(endCallReason){
       if(this.sessionCallback){
         this.sessionCallback.didCallEndWithReason(endCallReason);
       }
    }
}