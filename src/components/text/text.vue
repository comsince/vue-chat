<!-- 文本输入框 -->
<template>
<div class="text">
    <div class="emoji">
               

        <i class="icon iconfont icon-biaoqing1" @click="showEmoji=!showEmoji"></i>
        <i title="发送视频" class="icon iconfont icon-shipin" @click="sendVideo"></i>  
        <i title="发送图片" class="icon iconfont icon-tupian" >
            <input type="file" accept="image/*" id="chat-send-img" ref="uploadPic" @change="sendPic">
        </i>
        <i title="发送文件" class="icon iconfont icon-dilanxianxingiconyihuifu_huabanfuben">
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
            <div class="chat-modal" v-show="showChatBox">
                <div class="chat-box">
                    <video id="video-local" playsinline autoplay muted></video>
                </div>
            </div>

        </transition>
    </div>
    <textarea ref="text" v-model="content" @keydown.enter="sendMessage" @blur="onBlur" @focus="onFocus" @click="showEmoji=false"></textarea>
    <div class="send" @click="send">
    	<span>发送(ent)</span>
    </div>
    <transition name="appear">
	    <div class="warn" v-show="warn">
	    	<div class="description">不能发送空白信息</div>
	    </div>
	</transition>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TextMessageContent from '../../websocket/message/textMessageContent'
import ImageMessageContent from '../../websocket/message/imageMessageContent'
import * as qiniu from 'qiniu-js'
import MessageContentMediaType from '../../websocket/message/messageContentMediaType'
import LocalStore from '../../websocket/store/localstore'
import VoipClient from '../../webrtc/voipclient'
export default {
    data () {
        return {
            content: '',
            reply: '未找到',  
            frequency: 0,
            warn: false,
            showEmoji: false,
            voipClient: null
        };
    },
    computed: {
        ...mapState([   
            'selectId',
            'emojis',
            'showChatBox'
        ]),
        ...mapGetters([
            'selectedChat',
        ])
    },
    methods: {
        sendPic(e){
           var store = this.$store;
           store.dispatch('getUploadToken', MessageContentMediaType.Image);
           console.log("sendpic "+e.target.value);
           var file = e.target.files[0];
           var key = MessageContentMediaType.Image +"-"+localStorage.getItem('vue-user-id')+"-"+new Date().getTime()+"-"+file.name;
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
                                store.dispatch('sendMessage', imageMessageContent);
                            }
                        }
                    observable.subscribe(observer);
                }
                
           },200);
           this.$refs.uploadPic.value = null;
        },
        // 按回车发送信息
        sendMessage (e) {
            this.send();
            //阻止回车换行
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

            if(this.content.length <= 1){
                this.warn = true
                this.content = ''
                setTimeout(() => {
                    this.warn = false;
                  }, 1000)
               }else{
                    if(this.selectedChat.name === '机器人'){
                        this.$http.get(`https://zhaoplus.com/api/AI?search=${this.content}`).then(res => {
                            this.reply = res.data.result.text
                            if(this.content.includes('/:')){
                                this.reply = '嘻嘻'
                            }
                            var msg = {
                                content: this.content,
                                reply: this.reply
                            }
                            this.$store.dispatch('sendMessage', msg)
                            this.content = ''
                       })
                    }else{
                        //进行消息类型包装
                        var textMessageContent = new TextMessageContent(this.content);
                        this.$store.dispatch('sendMessage', textMessageContent)
                            this.content = ''
                    }
               }
        },
        //发送视频聊天
        sendVideo(){
            this.$store.state.showChatBox = true;
            if(!this.voipClient){
                this.voipClient = new VoipClient(this.$store);
            }
            this.voipClient.startCall(this.$store.state.selectTarget,false);
            // const constraints = {
            //     audio: false,
            //     video: true
            // };
            // navigator.mediaDevices.getUserMedia(constraints).then(function(localStream){
            //     console.log('get userMedia');
            //     var video = document.querySelector('video');
            //     video.srcObject = localStream;
            // }).catch(function(error){
            //     console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
            // });
        }
    },
    // 在进入的时候 聚焦输入框
    mounted() {
            this.$refs.text.focus()
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
                if( this.frequency === 0){
                  this.warn = true;
                  this.frequency++
                  setTimeout(() => {
                    this.warn = false;
                  }, 1000)
                }
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
                  width: 480px;
                  height: 800px;
                  vertical-align: middle;
                   
    textarea
        box-sizing: border-box
        padding: 0 30px
        height: 74%
        width: 100%
        border: none
        outline: none
        font-family: "Micrsofot Yahei"
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
</style>
