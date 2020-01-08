<!-- 聊天列表 -->
<template>
  <div class="msglist">
    <ul>
        <li v-for="item in searchedConversationList" class="sessionlist" :class="{ active: item.conversationInfo.target === selectTarget }" @click="selectConversation(item.conversationInfo.target)">
            <div class="list-left">
            	<img class="avatar"  width="42" height="42" alt="static/images/vue.jpg" :src="item.img" onerror="this.src='static/images/vue.jpg'">
            </div>
            <div class="list-right">
            	<p class="name">{{item.name.substring(0,15)}}</p>
                <span class="time">{{item.conversationInfo.timestamp | time}}</span>
                <p class="lastmsg">{{processageGroupMessage(item)}}</p>
            </div>
        </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions ,mapGetters } from 'vuex'
import ConversationType from '../../websocket/model/conversationType';
import LocalStore from '../../websocket/store/localstore';
export default {
    computed: {
   	    ...mapState([
            'selectId',
            'selectTarget',
            'searchText'
        ]),
        ...mapGetters([
            'searchedChatlist',
            'searchedConversationList'
        ])
    },
    methods: {
    	...mapActions([
             'selectSession',
             'selectConversation',
        ]),
        processageGroupMessage(item){
            var protoConversationInfo = item.conversationInfo;
            var displayContent = protoConversationInfo.lastMessage.content.searchableContent;
            var isCurrentUser = protoConversationInfo.lastMessage.from === LocalStore.getUserId();
            if(protoConversationInfo.conversationType == ConversationType.Group && !isCurrentUser){
                var from = protoConversationInfo.lastMessage.from;
                console.log("conversation group from "+from);
                var displayUserInfo = this.$store.state.userInfos.get(from);
                var displayName = ''
                if(displayUserInfo){
                    displayName = displayUserInfo.displayName;
                    if(!displayName){
                        displayName = displayUserInfo.mobile;
                    }
                }
                displayContent = displayName +":"+protoConversationInfo.lastMessage.content.searchableContent;
            }

           return displayContent;
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
            }
    },
}
</script>

<style lang="stylus" scoped>
.msglist
  height: 540px
  overflow-y: auto
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
	    .name
	        display: inline-block
	        vertical-align: top
	        font-size: 14px
	    .time
	        float: right
	        color: #999
	        font-size: 10px
	        vertical-align: top
        .lastmsg
            position: absolute
            font-size: 12px
            width: 130px
            height: 15px
            line-height: 15px
            color: #999
            bottom: 4px
            overflow: hidden
            white-space:nowrap
            text-overflow:ellipsis
</style>
