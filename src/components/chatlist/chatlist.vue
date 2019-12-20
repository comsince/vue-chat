<!-- 聊天列表 -->
<template>
  <div class="msglist">
    <ul>
        <li v-for="item in searchedChatlist" class="sessionlist" :class="{ active: item.id === selectId }" @click="selectSession(item.id)">
            <div class="list-left">
            	<img class="avatar"  width="42" height="42" :alt="item.user.name" :src="item.user.img">
            </div>
            <div class="list-right">
            	<p class="name">{{item.user.name}}</p>
                <span class="time">{{item.messages[item.messages.length-1].date | time}}</span>
                <p class="lastmsg">{{item.messages[item.messages.length-1].content}}</p>
            </div>
        </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions ,mapGetters } from 'vuex'
export default {
    computed: {
   	    ...mapState([
            'selectId',
            'searchText'
        ]),
        ...mapGetters([
            'searchedChatlist'
        ])
    },
    methods: {
    	...mapActions([
             'selectSession',
    	])	
    },
    filters: {
            // 将日期过滤为 hour:minutes
            time (date) {
                if (typeof date === 'string') {
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
