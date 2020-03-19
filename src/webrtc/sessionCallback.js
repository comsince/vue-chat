export default class SessionCallback{
    didCallEndWithReason(callEndReason){}

    didChangeState(callState){}

    didChangeMode(mode){}

    didCreateLocalVideoTrack(stream){}

    didReceiveRemoteVideoTrack(stream){}

    didReceiveRemoteAudioTrack(stream){}

    didError(error){}

    didGetStats(stats){}
}