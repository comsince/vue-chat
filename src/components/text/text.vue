<!-- 文本输入框 -->
<template>
<div class="text">
    <div class="emoji">
        <i class="icon iconfont icon-biaoqing" @click="showEmoji=!showEmoji"></i>
        <i title="语音聊天" class="icon iconfont icon-dianhua" v-show="isSingleConversation" @click="sendAudio"></i>
        <i title="视频聊天" class="icon iconfont icon-ai-video" v-show="isSingleConversation" @click="sendVideo"></i>
        <i title="发送图片" class="icon iconfont icon-tupian" >
            <input type="file" accept="image/*" id="chat-send-img" ref="uploadPic" @change="sendPic">
        </i>
        <i title="发送视频" class="icon iconfont icon-shipin" >
            <input type="file" accept="video/*" id="chat-send-video" ref="uploadVideo" @change="sendVideoMessage">
        </i>
        <i title="发送文件" class="icon iconfont icon-wenjian">
            <input type="file" accept="*" id="chat-send-file">
        </i>
        <transition name="showbox">
            <div class="emojiBox" v-show="showEmoji">
                <li v-bind:key= index v-for="(item, index) in emojis">
                    <img :src="'static/emoji/'+item.file" :data="item.code" @click="content +=item.code">
                </li>
            </div>
        </transition>

        <transition name="voice-video-chat-box">
            <div class="chat-modal" v-show="false">
                <div class="chat-box">
                    <video id="video-remote" playsinline autoplay muted></video>
                    <video id="video-local" playsinline autoplay muted></video>
                </div>
            </div>

        </transition>

        
        <div class="callContent" v-show="showChatBox">
            <div class="">
                <div class="callercontent callshow" style="">
                    <div class="exchange-content">
                        <div class="playcontent left-big-content">
                            <img id="wxCallRemoteImg" class="bigavatar" :src="callRemoteImg" v-show="showCallRemoteImg"/> 
                            <p id="wxCallTips" class="calltips" v-text="videoTextCallTips" v-show="showCallTips"> 接通中... </p> 
                            <video id="wxCallRemoteVideo" autoplay="autoplay" playsinline="" style="display: none;" v-show="showCallRemoteVideo"></video>
                        </div> 
                        <div class="playcontent right-sml-content">
                            <img id = "wxCallLocalImg" :src="callLocalImg" class="bigavatar" v-show="showCallLocalImg"/> 
                            <video id="wxCallLocalVideo" autoplay="autoplay" muted="muted" playsinline="" style="display: none;" v-show="showCallLocalVideo"></video>
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
        </div>

        <div class="audioContent" v-show="showAudioBox">
            <div class="audioBody callshow" style="">
                <div class="audioBg">
                    <img class="callavatar" :src="callRemoteImg" /> 
                    <div class="blackbg"></div>
                </div> 
                <div class="audiomain">
                    <img class="audio-avatar" :src="callRemoteImg" /> 
                    <p class="callnick" v-text="callDisplayName"></p> 
                    <p class="call-time" style="display: none;" v-show="showTalkTime" v-text="talkTime">00:00</p> 
                    <p class="waiting-msg" v-show="waitingMsg" v-text="waitingMsgTips"> 接通中... </p> 
                    <div class="call-opera flexbox">
                        <span class="cancleaudio btnopacity" style="display: none;" v-show="hangUpCall" @click="hangUp"><i class="iconfont icon-guaduan"></i>挂断 </span> 
                        <div class="loadingcall flexbox">
                            <span class="cancleaudio callercanle btnopacity" style="display: none;" v-show="cancelCall" @click="cancel"><i class="iconfont icon-guaduan"></i>取消 </span> 
                            <span class="cancleaudio btnopacity" style="display: none;" v-show="rejectCall" @click="reject">拒绝</span> 
                            <span class="upcall btnopacity" style="display: none;" v-show="acceptCall" @click="accept">接听</span>
                        </div>
                    </div>
                </div> 
                <div style="display: none;">
                    <audio id="wxCallRemoteAudio" autoplay="autoplay"></audio>
                </div> 
                <div style="display: none;">
                    <audio id="wxCallLocalAudio" autoplay="autoplay" muted="muted"></audio>
                </div>
            </div>
        </div>

    </div>
    <textarea id="sendText" ref="text" v-model="content" @keydown.enter.exact="sendMessage" @keydown.ctrl.enter="newline" @focus="onFocus" @click="showEmoji=false"></textarea>
    <div class="send" @click="send" ref="sendBtn" v-bind:class="{disable : sendBtnDisabled}">
    	<span>发送</span>
    </div>
    <transition name="appear">
	    <div class="warn" v-show="warn">
	    	<div class="description">不能发送空白信息</div>
	    </div>
	</transition>
</div>
</template>

<script>
import adapter from 'webrtc-adapter'
import { mapGetters, mapState } from 'vuex'
import TextMessageContent from '../../websocket/message/textMessageContent'
import ImageMessageContent from '../../websocket/message/imageMessageContent'
import * as qiniu from 'qiniu-js'
import MessageContentMediaType from '../../websocket/message/messageContentMediaType'
import LocalStore from '../../websocket/store/localstore'
import SessionCallback from '../../webrtc/sessionCallback'
import EngineCallback from '../../webrtc/engineCallback'
import SendMessage from '../../websocket/message/sendMessage'
import CallState from '../../webrtc/callState'
import {UPLOAD_BY_QINIU, SUCCESS_CODE } from '../../constant'
import webSocketCli from '../../websocket/websocketcli'
import Message from '../../websocket/message/message'
import ProtoMessage from '../../websocket/message/protomessage'
import VideoMessageContent from '../../websocket/message/videoMessageContent'
export default {
    data () {
        return {
            content: '',
            sendBtnDisabled: true,
            reply: '未找到',  
            frequency: 0,
            warn: false,
            showEmoji: false,
            videoTextCallTips: '',
            voipClient: null,
            rejectCall: false,
            cancelCall: false,
            acceptCall: false,
            hangUpCall: false,
            showCallLocalImg: true,
            showCallLocalVideo: false,
            showCallRemoteImg: true,
            showCallRemoteVideo: false,
            showCallTips: true,
            callRemoteImg: 'static/images/vue.jpg',
            callLocalImg: 'static/images/vue.jpg',
            callDisplayName: '',
            waitingMsg: false,
            isAudioOnly: false,
            waitingMsgTips: '',
            showTalkTime: false,
            talkInterval: 0,
            talkTime: '00:00',
            talkTimerInterval: null,
        };
    },
    computed: {
        ...mapState([   
            'selectId',
            'emojis',
            'showChatBox',
            'showAudioBox',
            'userInfoList'
        ]),
        ...mapGetters([
            'selectedChat',
            'isSingleConversation',
        ])
    },
    methods: {
        sendPic(e){
           var store = this.$store;
           var file = e.target.files[0];
           var localPath = e.target.value
           if(UPLOAD_BY_QINIU){
                store.dispatch('getUploadToken', MessageContentMediaType.Image);
                console.log("sendpic "+e.target.value);
                var key = MessageContentMediaType.Image +"-"+LocalStore.getUserId()+"-"+new Date().getTime()+"-"+file.name;
                setTimeout(()=> {
                        var token = LocalStore.getImageUploadToken();
                        console.log("upload file key "+key+" token "+token);
                        if(token){
                            var observable = qiniu.upload(file, key, token, null, null);
                            var observer = {
                                    next(res){
                                        console.log('uploading '+res.total.percent);
                                    },
                                    error(err){
                                        console.log("upload error "+err.code +" message "+err.message);
                                    }, 
                                    complete(res){
                                        console.log("upload complete "+res);
                                        var localPath = e.target.value;
                                        var remotePath = "http://image.comsince.cn/"+key;
                                        var imageMessageContent = new ImageMessageContent(localPath,remotePath,null);
                                        store.dispatch('sendMessage', new SendMessage(null,imageMessageContent))
                                    }
                                }
                            observable.subscribe(observer);
                        }
                        
                },200);
           } else {
                var key = MessageContentMediaType.Image +"-"+LocalStore.getUserId()+"-"+new Date().getTime()+"-"+file.name;
                webSocketCli.getMinioUploadUrl(MessageContentMediaType.Image,key).then(data => {
                    if(data.code == SUCCESS_CODE){
                        console.log("domain "+data.result.domain+" url "+data.result.url)
                        var messageId;
                        var thunmbanilwithoutDesc;
                        //获取缩略图,同时也为了适配android 端适配的问题，防止转发图片报错
                        var reader = new FileReader()
                        reader.readAsDataURL(file)
                        reader.onload = (e) => {
                            var result = e.target.result
                            this.canvasDataURL(result,{   
                            },base64Img => {
                                thunmbanilwithoutDesc = base64Img.split(',')[1]
                                //添加缩略消息
                                var imageMessageContent = new ImageMessageContent(localPath,null,thunmbanilwithoutDesc);
                                var message = Message.conert2Message(new SendMessage(null,imageMessageContent));
                                var protoMessage = ProtoMessage.convertToProtoMessage(message);
                                messageId = protoMessage.messageId
                                store.dispatch('preAddProtoMessage', protoMessage);
                            })
                        }

                        fetch(data.result.url, {
                            method: 'PUT',
                            body: file
                            }).then(() => {
                                var remotePath = data.result.domain+"/"+key;
                                console.log("remote path "+remotePath)
                                var imageMessageContent = new ImageMessageContent(localPath,remotePath,thunmbanilwithoutDesc);
                                store.dispatch('updateSendMessage', {messageId: messageId,messageContent:imageMessageContent})
                            }).catch((e) => {
                                console.error(e);
                            });
                    }
                })  
           }
           this.$refs.uploadPic.value = null;
        },
 
        /*** js 图片压缩上传(纯js的质量压缩，非长宽压缩) 
         * https://www.cnblogs.com/xiangsj/p/8932525.html
        */
        canvasDataURL(path, obj, callback){
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w =  w * 0.5 > 113 ? 113 : w * 0.5;
                h =  w / scale;
                console.log("scale "+scale+" transfer size "+w+":"+h)
                var quality = 0.5;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                callback(base64);
            }
        },

        //https://github.com/metroluffy/blog/issues/18
        sendVideoMessage(e){
            var store = this.$store;
            var file = e.target.files[0];
            var localPath = e.target.value

            var key = MessageContentMediaType.Video +"-"+LocalStore.getUserId()+"-"+new Date().getTime()+"-"+file.name;
            webSocketCli.getMinioUploadUrl(MessageContentMediaType.Video,key).then(data => {
                    if(data.code == SUCCESS_CODE){
                        console.log("domain "+data.result.domain+" url "+data.result.url)
                        var messageId;
                        var thunmbanilwithoutDesc;
                        //获取缩略图,同时也为了适配android 端适配的问题，防止转发图片报错
                        var url = URL.createObjectURL(file);
                        console.log("video url "+url)

                        this.getVideoImage(url,base64Img =>{
                            console.log("base64Img "+base64Img)
                            thunmbanilwithoutDesc = base64Img.split(',')[1]
                                //添加缩略消息
                                var videoMessageContent = new VideoMessageContent(localPath,'',thunmbanilwithoutDesc);
                                var message = Message.conert2Message(new SendMessage(null,videoMessageContent));
                                var protoMessage = ProtoMessage.convertToProtoMessage(message);
                                messageId = protoMessage.messageId
                                store.dispatch('preAddProtoMessage', protoMessage);
                            },2)

                        fetch(data.result.url, {
                            method: 'PUT',
                            body: file
                            }).then(() => {
                                var remotePath = data.result.domain+"/"+key;
                                console.log("remote path "+remotePath)
                                var imageMessageContent = new VideoMessageContent(localPath,remotePath,thunmbanilwithoutDesc);
                                store.dispatch('updateSendMessage', {messageId: messageId,messageContent:imageMessageContent})
                            }).catch((e) => {
                                console.error(e);
                            });
                    }
                }) 

            this.$refs.uploadVideo.value = null;
        },

        getVideoImage(path, callback, secs = 1) {
            var me = this,
            video = document.createElement('video');
            video.onloadedmetadata = function () {
                if ('function' === typeof secs) {
                    secs = secs(this.duration);
                }
                this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
                console.log("secs "+secs+" currentTime "+this.currentTime)
            };
            video.onseeked = function (e) {
                var canvas = document.createElement('canvas');
                var w = video.videoHeight,
                    h = video.videoWidth,
                    scale = w / h;
                w =  w  > 250 ? 250 : w;
                h =  w / scale;
                console.log("scale "+scale+" transfer size "+w+":"+h)
                canvas.height = h;
                canvas.width = w;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                var imgBase64 = canvas.toDataURL('image/jpeg', 0.7);
                callback(imgBase64);
            };
            video.onerror = function (e) {
                console.log("excption"+e)
                callback.call(me, undefined, undefined, e);
            };
            video.src = path;
        },

        // 按回车发送信息
        sendMessage (e) {
            console.log("send code "+e.keyCode);
            if(e.keyCode === 13){
              this.send();
              //阻止回车换行
              e.preventDefault();
            }
            
        },

        newline(e){
           this.content = this.content + '\n';
           e.preventDefault();
        },

        onBlur(){
           console.log('send text onblur');
        },

        onFocus(){
           console.log('send text onfoucs');
           this.$store.dispatch('clearUnreadStatus', '');
        },
        // 点击发送按钮发送信息
        send () {
            console.log("send message "+this.content);
            if(this.content.length < 1){
                this.warn = true
                this.content = ''
                setTimeout(() => {
                    this.warn = false;
                  }, 1000)
               }else{
                    //进行消息类型包装
                    var textMessageContent = new TextMessageContent(this.content);
                    this.sendMessageToStore(new SendMessage(null,textMessageContent));
                    this.content = '';
                    this.$refs.text.focus();
               }
        },
        //发送语音聊天
        sendAudio(){
            this.$store.state.showAudioBox = true;
            this.waitingMsg = true;
            this.rejectCall = false;
            this.acceptCall = false;
            this.hangUpCall = false;
            this.cancelCall = true;
            this.initCallUserInfo(this.$store.state.selectTarget);
            this.isAudioOnly = true;
            this.voipClient.startCall(this.$store.state.selectTarget,this.isAudioOnly);
        },
        //发送视频聊天
        sendVideo(){
            this.$store.state.showChatBox = true;
            this.rejectCall = false;
            this.acceptCall = false;
            this.hangUpCall = false;
            this.cancelCall = true;
            this.showCallRemoteVideo = false;
            this.showCallRemoteImg = true;
            this.showCallTips = true;
            this.videoTextCallTips = "正在接通，请稍候...";
            this.initCallUserInfo(this.$store.state.selectTarget);
            this.isAudioOnly = false;
            this.voipClient.startCall(this.$store.state.selectTarget,this.isAudioOnly);
        },
        initCallUserInfo(target){
            var portrait = this.getUserPortrait(target);
            if(portrait){
                this.callRemoteImg = portrait;
            }
            this.callLocalImg = this.$store.state.user.img;
            this.callDisplayName = this.getDisplayName(target);
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
            return userInfo.displayName;
        },
        hangUp(){
            this.voipClient.cancelCall();
        },
        reject(){
           this.voipClient.cancelCall();
        },
        accept(){
           this.rejectCall = false;
           this.acceptCall = false;
           this.hangUpCall = true;
           this.voipClient.answerCall(this.isAudioOnly);
        },
        cancel(){
           this.voipClient.cancelCall();
        },
        sendMessageToStore(sendMessage){
           this.$store.dispatch('sendMessage', sendMessage)
        }
    },
    // 在进入的时候 聚焦输入框
    mounted() {
        this.$refs.text.focus()
        var sessionCallback = new SessionCallback();
        var engineCallback = new EngineCallback();
        engineCallback.onReceiveCall = session => {
            this.isAudioOnly = session.audioOnly;
            console.log("receive isAudioOnly "+session.audioOnly);
            if(!this.isAudioOnly){
                this.$store.state.showChatBox = true;
                this.videoTextCallTips = '对方邀请您进行视频通话';
                this.rejectCall = true;
                this.cancelCall = false;
                this.acceptCall = true;
                this.hangUpCall = false;
                this.showCallLocalImg = true;
                this.showCallLocalVideo = false;
                this.showCallRemoteImg = true;
                this.showCallRemoteVideo = false;
                this.showCallTips = true;
                this.initCallUserInfo(session.clientId);
            } else {
                this.$store.state.showAudioBox = true;
                this.waitingMsg = true;
                this.waitingMsgTips = '对方邀请你进行语音通话';
                this.rejectCall = true;
                this.acceptCall = true;
                this.cancelCall = false;
                this.hangUpCall = false;
                this.initCallUserInfo(session.clientId);
            }
                    
        //取消textarea焦点聚焦
            try {
                document.getElementById('sendText').blur();
            } catch(error){
                console.error("get sendText error "+error);
            }
        }

        sessionCallback.didChangeState = state => {
            if(state === CallState.STATUS_CONNECTED){
                if(this.isAudioOnly){
                    this.cancelCall = false;
                    this.rejectCall = false;
                    this.acceptCall = false;
                    this.hangUpCall = true;
                    this.waitingMsg = false;
                } else {
                    this.cancelCall = false;
                    this.acceptCall = false;
                    this.rejectCall = false;
                    this.hangUpCall = true;
                }
                this.showTalkTime = true;
                this.talkTimerInterval = setInterval(() => {
                    this.talkInterval += 1;
                    var min = Math.floor(this.talkInterval / 60 % 60);
                    var sec = Math.floor(this.talkInterval % 60);
                    sec = sec < 10 ? "0"+sec : sec;
                    min = min < 10 ? "0"+min : min;
                    this.talkTime = min + ":"+ sec;
                },1000)
            }
        }

        sessionCallback.didReceiveRemoteAudioTrack = stream => {
            document.getElementById("wxCallRemoteAudio").srcObject = stream;
        }
            
        sessionCallback.didCallEndWithReason = callEndReason => {
            if(this.isAudioOnly){
                this.$store.state.showAudioBox = false;
            } else {
                this.$store.state.showChatBox = false;
            }
            if(this.talkTimerInterval){
                this.showTalkTime = false;
                this.talkInterval = 0;
                clearInterval(this.talkTimerInterval);
            }
        }

        sessionCallback.didCreateLocalVideoTrack = (stream) => {
            this.showCallLocalImg = false;
            this.showCallLocalVideo = true;
            document.getElementById("wxCallLocalVideo").srcObject = stream;
        }

        sessionCallback.didReceiveRemoteVideoTrack = stream => {
            this.showCallRemoteImg = false;
            this.showCallTips = false;
            this.showCallRemoteVideo = true;
            document.getElementById("wxCallRemoteVideo").srcObject = stream;
        }
        this.voipClient = this.$store.state.voipClient;
        this.voipClient.setCurrentSessionCallback(sessionCallback);
        this.voipClient.setCurrentEngineCallback(engineCallback);
    },
    watch: {
        // 在选择其它对话的时候 聚焦输入框
        selectId() {
          setTimeout(() => {
            this.$refs.text.focus()
          }, 0)
        },
        // 当输入框中的值为空时 弹出提示  并在一秒后消失
        content() {
            if(this.content === ''){
                this.$refs.sendBtn.style.background = "#f5f5f5";
                this.$refs.sendBtn.style.color = '#7c7c7c';
                this.sendBtnDisabled = true;
            } else {
                this.$refs.sendBtn.style.background = "rgb(18,150,17)";
                this.$refs.sendBtn.style.color = '#fff';
                this.sendBtnDisabled = false;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.text
    position: relative
    height: 25%
    background: #fff
    .emoji
        position: relative
        width: 100%
        height: 26%
        line-height: 40px
        font-size: 12px
        padding: 0 30px
        box-sizing: border-box
        color: #7c7c7c
        i
            font-size: 20px;
            margin-right : 10px;
            cursor: pointer
            position: relative
            &:hover
                color: #1aad19
        input
            opacity: 0;
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 11;
            font-size: 0;
            cursor: pointer;        
        .emojiBox
            position: absolute
            display: flex
            flex-wrap: wrap
            top: -210px
            left: -100px
            width: 300px
            height: 200px
            padding: 5px
            background-color: #fff
            border: 1px solid #d1d1d1
            border-radius: 2px
            box-shadow:0 1px 2px 1px #d1d1d1
            &.showbox-enter-active, &.showbox-leave-active
                transition: all .5s
            &.showbox-enter,&.showbox-leave-active
                opacity: 0
        .chat-modal
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
            -webkit-overflow-scrolling: touch;
            outline: 0;
            overflow: hidden;
            margin: 30/@rate auto;
            background-color: rgba(0,0,0,.3);
            .chat-box
                position: relative;
                left: 50%;
                top: 5%;
                transform: translate(-50%,0);
                padding: 50/@rate 40/@rate;
                background: #fff;
                height: 800px;
                width: 480px;
                .video-local
                  width: 50px;
                  height: 100px;
                  vertical-align: middle;
                .video-remote  
                  width: 480px;
                  height: 800px;
                  vertical-align: middle;
        .btnopacity:hover
	        opacity: .8          
        .callContent
           .callercontent
                width: 664px;
                height: 414px;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                top: 10;
                bottom: 0;
                z-index: 2000

            .callercontent video
                width: 100%;
                background: #000

            .callercontent.callnone
                display: none
            .callercontent.callshow
                display: block
            .left-big-content
                width: 480px;
                height: 360px;
                position: absolute;
                left: 0;
                top: 0
            .left-big-content .bigavatar
                width: 100%;
                height: 100%;
                filter: blur(6px)

            .left-big-content video
                width: 100%;
                height: 100%;
                background: #000
            .right-sml-content
                width: 160px;
                height: 120px;
                box-shadow: 0 6px 20px 0 rgba(48,52,58,0.5);
                border-radius: 4px;
                position: absolute;
                right: 0;
                bottom: 0
            .right-sml-content .bigavatar
                width: 100%;
                height: 100%;
                border-radius: 4px
            .opera-content
                padding: 10px 16px;
                box-shadow: 0 6px 20px 0 rgba(48,52,58,0.5);
                height: 56px;
                width: 480px;
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
        .audioContent
            .flexbox
                display: flex;
                align-items: center
            .callshow
	            display: block
            .audioBody
                width: 280px;
                height: 344px;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                top: 10;
                bottom: 0;
                z-index: 2000;
                border-radius: 3px
            .audioBody .audioBg
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                border-radius: 3px
            .audioBody .audioBg .callavatar
                width: 100%;
                height: 100%;
                filter: blur(4px)
            .audioBody .audioBg .blackbg
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 5;
                top: 0;
                left: 0;
                background: #000;
                opacity: .5
            .audioBody .audiomain
                position: relative;
                z-index: 6;
                text-align: center;
                color: #fff
            .audioBody .audiomain .audio-avatar
                width: 73px;
                height: 73px; 
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                margin-top: 64px;
                margin-bottom: 12px
            .audioBody .audiomain .callnick
                font-size: 16px;
                line-height: 22px
            .audioBody .audiomain .call-time
                line-height: 20px;
                margin-top: 4px
            .audioBody .audiomain .call-opera
                justify-content: center
            .audioBody .audiomain .call-opera span
                width: 96px;
                height: 32px;
                margin: 66px 12px 0;
                line-height: 32px;
                border-radius: 6px;
                cursor: pointer
            .audioBody .audiomain .call-opera span .iconfont
                &:hover
                   pointer-events: none
                font-size: 16px;
                margin-right: 8px
            .audioBody .audiomain .call-opera .nomuted
                border: 1px solid #fff
            .audioBody .audiomain .call-opera .muted
                background: #fff;
                color: #30343a
            .audioBody .audiomain .call-opera .cancleaudio
                background: #ff6161
            .audioBody .audiomain .call-opera .callercanle
                width: 128px
            .audioBody .loadingcall
                justify-content: center
            .audioBody .loadingcall .upcall
                background: #39ba70             
    textarea
        box-sizing: border-box
        padding: 0 30px
        height: 74%
        width: 100%
        border: none
        outline: none
        font-family: "Micrsofot Yahei"
        font-size: 13px
        resize: none
    .send
        position: absolute
        bottom: 10px
        right: 30px
        width: 75px
        height: 28px
        line-height: 28px
        box-sizing: border-box
        text-align: center
        border: 1px solid #e5e5e5
        border-radius: 3px
        background: #f5f5f5
        font-size: 14px
        color: #7c7c7c
        &:hover
            background: rgb(18,150,17)
            color: #fff
    .warn
         position: absolute
         bottom: 50px
         right: 10px
         width: 110px
         height: 30px
         line-height: 30px
         font-size: 12px
         text-align: center
         border: 1px solid #bdbdbd
         border-radius: 4px
         box-shadow:0 1px 5px 1px #bdbdbd
         &.appear-enter-active, &.appear-leave-active
            transition: all 1s
         &.appear-enter,&.appear-leave-active
            opacity: 0
         &:before
            content: " "
            position: absolute
            top: 100%
            right: 20px
            border: 7px solid transparent
            border-top-color: #fff
            filter:drop-shadow(1px 3px 2px #bdbdbd)
    
    .disable
        pointer-events: none; 
</style>
