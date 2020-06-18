<!-- 好友信息 -->
<template>
   <div class="Info-wrapper">
        <div class="newfriend">
			<div class="nickname">{{selectedFriend.nickname}}</div>
		</div>
		<div class="friendrequest" v-show="selectedFriend.id === 0" :style="{height: (appHeight -60) + 'px'}">
           <el-table
            :data="friendRequests"
            :show-header="false"
            :max-height="appHeight - 61"
            style="width: 100%;height:100%;">
            <el-table-column
                prop="image"
                label="头像"
                width="50">
                <template slot-scope="scope">
                    <el-avatar :src="friendPortrait(scope.row.from)"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="280">
                <template slot-scope="scope">
                    <div>
                        <p>{{friendName(scope.row.from)}}</p>
                        <p>{{scope.row.reason}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="加好友"
                align="right"
                >
                <template slot-scope="scope">
                    <!-- <el-button
                        size="mini"
                        type="info"
                        @click="handleEdit(scope.$index, scope.row)">拒绝</el-button> -->
                    <el-button
                        size="mini"
                        type="success"
                        :disabled="scope.row.status === 1"
                        @click="handleFriendRequest(scope.row)">{{requestBtnMessage(scope.row)}}</el-button>
                </template>
            </el-table-column>
           </el-table>
		</div>
        <div class="friendInfo" v-show="selectedFriend.id > 0">
	   	    <div class="esInfo" >
	   	    	<div class="left">
	   	    		<div class="people">
	   	    			<div class="nickname">{{selectedFriend.nickname}}</div>
	   	    			<div :class="[selectedFriend.sex===1?'gender-male':'gender-female']"></div>
	   	    		</div>
	   	    		<div class="signature">{{selectedFriend.signature}}</div>
	   	    	</div>
	   	    	<div class="right">
	   	    	    <img class="avatar"  width="60" height="60" :src="selectedFriend.img">
	   	    	</div>
	   	    </div>
	   	    <div class="detInfo">
                <div class="remark">
                    <label class="title" for="">备注：</label>
                    <p class="value" contenteditable="true" @keydown.enter="modifyRemark" @blur="modifyRemarkBlur">{{selectedFriend.remark}}</p>
                </div>
	   	    	<div class="area"><span>地&nbsp&nbsp&nbsp区</span>{{selectedFriend.area}}</div>
	   	    	<div class="wxid"><span>微信号</span>{{selectedFriend.wxid}}</div>
	   	    </div>
	   	    <div class="send" @click="send">
    	        <span>发消息</span>
            </div>
	   	</div>
   </div>
</template>

<script>
import router from '../../router'
import { mapGetters,mapState } from 'vuex'
import LocalStore from '../../websocket/store/localstore'
import webSocketCli from '../../websocket/websocketcli'
import { SUCCESS_CODE } from '../../constant'
export default {
    computed: {
        ...mapGetters([
            'selectedFriend'
        ]),
        ...mapState([
          'friendRequests',
          'appHeight',
          'userInfoList'
        ]),
        // friendRemark:{
        //     get(){
        //         console.log("remark test")
        //         return "test"
        //         //return this.selectedFriend.remark 
        //     },
        //     set(value){
        //         console.log("remark vaule "+value)
        //         // this.selectedFriend.remark = value;
        //     }
        // }
    },
    methods: {
    	send () {
    		this.$store.dispatch('send')
    		this.$store.dispatch('search', '')
        },
        requestBtnMessage(request){
           if(request.status === 1){
              return "已添加";
           } else if(request.status === 2){
              return "已拒绝"
           } else if(request.status === 0){
              return "接受"
           }
        },
        handleFriendRequest(request){
            this.$store.dispatch('handleFriendRequest', {
                targetUid: request.from,
                status: 1
            })  
        },
        friendName(target){
           var user = this.userInfoList.find(user => user.uid == target);
           var displayName = target;
           if(user){
               displayName = user.displayName;
               if(!displayName){
                  displayName = user.mobile;
               }
           } 
           return displayName;
        },
        friendPortrait(target){
            var user = this.userInfoList.find(user => user.uid == target);
            var portrait;
            if(user){
                portrait = user.portrait;
            }
            
            if(!portrait){
                portrait =  "static/images/vue.jpg";
            }
            return portrait;
        },
        modifyRemark(e){
            if(e.keyCode == 13){
              e.preventDefault();
              this.modifyRemarkBlur(e)
           }
        },
        modifyRemarkBlur(e){
            var remark = e.target.innerText;
            if(remark == this.selectedFriend.remark){
               return
            }
            this.selectedFriend.remark = remark;
            if(remark != '' && remark.length < 15){
                webSocketCli.modifyFriendAlias(this.selectedFriend.wxid,remark).then(data =>{
                   if(data.code == SUCCESS_CODE){
                       this.$message.success("修改好友备注成功");
                   } else {
                       this.$message.error("修改好友备注失败");
                   }
                })
            } else {
                this.$message.error("备注过长最好不要超过15个字符");
            }
        }
		
    }
}
</script>

<style lang="stylus" scoped>
.newfriend
    height: 60px
    padding: 28px 0 0 30px
    box-sizing: border-box
    .nickname
        font-size: 18px
.friendrequest
    border-top: 1px solid #e7e7e7
.friendInfo
    padding: 0 90px
    border-top: 1px solid #e7e7e7
	.esInfo
	    display: flex
	    align-items: center
	    padding: 100px 0 45px 0
	    .left
	        flex: 1
	        .people
	            .nickname
	                display: inline-block
	                font-size: 20px
	                margin-bottom: 16px
	            .gender-male,.gender-female
	                display: inline-block
	                width: 18px
	                height: 18px
	                vertical-align: top
	                margin-top: 2px
	            .gender-male
	                background-image: url(man.png)
	                background-size: cover
	            .gender-female
	                background-image: url(woman.png)
	                background-size: cover
	        .signature
	            font-size: 14px
	            color: rgba(153,153,153,.8)
	    .right
	        .avatar
	            border-radius: 3px
	.detInfo
	    padding: 40px 0
	    border-top: 1px solid #e7e7e7
	    border-bottom: 1px solid #e7e7e7
	    .remark,.area,.wxid
	        font-size: 14px
	        margin-top: 20px
	        span
	            font-size: 14px
	            color: rgba(153,153,153,.8)
	            margin-right: 40px
	    .remark
            .title
                float: left;
                font-size: 14px;
                line-height: 1.6
                color: rgba(153,153,153,.8);
                margin-right: 10px;
            .value
                font-size: 14px;
                width: 200px;
                line-height: 1.6
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
                padding-left: 5px;
                padding-right: 5px;    
	        margin-top: 0
	.send
        position: relative
        text-align: center
        width: 140px
        height: 36px
        left: 115px
        top: 50px
        line-height: 36px
        font-size: 14px
        color: #fff
        background-color: #1aad19
        cursor: pointer
        border-radius: 2px
        &:hover
            background: rgb(18,150,17)
</style>

