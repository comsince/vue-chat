<template>
    <div id="group-info-id" class="group-content" :style="{height: (appHeight-61) + 'px'}">
        <div class="flex-layout">
            <div class="group-info-title">
                <div class="group-name-info">
                    <div class="group-name-title">群名</div>
                    <p class="group-name">{{groupName()}}</p>
                </div>
                <div class="group-board-info">
                    <div class="group-board-title">群公告</div>
                    <div class="group-board-content">暂无公告</div>
                </div>
            </div>
            <div class="friend-info-list" :style="{height: (appHeight-221) + 'px'}">
                <ul>
                    <li v-bind:key = index v-for="(item, index) in friendInfoList" class="frienditem">
                        <div class="friend-info">
                            <img class="avatar" :src="item.avatarUrl" onerror="this.src='static/images/vue.jpg'">
                            <p class="nickName">{{item.displayName}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="flex-bottom">
                <p class="quit-group">退出群聊</p>
            </div>
        </div>
        
    </div>

</template>

<script>
import { mapState, mapActions ,mapGetters } from 'vuex'
export default {
    name: 'groupInfoMenu',
    props: ['groupId'],
    data(){
        return {
            friendInfoList: [{
                displayName: "测试长名称来阿斯顿",
                avatarUrl: "http://image.comsince.cn/1-xIxQxQEE-1586853153457-xixi.jpg"
            },
            {
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-xIxQxQEE-1586853153457-xixi.jpg"
            },{
                displayName: "测试官方即时支持",
                avatarUrl: "http://image.comsince.cn/1-8Y8E8Ett-1586856301263-0902399d1a8450f8bf1475c1771cb62.png"
            },{
                displayName: "测试和那地方阿斯顿发射的发射的",
                avatarUrl: "http://image.comsince.cn/1-qJqkqkBB-1586859367172-152c33b18a346dbc7f4b9d95511e1c47.jpg"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-U6UwUw44-1586917334427-verificationCode.png"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-U6UwUw44-1586917334427-verificationCode.png"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-WUWPWPJJ-1587088366830-101.jpg"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-U6UwUw44-1586917334427-verificationCode.png"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-STTnSntt-1587103966305-cat.jpeg"
            },{
                displayName: "测试",
                avatarUrl: "http://image.comsince.cn/1-LOM7L7LL-1587120333078-微信图片_20200326145119.jpg"
            }]
        }
    }, 
    computed: {
        ...mapState([
            'appHeight',
            'groupInfoList',
        ]),
        ...mapGetters([
        ]),
    },
    methods: {
        groupName(){
            var groupName = "";
            var groupInfo = this.groupInfoList.find(groupInfo => groupInfo.target == this.groupId);
            if(groupInfo){
               groupName = groupInfo.name;
            }
            return groupName;
        }
    }
}
</script>

<style lang="stylus" scoped>
.group-content
    position: absolute
    background: #fff
    height: 200px
    width: 220px
    top: 61px
    right: 0px
    z-index: 20
    border-left: 1px solid #e7e7e7 
    .flex-layout
        width: 100%
        height: 100%
        display: flex
        flex-flow: row wrap
        .group-info-title
            margin-left: 10px
            width: 100%
            height: 120px
            padding 10px 5px 10px 5px
            border-bottom: 1px solid #e7e7e7 
            .group-name-info
                width: 100%
                height: 50%
                margin-bottom: 5px
                .group-name-title
                    font-size: 13px
                    line-height: 1.6
                    color: #888
                .group-name
                    font-size: 14px 
                    line-height: 1.6
                    width: 200px  
                    overflow: hidden
                    white-space: nowrap
                    text-overflow: ellipsis  
            .group-board-info
                width: 100%
                height: 50%
                .group-board-title 
                    font-size: 13px
                    line-height: 1.6
                    color: #888
                .group-board-content 
                    font-size: 14px
                    line-height: 1.6   
        .friend-info-list
            width: 100%
            margin-left: 10px
            overflow-y: auto
            .frienditem
                padding: 5px 0px 5px 0px
            .friend-info
                display: flex
                padding: 5px
                height: 40px
                .avatar
                    border-radius: 2px
                    margin-right: 12px
                    width: 32px
                    height: 32px
                .nickName
                    flex: 1 1 auto
                    width: 106px
                    font-size: 14px
                    line-height: 32px
                    overflow: hidden
                    white-space: nowrap
                    text-overflow: ellipsis
                    color: black       
        .flex-bottom
            width: 100%
            height: 40px
            align-self: flex-end
            display: flex
            align-items: center
            padding: 15px 0px 15px 0px
            border-top: 1px solid #e7e7e7 
            .quit-group
                width: 100%
                color: rgb(0,220,65);
                font-size: 16px
                cursor: pointer
                text-align: center           
</style>