<!-- 消息框 -->
<template>
	<div class="message">
		<header class="header">
			<div class="friendname">{{selectedChat.name}}</div>
            <div class="friend-group-info">
                <i title="用户信息" class="icon iconfont icon-pengyou1 show-group-info" v-if="isSingleConversation" @click="changeShowCreateGroup"></i>
                <i title="群组信息" class="icon iconfont icon-pengyou show-group-info" v-if="!isSingleConversation" @click="changeShowGroupInfo"></i>
                <groupInfo v-bind:targetId="selectedChat.target" v-if="showGroupInfo"></groupInfo>
            </div>
		</header>
		<div class="message-wrapper" ref="list" @scroll="scrollEvent" @click="messageBoxClick" :style="{height: (appHeight * 0.75-60) + 'px'}">
		    <ul v-if="selectedChat">
		    	<li v-bind:key = index v-for="(item, index) in selectedChat.protoMessages" class="message-item">
		    		<div v-if="isShowTime(index,selectedChat.protoMessages)" class="time"><span>{{item.timestamp | getTimeStringAutoShort2}}</span></div>
                    <div v-if="isGroupNotification(item)" class="time"><span>{{notificationContent(item)}}</span></div>
                    <div v-if="isRecallNotification(item)" class="time"><span>{{notificationContent(item)}}</span></div>
                    <div v-if="item.content.type === 90" class="time"><span>{{item.content.content}}</span></div>
		    		<div v-if="!isNotification(item.content.type)" class="main" :class="{ self: item.direction == 0 ? true : false }">
                        <img class="avatar" width="36" height="36" :src="avatarSrc(item)"
                        onerror="this.src='static/images/vue.jpg'"/>
                        <div class="content">
                            <div class="display-name" v-if="!isSingleConversation && item.direction != 0">{{showUserName(item.from)}}</div>

                            <div class="content-message-right-menu">
                                <div class="send-status" v-if="item.direction == 0">
                                    <i title = "发送中" class="icon iconfont icon-loading-solid" v-if="isSending(item)"></i>
                                    <i title = "发送失败" class="icon iconfont icon-fasongshibai" v-if="isSendFail(item)"></i>
                                </div>
                                <div class="content-message" @contextmenu.prevent="messageRigthClick(item.messageId)">
                                    <div v-if="item.content.type === 1 && isfaceMessage(item.content.searchableContent)" class="text" v-html="replaceFace(item.content.searchableContent)"></div>
                                    <div v-if="item.content.type === 1 && !isfaceMessage(item.content.searchableContent)" class="text" v-text="item.content.searchableContent"></div>    
                                    <div v-if="item.content.type === 2">
                                        [语音消息]
                                    </div>
                                    <div v-if="item.content.type === 3" v-viewer="options">
                                        <img :src="imageThumnailSrc(item)" :data-src="item.content.remoteMediaUrl" class="receive-image">
                                    </div>
                                    <div v-if="item.content.type === 4">
                                        [位置消息]
                                    </div>
                                    <div v-if="item.content.type === 5">
                                        [文件消息]
                                    </div>
                                    <div v-if="item.content.type === 6" >
                                        <Xgplayer :config="videoConfig(item,false,imageThumnailSrc(item))" @player="Player = $event"/>
                                    </div>
                                    <div v-if="item.content.type === 7">
                                        [表情消息]
                                    </div>
                                    <div v-if="item.content.type === 8">
                                        [图片表情]
                                    </div>
                                    <div v-if="item.content.type === 400">
                                        [网络电话]
                                    </div>
                                </div>
                                <rightMenu v-if="isShowMessageMenu(item)" v-bind:message="item"></rightMenu>
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
import CryptoJS from 'crypto-js'
import groupInfo from '../menu/groupInfo'
import rightMenu from '../menu/rightMenu'
import MessageConfig from '../../websocket/message/messageConfig';
import NotificationMessageContent from '../../websocket/message/notification/notificationMessageContent';
import GroupNotificationContent from '../../websocket/message/notification/groupNotification';
import MessageStatus from '../../websocket/message/messageStatus';
import RecallMessageNotification from '../../websocket/message/notification/recallMessageNotification';
import webSocketClient from '../../websocket/websocketcli';
import { SUCCESS_CODE } from '../../constant';
import LocalStore from '../../websocket/store/localstore';
export default {
    components:{
        Xgplayer,
        groupInfo,
        rightMenu
    },

    data(){
        return {
            Player: null,
            options: {
                url: 'data-src'
            },
        }
    },
    
    computed: {
        ...mapGetters([
            'selectedChat',
            'messages',
            'isSingleConversation'
        ]),
        ...mapState([
            'user',
            'emojis',
            'appHeight',
            'userInfoList',
            'showGroupInfo',
            'showMessageRightMenu',
            'groupMemberMap'
        ]),
        showGroupInfo: {
           get() {
               return this.$store.state.showGroupInfo;
           },

           set(value){
                this.$store.state.showGroupInfo = value
           }
        },
        
    },
    mounted() {
         //  在页面加载时让信息滚动到最下面
        setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0);
        // document.addEventListener("click", e => {
        //     var isString = typeof(e.target.className) == 'string'
        //     let groupInfoDom = document.getElementById("group-info-id");
        //     //注意点击显示按钮事件的处理，防止状态发生反转
		// 	if (isString && e.target.className.search('show-group-info') == -1 && groupInfoDom && !groupInfoDom.contains(event.target) && this.showGroupFriendInfo) {
        //         this.showGroupFriendInfo = false;
        //     }
        // });
        
    },
    watch: {
        // 发送信息后,让信息滚动到最下面
        messages() {
          setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
        }
    },
    methods: {
        changeShowGroupInfo(){
            if(this.showGroupInfo){
                this.showGroupInfo = false
                return
            }
            webSocketClient.getGroupMember(this.selectedChat.target).then(data => {
                var isGroupMember = false;

                if(data.code == SUCCESS_CODE){

                    if(data.result.length == 0){
                        this.$message.error("该群组已经解散,即将删除该会话");
                        this.$store.dispatch('deleteConversation',this.selectedChat.target)
                    } else {
                        this.groupMemberMap.set(this.selectedChat.target,data.result);

                        for(var groupMember of data.result){
                            if(groupMember.memberId == LocalStore.getUserId()){
                                isGroupMember = true;
                                break;
                            }
                            
                        }

                        if(!isGroupMember){
                            this.$message.error("您不是群组成员，无法查看群组信息,即将删除该会话");
                            this.$store.dispatch('deleteConversation',this.selectedChat.target)
                        } else {
                            this.showGroupInfo = !this.showGroupInfo ;
                            if(this.showGroupInfo){
                                this.$store.dispatch("getGroupInfo",this.selectedChat.target);
                            }
                        }
                    }
                    
                }
            })
        },
        changeShowCreateGroup(){
            this.showGroupInfo = !this.showGroupInfo;
        },
        avatarSrc(item){
            var avarimgUrl = 'static/images/vue.jpg';
            if(item.direction == 0){
                avarimgUrl = this.user.img;
            } else {
                var user = this.userInfoList.find(user => user.uid == item.from);
                if(user){
                   avarimgUrl = user.portrait;
                }
            }
            return avarimgUrl;
        },
        showUserName(from){
            var displayName = webSocketClient.getDisplayName(from);;
            return displayName;
        },
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

        isfaceMessage(con){
            return con.includes('/:');
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

        videoConfig(protoMessage,paly = false,posterBase64){
           return {
            id: 'vs'+protoMessage.messageId,
            // url 为空,可能导致不显示,这里强制写入poster
            url: protoMessage.content.remoteMediaUrl == ''? posterBase64: protoMessage.content.remoteMediaUrl,
            height: 330,
            width: 250,
            // fitVideoSize: 'auto',
            poster:posterBase64,
            autoplay: false,
            download: true
           }
        },
        // 参考资料 https://blog.csdn.net/qq449736038/article/details/80769507
        scrollEvent(e){
            let listheight= this.$refs.list.offsetHeight;
            // console.log('scroll event top->'+e.srcElement.scrollTop+ ' scrollheight '+e.srcElement.scrollHeight+" list height->"+listheight);
             if(e.srcElement.scrollHeight - e.srcElement.scrollTop > listheight){
                 this.$store.dispatch('clearUnreadStatus', '')
             }
        },

        messageBoxClick(e){
            this.$store.dispatch('clearUnreadStatus', '')
            console.log('message box click');
        },

        isGroupNotification(protoMessage){
           var contentClass = MessageConfig.getMessageContentClazz(protoMessage.content.type);
           var content = new contentClass();
           return content instanceof GroupNotificationContent;
        },

        isRecallNotification(protoMessage){
           var contentClass = MessageConfig.getMessageContentClazz(protoMessage.content.type);
           var content = new contentClass();
           return content instanceof RecallMessageNotification;
        },

        notificationContent(protoMessage){
            var displayContent;
            var messageContent = MessageConfig.convert2MessageContent(protoMessage.from,protoMessage.content);
            return messageContent.formatNotification();
        },

        isNotification(type){
            return type >= 80 && type <= 117 
        },

        isSending(protoMessage){
            //兼容以前没有更新messageUid的发送消息
            return protoMessage.status == MessageStatus.Sending
            // && protoMessage.messageUid != 0;
        },

        isSendFail(protoMessage){
            return protoMessage.status == MessageStatus.SendFailure
        },

        messageRigthClick(messageId){
            var menuSetting = this.showMessageRightMenu.find(setting => setting.messageId == messageId)
            if(menuSetting){
               menuSetting.show = true
            } else {
                this.showMessageRightMenu.push({
                    messageId: messageId,
                    show: true
                })
            }
        },
        isShowMessageMenu(item){
            var menuSetting = this.showMessageRightMenu.find(setting => setting.messageId == item.messageId)
            if(menuSetting){
                return menuSetting.show;
            } else {
                return false;
            }
           
        },
        imageThumnailSrc(item){
            var thumbnail = item.content.binaryContent;
            if(thumbnail && thumbnail != ''){
                thumbnail = "data:image/png;base64," +item.content.binaryContent;
            } else {
                thumbnail = ''
            }
            return thumbnail 
        },
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
      position: relative
      width: 100%
      height: 75%
      .header
        height: 14%
        max-height: 60px
        min-height: 60px 
        padding: 0px 0 0 30px
        box-sizing: border-box
        display:flex
        .friendname
            display: flex
            align-items: center
            font-size: 18px
        .friend-group-info
            padding: 0px 20px 0px 0px
            display: flex
            align-items: center
            margin-left : auto
            .icon
                font-size: 24px
                cursor: pointer 
      .message-wrapper
        height: 86%
        padding: 10px 15px
        box-sizing: border-box
        overflow-y: auto
        border-top: 1px solid #e7e7e7
        border-bottom: 1px solid #e7e7e7
        background: #f2f2f2
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
                display:inline-block
                width: 65%   
                .display-name
                    margin-left: 10px
                    margin-bottom: 5px
                    font-size: 8px
                    color: #999
                .content-message-right-menu
                    position: relative    
                    .content-message
                        display: inline-block
                        margin-left: 10px
                        position: relative
                        padding: 6px 10px
                        max-width: 90%
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
                .send-status
                    height: 100%
                    display: inline-block
                    .icon
                        display: block
                        font-size: 16px 
                    .icon-fasongshibai
                        color: red
                    .icon-loading-solid
                        animation: changeright 1s linear infinite
                .content-message-right-menu            
                    .content-message 
                        background-color: #b2e281
                        &:before 
                            right: -12px
                            vertical-align: middle
                            border-right-color: transparent
                            border-left-color: #b2e281
    @keyframes changeright     
    0% 
        -webkit-transform:rotate(0deg)
    50%
        -webkit-transform:rotate(180deg)
    100%
        -webkit-transform:rotate(360deg)                      
                    
</style>
