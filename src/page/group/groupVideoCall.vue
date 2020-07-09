<template>
    <div class="callContent" v-if="showGroupCallVideoDialog">
        <div class="callercontent callshow" style="">
            <div class="exchange-content">
                <div class="playcontent left-big-content">
                    <div class="remote-video"  v-bind:key = index v-for="(item, index) in currentGroupCallMembers">
                        <img class="bigavatar" :src="item.img" v-show="!item.showRemoteVideo"/> 
                        <p class="calltips" v-text="videoTextCallTips" v-show="showCallTips"> 接通中... </p> 
                        <video :id="item.id" autoplay="autoplay" playsinline="" style="display: none;" v-show="item.showRemoteVideo"></video>
                    </div>
                    
                </div> 
                <div class="playcontent right-sml-content">
                    <img id = "wxCallLocalImg" :src="callLocalImg" class="bigavatar" v-show="showCallLocalImg"/> 
                    <video :id="userId" autoplay="autoplay" muted="muted" playsinline="" style="display: none;" v-show="showCallLocalVideo"></video>
                </div>
            </div> 
            <div class="opera-content flexbox">
                <img class="calleravatar" :src="callRemoteImg" /> 
                <span class="flexauto overell callnick" v-text="callDisplayName"></span> 
                <span class="flexbox">
                    <span class="operabtn canclecall btnopacity" v-show="cancelCall" @click="cancel">取消</span> 
                    <span class="operabtn canclecall btnopacity" style="display: none;" v-show="rejectCall" @click="reject">拒绝</span> 
                    <span class="operabtn upcall btnopacity" style="display: none;" v-show="acceptCall" @click="accept">接听</span>
                </span> 
                <span class="talktime flexbox" style="display: none;" v-show="showTalkTime"><i class="iconfont icon-ai-video"></i> <span v-text="talkTime">00:00</span></span> 
                <span class="operabtn canclecall btnopacity" style="display: none;" v-show="hangUpCall" @click="hangUp"><i class="iconfont icon-guaduan"></i>挂断 </span> 
                <button class="screenbtn"><i class="iconfont icon-quanping iconfull" style="display: none;"></i></button> 
                <button class="screenbtn" style="display: none;"><i class="iconfont icon-tuichuquanping iconfull"></i></button>
            </div>
        </div>
    </div>
    
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SessionCallback from '../../webrtc/sessionCallback';
import EngineCallback from '../../webrtc/engineCallback';
export default {
    data(){
        return {
            currentGroupTarget: '',
            groupCallClient: null,
            showCallLocalImg: true,
            showCallLocalVideo: false,
            showCallRemoteImg: true,
            showCallRemoteVideo: false,
            showCallTips: true,
            cancelCall: false,
            rejectCall: false,
            hangUpCall: false,
            acceptCall: false,
            callRemoteImg: 'static/images/vue.jpg',
            callLocalImg: 'static/images/vue.jpg',
            videoTextCallTips: '',
            callDisplayName: '',
            talkTime: '00:00',
            showTalkTime: false,
            isAudioOnly: true,
            isSender: true,
            groupMemberInfos: []
        }
    },
    mounted(){
        console.log("group call mounted")
        var sessionCallback = new SessionCallback();
        sessionCallback.didError = error =>{
            this.$message.error('请确认你的设备具有音视频设备');
            this.cancel()
            this.groupMemberInfos = []
        }
        sessionCallback.didCreateLocalVideoTrack = stream => {
            console.log("didCreateLocalVideoTrack")
            this.showCallLocalImg = false;
            this.showCallLocalVideo = true;
        }

        sessionCallback.didCallEndWithReason = (callEndReason,sender) => {
           if(this.userId == sender){
              this.isSender = true  
              this.showGroupCallVideoDialog = false
              this.groupMemberInfos = []
           } else {
               var user = this.currentGroupCallMembers.find(user => user.id == sender)
               if(user){
                user.showRemoteVideo = false
               }
           }
        }

        sessionCallback.didReceiveRemoteVideoTrack = (stream,sender) => {
           var user = this.currentGroupCallMembers.find(user => user.id == sender)
           console.log("didReceiveRemoteVideoTrack user "+user.id+" sender "+sender)
           if(user){
              user.showRemoteVideo = true
           }
        }


        var engineCallback = new EngineCallback()
        engineCallback.onReceiveCall = session => {
            this.$store.state.groupCallMembers = session.tos
            this.isSender = false
            this.showGroupCallVideoDialog = true
            this.rejectCall = true;
            this.cancelCall = false;
            this.acceptCall = true;
            this.hangUpCall = false;
            this.videoTextCallTips = '';
            this.showCallLocalImg = true;
            this.showCallLocalVideo = false;
            this.showCallTips = true;
            this.initGroupInfo(session.clientId);
            this.initCallUserInfo()
        }

        this.groupCallClient = this.$store.state.groupCallClient
        this.groupCallClient.setCurrentSessionCallback(sessionCallback)
        this.groupCallClient.setCurrentEngineCallback(engineCallback)
    },
    methods:{
        startVideoCall(){
            this.cancelCall = true
            this.rejectCall = false;
            this.acceptCall = false;
            this.hangUpCall = false;
            this.isAudioOnly = false
            this.initGroupInfo(this.selectTarget);
            this.initCallUserInfo()
            this.groupCallClient.startCall(this.selectTarget,this.groupCallMembers,this.isAudioOnly)
        },
        cancel(){
            this.cancelCall = false
            this.showGroupCallVideoDialog = false
            this.groupMemberInfos = []
            this.groupCallClient.endCall(this.groupCallMembers)
        },
        hangUp(){
            this.groupCallClient.endCall()
            this.groupMemberInfos = []
        },
        reject(){
           this.groupCallClient.endCall()
           this.groupMemberInfos = []
        },
        accept(){
           this.rejectCall = false;
           this.acceptCall = false;
           this.hangUpCall = true;
           this.groupCallClient.answerCall(false);
        },
        initGroupInfo(target){
           this.currentGroupTarget = target
           var groupInfo = this.groupInfoList.find(groupInfo => groupInfo.target == target)
           console.log("group info "+groupInfo)
           if(groupInfo && groupInfo.portrait != ''){
              this.callRemoteImg = groupInfo.portrait
              this.callDisplayName = groupInfo.name
           } else {
               this.$store.dispatch("getGroupInfo",target);
           }
        },
        initCallUserInfo(){
            this.callLocalImg = this.$store.state.user.img;
        },
        getUserPortrait(target){
            var userInfo = this.userInfoList.find(userInfo => userInfo.uid == target);
            if(userInfo){
                return userInfo.portrait;
            }
            return null;
        },
        getDisplayName(target){
            var userInfo = this.userInfoList.find(userInfo => userInfo.uid == target);
            if(userInfo){
                return userInfo.displayName;
            } else {
                return ''
            }
        },
    },
    computed:{
        ...mapState([
            'groupCallMembers',
            'userInfoList',
            'selectTarget',
            'userId',
            'groupInfoList'
        ]),
        currentGroupCallMembers(){
            if(this.groupMemberInfos.length == 0){
                this.groupCallMembers.forEach(memberId => {
                    var user = this.userInfoList.find(user => user.uid == memberId)
                    this.groupMemberInfos.push({
                        id: user.uid,
                        name: user.displayName,
                        img: user.portrait != '' ? user.portrait : 'static/images/vue.jpg',
                        showRemoteVideo: false
                    })
               });
            }
            return this.groupMemberInfos;
        },
        showGroupCallVideoDialog : {
            get () {
                return this.$store.state.showGroupCallVideoDialog;
            },
            set(val) {
                this.$store.state.showGroupCallVideoDialog = val;
            }
        },
    },

    watch: {
        showGroupCallVideoDialog(){
            if(this.showGroupCallVideoDialog && this.isSender){
               this.startVideoCall()
            }
        },
        groupInfoList(){
           var groupInfo = this.groupInfoList.find(groupInfo => groupInfo.target == this.currentGroupTarget)
           if(groupInfo){
               if(groupInfo.portrait != ''){
                this.callRemoteImg = groupInfo.portrait
               }
              this.callDisplayName = groupInfo.name
           }
        }
    }
}
</script>

<style lang="stylus" scoped>
.callContent
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    overflow: auto
    margin: 0;
    z-index: 2000
    .callercontent
        width: 634px;
        height: 414px;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 0;
        bottom: 0;
        z-index: 2000

    .callercontent video
        width: 160px;
        height: 120px;
        background: #000

    .callercontent.callnone
        display: none
    .callercontent.callshow
        display: block
    .left-big-content
        width: 659px;
        height: 360px;
        position: absolute;
        background: #fff;
        left: 0;
        top: 0
    .left-big-content 
        .remote-video
            display inline-block   
    .left-big-content .bigavatar
        width: 160px;
        height: 120px;
        filter: blur(0px)

    .left-big-content video
        width: 160px;
        height: 120px;
        background: #000
    .right-sml-content
        width: 160px;
        height: 120px;
        box-shadow: 0 6px 20px 0 rgba(48,52,58,0.5);
        border-radius: 4px;
        position: absolute;
        right: -25px;
        bottom: 54px
    .right-sml-content .bigavatar
        width: 100%;
        height: 100%;
        border-radius: 4px
    .opera-content
        padding: 10px 16px;
        box-shadow: 0 6px 20px 0 rgba(48,52,58,0.5);
        height: 56px;
        width: 659px;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0
    .opera-content .calleravatar
        width: 36px;
        height: 36px;
        margin-right: 16px;
        flex-shrink: 0;
        border-radius: 100%
    .opera-content .callnick
        color: #30343a
    .opera-content .operabtn
        width: 72px;
        height: 32px;
        border-radius: 6px;
        color: #fff;
        text-align: center;
        font-size: 12px;
        line-height: 32px;
        cursor: pointer
    .opera-content .canclecall
        background: #ff6161
    .opera-content .canclecall .iconfont
        color: #fff;
        font-size: 16px;
        margin-right: 8px
    .opera-content .upcall
        margin-left: 16px;
        background: #39ba70
    .calltips
        position: absolute;
        margin: auto;
        text-align: center;
        color: #fff;
        font-size: 16px;
        z-index: 10;
        left: 0;
        right: 0;
        top: 0;
        line-height: 360px
    .flexshrink
        flex-shrink: 0
    .iconfull
        margin-left: 16px;
        font-size: 16px;
        cursor: pointer
    .screenbtn
        background: #fff;
        border: 0
    .talktime span
        font-size: 12px;
        color: #30343a;
        margin-left: 8px;
        margin-right: 16px
    .flexbox
        display: flex;
        align-items: center
    .flexauto
        flex: 1   
</style>