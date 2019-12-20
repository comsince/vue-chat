<!-- 好友列表 -->
<template>
 <div class="friendlist">
 	<ul>
        <li v-for="item in searchedFriendlist" class="frienditem"  :class="{ noborder: !item.initial}">
            <div class="list_title" v-if="item.initial">{{item.initial}}</div>
            <div class="friend-info" :class="{ active: item.id === selectFriendId }" @click="selectFriend(item.id)">
                <img class="avatar"  width="36" height="36" :src="item.img">
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
            'searchText'
        ]),
        ...mapGetters([
            'searchedFriendlist'
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
    height: 540px
    overflow-y: auto
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



</style>
