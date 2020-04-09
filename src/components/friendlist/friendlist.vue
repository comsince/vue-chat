<!-- 好友列表 -->
<template>
 <div class="friendlist" :style="{height: (appHeight-60) + 'px'}">
 	<ul>
        <li v-bind:key = index v-for="(item, index) in searchedFriendlist" class="frienditem"  :class="{ noborder: !item.initial}">
            <div class="list_title" v-if="item.initial">{{item.initial}}</div>
            <div class="friend-info" :class="{ active: item.id === selectFriendId }" @click="selectFriend(item.id)">
                <div class="friend-item">
                    <span v-if="newFriendRequestCount > 0 && item.id === 0" class="unread-friend-request-num">
                            <span class="unread-num-show">{{newFriendRequestCount}}</span>
                    </span>
                    <img class="avatar"  width="36" height="36" :src="item.img" onerror="this.src='static/images/vue.jpg'">
			    </div>
                <div class="remark">{{item.remark}}</div>
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
            'selectFriendId',
            'searchText',
            'appHeight',
            'newFriendRequestCount'
        ]),
        ...mapGetters([
            'searchedFriendlist',
        ])
    },
    methods: {
        ...mapActions([
             'selectFriend',
        ])  
    }
}
</script>

<style lang="stylus" scoped>
.friendlist
    height: 87%
    overflow-y: auto
    border-top: 1px solid #e7e7e7
    border-right: 1px solid #e7e7e7
    background: #f2f2f2
    .frienditem
        border-top: 1px solid #dadada
        &:first-child,&.noborder
            border-top: none
        .list_title
            box-sizing: border-box
            width: 100%
            font-size: 12px
            padding: 15px 0 3px 12px
            color: #999
        .friend-info
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
            .remark
                font-size: 14px
                line-height: 36px
            .friend-item
                position:relative
                .unread-friend-request-num
                    display: inline-block
                    min-width: 16px
                    height: 16px
                    background-color: red
                    border-radius: 8px
                    text-align: center
                    font-size: 12px
                    color: #fff
                    line-height: 16px
                    position:absolute
                    top: -5px
                    right: 5px
                    z-index: 10
                    .unread-num-show
                        font-size:10px;
                        -webkit-transform:scale(0.8);
                        display:block;	


</style>
