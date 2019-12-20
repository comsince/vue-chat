<!-- 好友信息 -->
<template>
   <div class="Info-wrapper">
        <div class="newfriend" v-show="selectedFriend.id === 0">
			<div class="nickname">{{selectedFriend.nickname}}</div>
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
	   	    	<div class="remark"><span>备&nbsp&nbsp&nbsp注</span>{{selectedFriend.remark}}</div>
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
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'selectedFriend'
        ])
    },
    methods: {
    	send () {
    		this.$store.dispatch('send')
    		this.$store.dispatch('search', '')
    	}
    }
}
</script>

<style lang="stylus" scoped>
.newfriend
    height: 60px
    padding: 28px 0 0 30px
    box-sizing: border-box
    border-bottom: 1px solid #e7e7e7
    .nickname
        font-size: 18px
.friendInfo
    padding: 0 90px
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

