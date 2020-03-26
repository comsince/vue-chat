import CallState from "./callState";
export default class CallSession{
    callId;
    clientId;
    audioOnly;
    startTime;
    sessionCallback;
    callState;
    voipClient;

    constructor(voipClient){
        this.startTime = new Date().getTime();
        this.voipClient = voipClient;
    }

    setState(state){
       this.callState = state;
       console.log("set current call state "+this.callState);
       if(this.sessionCallback){
           this.sessionCallback.didChangeState(this.callState);
       }
    }

    endCall(endCallReason){
       this.setState(CallState.STATUS_IDLE);
       this.voipClient.closeCall();
       this.voipClient.currentSession = null;
       if(this.sessionCallback){
         this.sessionCallback.didCallEndWithReason(endCallReason);
       }
    }
}