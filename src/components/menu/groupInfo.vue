<template>
    <div id="group-info-id" class="group-content" :style="{height: (appHeight-61) + 'px'}">
        <div class="flex-layout">
            <div class="group-info-title" v-if="!isSingleConversation">
                <div class="group-name-info">
                    <div class="group-name-title">群名</div>
                    <p class="group-name" contenteditable="true" @blur="modifyGroupNameBlur" @keydown.enter="modifyGroupName">{{groupName}}</p>
                </div>
                <div class="group-board-info">
                    <div class="group-board-title">群公告</div>
                    <div class="group-board-content">暂无公告</div>
                </div>
            </div>
            <div class="friend-info-list" :style="{height: (appHeight-221) + 'px'}">
                <ul>
                    <li v-bind:key = index v-for="(item, index) in memberList" class="frienditem">
                        <div class="friend-info">
                            <i title="个人用户添加成员" class="icon iconfont icon-zengjia add" v-if="item.type == 1002" @click="addGroupMemberFromSingle"></i>
                            <i title="添加成员" class="icon iconfont icon-zengjia add" v-if="item.type == 1000" @click="addGroupMember"></i>
                            <i title="移除成员" class="icon iconfont icon-shanchu-fangkuang add" v-if="item.type == 1001" @click="kickGroupMember"></i>
                            <img class="avatar" :src="item.avatarUrl" onerror="this.src='static/images/vue.jpg'" v-if="item.type == 0 || item.type ==2">
                            <p class="nickName">{{item.displayName}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="flex-bottom" v-if="!isSingleConversation">
                <p class="quit-group" v-if="!isGroupOwner" @click="quitGroup">退出群聊</p>
                <p class="dismiss-group" v-if="isGroupOwner" @click="dismissGroup">解散群聊</p>
            </div>
        </div>
        
    </div>

</template>

<script>
import { mapState, mapActions ,mapGetters } from 'vuex'
import LocalStore from '../../websocket/store/localstore';
//注意websocketClient 不是常量引入
import webSocketClient from '../../websocket/websocketcli';
import { SUCCESS_CODE } from '../../constant';
import GroupMember from '../../websocket/model/groupMember';
import ModifyGroupInfoType from '../../websocket/message/modifyGroupInfoType'
import Logger from '../../websocket/utils/logger';
export default {
    name: 'groupInfoMenu',
    props: ['targetId'], 
    data(){
        return {
            isGroupOwner: false,
            groupMembers: [],
            addGroupMemberType: 1000,
            deleteGroupMemberType: 1001,
            addGroupMemberSingleType: 1002,
        }
    },
    mounted() {
        console.log("targetId "+this.targetId)
        document.addEventListener("click", e => {
            var isString = typeof(e.target.className) == 'string'
            let groupInfoDom = document.getElementById("group-info-id");
            // console.log("isString "+isString +" show "+e.target.className.search('show-group-info'))
            //注意点击显示按钮事件的处理，防止状态发生反转
			if (isString && e.target.className.search('show-group-info') == -1 && groupInfoDom && !groupInfoDom.contains(e.target) && this.$store.state.showGroupInfo) {
                this.$store.state.showGroupInfo = false;
            }
        });
    },

    destroyed() {
       this.groupMembers = []
    },
    computed: {
        ...mapState([
            'appHeight',
            'groupInfoList',
            'userInfoList',
            'groupMemberMap'
        ]),
        ...mapGetters([
            'isSingleConversation'
        ]),
        
        memberList(){
            var groupMembers = [];
            //add member item
            
            if(!this.isSingleConversation){
                var addGroupMember = new GroupMember()
                addGroupMember.type = this.addGroupMemberType;
                addGroupMember.displayName = '添加成员';
                groupMembers.push(addGroupMember);
                //delete member
                var deleteGroupMember = new GroupMember()
                deleteGroupMember.type = this.deleteGroupMemberType;
                deleteGroupMember.displayName = '移除成员';
                groupMembers.push(deleteGroupMember);
                if(this.groupMemberMap.get(this.targetId)){
                    for(var groupMember of this.groupMemberMap.get(this.targetId)){
                        if(groupMember.memberId == LocalStore.getUserId()){
                                this.isGroupOwner = groupMember.type == 2 ? true : false;
                        }
                        groupMember.displayName = webSocketClient.getDisplayName(groupMember.memberId);
                        groupMember.avatarUrl = webSocketClient.getPortrait(groupMember.memberId);
                        groupMembers.push(groupMember);
                    }
                }
                if(!this.isGroupOwner){
                    groupMembers.splice(1,1);
                }
            } else {
                var addGroupMember = new GroupMember()
                addGroupMember.type = this.addGroupMemberSingleType;
                addGroupMember.displayName = '添加成员';
                groupMembers.push(addGroupMember);

                var currentUser = new GroupMember();
                currentUser.displayName = webSocketClient.getDisplayName(LocalStore.getUserId());
                currentUser.avatarUrl = webSocketClient.getPortrait(LocalStore.getUserId());
                currentUser.memberId = LocalStore.getUserId();  
                groupMembers.push(currentUser)

                var targetUser = new GroupMember();
                targetUser.displayName = webSocketClient.getDisplayName(this.targetId);
                targetUser.avatarUrl = webSocketClient.getPortrait(this.targetId);
                targetUser.memberId = this.targetId;
                groupMembers.push(targetUser);
            }
            
            return groupMembers;
        },

        groupName: {
            get() {
                var groupName = "";
                var groupInfo = this.groupInfoList.find(groupInfo => groupInfo.target == this.targetId);
                if(groupInfo){
                    groupName = groupInfo.name;
                }
                return groupName;
            },
            set(value){
                var groupInfo = this.groupInfoList.find(groupInfo => groupInfo.target == this.targetId);
                if(groupInfo){
                    groupInfo.name = value;
                }
            }
        }

    },
    methods: {
        quitGroup(){
            this.$confirm('你将退出此群组, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                webSocketClient.quitGroup(this.targetId).then(data => {
                    if(data.code == SUCCESS_CODE){
                        this.$message({
                            type: 'success',
                            message: '退出群组成功!'
                        });
                        this.$store.state.showGroupInfo = false;
                        setTimeout(() => this.$store.dispatch('deleteConversation',this.targetId), 500) 
                    }
               })  
                    
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出群组'
                });          
            });  

            
        },
        dismissGroup(){
          this.$confirm('此操作将永久解散群组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                webSocketClient.dismissGroup(this.targetId).then(data => {
                    if(data.code == SUCCESS_CODE){
                        this.$message({
                            type: 'success',
                            message: '解散群组成功!'
                        });
                        this.$store.state.showGroupInfo = false;
                        setTimeout(() => this.$store.dispatch('deleteConversation',this.targetId), 500)
                    }
                })
                
          }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消解散群组'
            });          
          });    
        },
        addGroupMemberFromSingle(){
            this.$store.state.groupOperateState = 3;
            //触发groupMap以是vue相应变更
            this.$store.state.groupMemberTracker += 1;
            this.$store.state.showCreateGroupDialog = true;
        },
        addGroupMember(){
            this.$store.state.groupOperateState = 1;
            //触发groupMap以是vue相应变更
            this.$store.state.groupMemberTracker += 1;
            this.$store.state.showCreateGroupDialog = true;
        },
        kickGroupMember(){
            this.$store.state.groupOperateState = 2;
            //触发groupMap以是vue相应变更
            this.$store.state.groupMemberTracker += 1;
            this.$store.state.showCreateGroupDialog = true;
        },
        modifyGroupNameBlur(e){
            var inputName = e.target.innerText;
            if(this.groupName === inputName){
                 return
            }
            this.groupName = inputName;
            if(this.groupName && this.groupName.length < 15){
                webSocketClient.modifyGroupInfo({
                    groupId: this.targetId,
                    type: ModifyGroupInfoType.Modify_Group_Name,
                    value: this.groupName
                });
            } else {
                this.$message.error("群组名称过长最好不要超过15个字符");
            }
        },
        modifyGroupName(e){
           if(e.keyCode == 13){
              this.modifyGroupNameBlur(e);
              e.preventDefault();
           }
        }
    },
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
    z-index: 2000
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
                .add
                    margin-right: 12px
                    font-size: 32px
                    cursor: pointer
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
            .dismiss-group
                width: 100%
                color: red
                font-size: 16px
                cursor: pointer
                text-align: center          
</style>