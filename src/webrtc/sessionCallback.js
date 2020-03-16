export default class SessionCallback{
    didCallEndWithReason(callReason){}

    didChangeState(callState){}

    didChangeMode(mode){}

    didCreateLocalVideoTrack(stream){}

    didReceiveRemoteVideoTrack(stream){}

    didError(error){}

    didGetStats(stats){}
}