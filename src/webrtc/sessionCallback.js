export default class SessionCallback{
    didCallEndWithReason(callEndReason,sender = ''){}

    didChangeState(callState){}

    didChangeMode(mode){}

    didCreateLocalVideoTrack(stream){}

    didReceiveRemoteVideoTrack(stream,sender = ''){}

    didReceiveRemoteAudioTrack(stream){}

    didError(error){}

    didGetStats(stats){}
}