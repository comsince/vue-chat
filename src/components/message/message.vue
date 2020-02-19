<!-- 消息框 -->
<template>
	<div class="message">
		<header class="header">
			<div class="friendname">{{selectedChat.name}}</div>
		</header>
		<div class="message-wrapper" ref="list" @scroll="scrollEvent" @click="messageBoxClick">
		    <ul v-if="selectedChat">
		    	<li v-bind:key = index v-for="(item, index) in selectedChat.protoMessages" class="message-item">
		    		<div v-if="isShowTime(index,selectedChat.protoMessages)" class="time"><span>{{item.timestamp | getTimeStringAutoShort2}}</span></div>
		    		<div class="main" :class="{ self: item.direction == 0 ? true : false }">
                        <img class="avatar" width="36" height="36" :src="item.direction == 0 ? 
                        user.img: (userInfos.get(item.from) != null ? userInfos.get(item.from).portrait : 'static/images/vue.jpg')" 
                        onerror="this.src='static/images/vue.jpg'"/>
                        <div class="content">
                            <div v-if="item.content.type === 1" class="text" v-text="replaceFace(item.content.searchableContent)"></div>
                            <div v-if="item.content.type !== 1 && item.content.type !== 2
                                      && item.content.type !== 3 && item.content.type !== 8
                                      && item.content.type !== 6">不支持的类型，请到手机上查看</div>
                            <div v-if="item.content.type === 3" v-viewer>
                                <img :src="item.content.remoteMediaUrl" class="receive-image">
                            </div>
                            <div v-if="item.content.type === 2">
                                请到手机上查看音频消息
                            </div>
                            <div v-if="item.content.type === 6" >
                                <Xgplayer :config="videoConfig(item.content.remoteMediaUrl,index === selectedChat.protoMessages.length - 1)" @player="Player = $event"/>
                            </div>
                        </div>
                    </div>
		    	</li>
		    </ul>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TimeUtils from '../../websocket/utils/timeUtils'
import Xgplayer from 'xgplayer-vue';
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
    components:{
        Xgplayer
    },

    data(){
        return {
            Player: null
        }
    },
    
    computed: {
        ...mapGetters([
            'selectedChat',
            'messages',
            'userInfos'
        ]),
        ...mapState([
            'user',
            'emojis'
        ]),
    },
    mounted() {
         //  在页面加载时让信息滚动到最下面
        setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
        
    },
    watch: {
        // 发送信息后,让信息滚动到最下面
        messages() {
          setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
        }
    },
    methods: {
        //  在发送信息之后，将输入的内容中属于表情的部分替换成emoji图片标签
        //  再经过v-html 渲染成真正的图片
        replaceFace (con) {
            if(con.includes('/:')) {
                var emojis=this.emojis;
                for(var i=0;i<emojis.length;i++){
                    con = con.replace(emojis[i].reg, '<img src="static/emoji/' + emojis[i].file +'"  alt="" style="vertical-align: middle; width: 24px; height: 24px" />');
                }   
                return con;
            }
            return con;
        },

        isShowTime(index,protoMessages){
           var msgTime = protoMessages[index].timestamp;
           if(index > 0){
               var preProtoMessage = protoMessages[index - 1];
               var preMsgTime = preProtoMessage.timestamp;
               if(msgTime - preMsgTime > ( 5 * 60 * 1000)){
                   return true;
               }
           }
           return false;
        },

        videoConfig(remoteMediaUrl,paly = false){
           return {
            id: 'vs'+remoteMediaUrl,
            url: remoteMediaUrl,
            height: 330,
            width: 250,
            autoplay: paly,
            download: true
           }
        },
        // 参考资料 https://blog.csdn.net/qq449736038/article/details/80769507
        scrollEvent(e){
             //console.log('scroll event '+e.srcElement.scrollTop+ ' scrollheight '+e.srcElement.scrollHeight);
             if(e.srcElement.scrollHeight - e.srcElement.scrollTop > 389){
                 this.$store.dispatch('clearUnreadStatus', '')
             }
        },

        messageBoxClick(e){
            this.$store.dispatch('clearUnreadStatus', '')
            console.log('message box click');
        }
 
    },
    filters: {
            // 将日期过滤为 hour:minutes
            time (date) {
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                if(typeof date === 'number'){
                   date = new Date(date);
                }
                if(date.getMinutes()<10){
                  return date.getHours() + ':0' +date.getMinutes();
                }else{
                  return date.getHours() + ':' + date.getMinutes();
                }
            },

            getTimeStringAutoShort2(timestamp){
                return TimeUtils.getTimeStringAutoShort2(timestamp,true);
            }


    }
}
</script>

<style lang="stylus" scoped>
   .receive-image
      max-width : 115px;
      max-height : 330px;
      text-align: center
      border-radius: 3px
      
   .message
      width: 100%
      height: 450px
      .header
        height: 60px
        padding: 28px 0 0 30px
        box-sizing: border-box
        border-bottom: 1px solid #e7e7e7
        .friendname
            font-size: 18px
      .message-wrapper
        min-height: 390px
        max-height: 390px
        padding: 10px 15px
        box-sizing: border-box
        overflow-y: auto
        border-bottom: 1px solid #e7e7e7
        .message
            margin-bottom: 15px
        .time
            width: 100%
            font-size: 12px
            margin: 7px auto
            text-align: center
            span
                display: inline-block
                padding: 4px 6px
                color: #fff
                border-radius: 3px
                background-color: #dcdcdc
        .main
            margin-top: 10px
            .avatar 
                float: left
                margin-left: 15px
                border-radius: 3px
            .content
                display: inline-block
                margin-left: 10px
                position: relative
                padding: 6px 10px
                max-width: 330px
                min-height: 36px
                line-height: 24px
                box-sizing: border-box
                font-size: 14px
                text-align: left
                word-break: break-all
                background-color: #fafafa
                border-radius: 4px
                .text
                  white-space: pre-wrap;
                &:before
                    content: " "
                    position: absolute
                    top: 12px
                    right: 100%
                    border: 6px solid transparent
                    border-right-color: #fafafa
        .self
            text-align: right
            .avatar
                float: right
                margin:0 15px
            .content 
                background-color: #b2e281
                &:before 
                    right: -12px
                    vertical-align: middle
                    border-right-color: transparent
                    border-left-color: #b2e281
</style>
