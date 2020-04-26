<!-- 最左边的选择框 -->
<template>
	<div class="mycard" ref="mycardRef">
	    <header>
	    	<img :src="user.img" class="avatar" @click="showPersonCard" @dblclick="changeFullScreenMode">
			<personcard v-if="showPersonalCard" v-bind:userId="userId"></personcard>
	    </header>
	    <div class="navbar" @click="clearSearch">
			<div class="conversation-item">
				<span v-if="unreadTotalCount > 0" class="unread-num">
					<span class="unread-num-show">{{unreadTotalCount}}</span>
				</span>
				<router-link to="/conversation" class="icon iconfont icon-dkw_xiaoxi" >
				</router-link>
			</div>
			<div class="friend-item">
				<span v-if="newFriendRequestCount > 0" class="unread-friend-request-num">
				</span>
				<router-link to="/friend" class="icon iconfont icon-pengyou">	
				</router-link>
			</div>
			
			<div class="icon iconfont icon-jiahaoyou" @click="showAddRequestTip = !showAddRequestTip">
				<addtip v-show="showAddRequestTip"></addtip>
			</div> 
	    </div>
	    <footer>
	        <i title = "退出" class="icon iconfont icon-tuichu" @click="loginOut"></i>
	    </footer>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import addtip from '../../components/menu/addtip'
import personcard from '../../components/menu/personalCard'
import webSocketCli from '../../websocket/websocketcli'
import Logger from '../../websocket/utils/logger'

export default {
	components: {
		addtip,
		personcard
	},
	data() {
		return {
			showAddRequestTip: false,
			showPersonalCard: false
		}
	},
    computed: {
       ...mapState([
			 'user',
			 'userId',
			 'newFriendRequestCount'
	   ]),
	   ...mapGetters([
		   'unreadTotalCount',
	   ])
    },
    methods: {
		showPersonCard(){
			this.showPersonalCard = !this.showPersonalCard
		},
    	clearSearch() {
    		this.$store.dispatch('search', '')
		},
		loginOut(){
			this.$store.dispatch('loginOut','');
		},
		changeFullScreenMode(){
			var fullscreen = this.$store.state.changeFullScreenMode;
			console.log('change screen mode '+fullscreen);
			var _this = this;
			_this.$store.state.changeFullScreenMode = !fullscreen;
			setTimeout(() => {
				let mycardHeight= _this.$refs.mycardRef.offsetHeight;
				console.log('resize mycard height '+mycardHeight);
				_this.$store.state.appHeight = mycardHeight;
			},200);
			
		}
	},
	
	mounted(){
		document.addEventListener("click",e=>{
			var isString = typeof(e.target.className) == 'string'
			if (isString && e.target.className.search('icon-jiahaoyou') == -1 && e.target.className !== 'add-content' && this.showAddRequestTip) {
                this.showAddRequestTip = false;
			}
			let personCardDom = document.getElementById("personal-card");
			if (isString && e.target.className.search('avatar') == -1 && personCardDom && !personCardDom.contains(event.target) && this.showPersonalCard) {
                this.showPersonalCard = false;
            }
		});
	}
}
</script>

<style lang="stylus" scoped>
@import '../../assets/fonts/iconfont.css'
.mycard
    position: relative
    width: 100%
    height: 100%
    .avatar
	    width: 36px
	    height: 36px
	    margin: 20px 12px 0 12px
	    border-radius: 2px
    .navbar
        width: 100%
        text-align: center
	    .icon
	        display: inline-block
	        font-size: 26px
	        margin-top: 28px
	        padding: 0 16px
	        box-sizing: border-box
	        color: rgb(173,174,175)
	        opacity: 1
	        cursor: pointer
	        &.active
	            color: rgb(0,220,65)
	        &:hover
	            opacity: 1;
	    .icon-msg,.icon-more
	        font-size: 22px
	    .icon-msg
	        padding: 0 19px
	.friend-item
	    position:relative
		.unread-friend-request-num
			display: inline-block
			min-width: 5px
			height: 5px
			background-color: red
			border-radius: 8px
			text-align: center
			font-size: 12px
			color: #fff
			line-height: 16px
			position:absolute
			top: 25px
			right: 17px
			z-index: 10	
	.conversation-item
	    position:relative
		.unread-num
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
			top: 20px
			right: 17px
			z-index: 10
			.unread-num-show
                font-size:10px;
                -webkit-transform:scale(0.8);
                display:block;
	footer
	    position: absolute
	    bottom: 20px
	    width: 100%
	    text-align: center
</style>
