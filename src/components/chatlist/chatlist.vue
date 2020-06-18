<!-- 聊天列表 -->
<template>
  <div class="conversationlist" :style="{height: (appHeight-60) + 'px'}">
    <ul v-loading="isEmptyConversation" style="min-height: 60px">
        <li v-bind:key = index v-for="(item,index) in searchedConversationList" class="sessionlist" :class="{ active: item.conversationInfo.target === selectTarget }" @click="selectConversation(item.conversationInfo.target)">
            <div class="list-left">
            	<img class="avatar"  width="42" height="42" alt="static/images/vue.jpg" :src="item.img" onerror="this.src='static/images/vue.jpg'">
            </div>
            <div class="list-right">
                <div class="title-info">
                   <p class="name">{{item.name ? item.name : ""}}</p>
                   <span class="time">{{item.conversationInfo.timestamp | getTimeStringAutoShort2}}</span>
                </div>
                <div class="lastmsg-info">
                    <p class="lastmsg">{{processageGroupMessage(item)}}</p>
                    <span v-if="item.conversationInfo.unreadCount && item.conversationInfo.unreadCount.unread > 0" class="unread-num">
                        <span class="unread-num-show">{{item.conversationInfo.unreadCount ? item.conversationInfo.unreadCount.unread : 0}}</span>
                    </span>
                </div>

            </div>
            
        </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions ,mapGetters } from 'vuex'
import ConversationType from '../../websocket/model/conversationType';
import LocalStore from '../../websocket/store/localstore';
import TimeUtils from '../../websocket/utils/timeUtils';
import MessageConfig from '../../websocket/message/messageConfig';
import NotificationMessageContent from '../../websocket/message/notification/notificationMessageContent';
import Logger from '../../websocket/utils/logger';
import webSocketClient from '../../websocket/websocketcli';
export default {
    data(){
        return {
            loading: true
        }
    },
    computed: {
   	    ...mapState([
            'selectId',
            'selectTarget',
            'searchText',
            'appHeight',
            'userInfoList',
            'emptyMessage'
        ]),
        ...mapGetters([
            'searchedConversationList'
        ]),
        isEmptyConversation(){
            return this.searchedConversationList.length == 0 && !this.emptyMessage;
        }
    },
    methods: {
    	...mapActions([
             'selectSession',
             'selectConversation',
        ]),
        processageGroupMessage(item){
            var protoConversationInfo = item.conversationInfo;
            var displayContent;
            if(protoConversationInfo.lastMessage){
                var messageContent = MessageConfig.convert2MessageContent(protoConversationInfo.lastMessage.from,protoConversationInfo.lastMessage.content);
                if(messageContent && messageContent instanceof NotificationMessageContent){
                    displayContent = messageContent.formatNotification();
                } else {
                    displayContent = protoConversationInfo.lastMessage.content.searchableContent;
                    if(protoConversationInfo.lastMessage.content.type === 400){
                        displayContent = '[网络电话]';
                    }
                    var isCurrentUser = protoConversationInfo.lastMessage.from === LocalStore.getUserId();
                    if(protoConversationInfo.conversationType == ConversationType.Group && !isCurrentUser){
                        var from = protoConversationInfo.lastMessage.from;
                        var displayName = this.getDisplayName(from);
                        displayContent = displayName +":"+protoConversationInfo.lastMessage.content.searchableContent;
                    }
                }
                
            }
           return displayContent;
        },
        getDisplayName(from){
            var displayName = from;
            displayName = webSocketClient.getDisplayName(from);
            return displayName;
        }	
    },
    filters: {
            // 将日期过滤为 hour:minutes
            time (date) {
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                if( typeof date === 'number'){
                    date = new Date(date);
                }
                if(date.getMinutes()<10){
                  return date.getHours() + ':0' +date.getMinutes();
                }else{
                  return date.getHours() + ':' + date.getMinutes();
                }
            },
            getTimeStringAutoShort2(timestamp){
                return TimeUtils.getTimeStringAutoShort2(timestamp,false);
            }
    },
}
</script>

<style lang="stylus" scoped>
.conversationlist
  height: 87%
  overflow-y: auto
  overflow-x: hidden
  box-sizing: border-box
  border-top: 1px solid #e7e7e7
  border-right: 1px solid #e7e7e7
  background: #f2f2f2
  .sessionlist
    display: flex
    padding: 12px
    transition: background-color .1s
    font-size: 0
    &:hover 
        background-color: rgb(220,220,220)
    &.active 
        background-color: #c4c4c4
    .avatar
        border-radius: 2px
        margin-right: 12px
    .list-right
        position: relative
        flex: 1
        margin-top: 4px
        .title-info
            display: flex
            .name
                flex: 1 1 auto
                display: inline-block
                width: 130px
                height: 15px
                line-height: 15px
                font-size: 14px
                overflow: hidden
                white-space:nowrap
                text-overflow:ellipsis
            .time
                flex: 0 0 auto
                float: right
                line-height: 15px
                color: #999
                font-size: 10px
                vertical-align: center
        .lastmsg-info
            display: flex
            margin-top: 8px    
            .lastmsg
                flex: 1 1 auto 
                font-size: 12px
                width: 130px
                height: 15px
                line-height: 15px
                color: #999
                bottom: 4px
                overflow: hidden
                white-space:nowrap
                text-overflow:ellipsis
            .unread-num
                flex: 0 0 auto
                vertical-align:bottom
                margin-top: 0px
                display: inline-block;
                min-width: 16px;
                height: 16px;
                background-color: red;
                border-radius: 8px;
                text-align: center;
                font-size: 12px;
                color: #fff;
                line-height: 16px;
                .unread-num-show
                   text-align: center;
                   font-size:10px;
                   -webkit-transform:scale(0.8);
                   display:block;
          
</style>
