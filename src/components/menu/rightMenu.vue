<template>
  <div v-bind:class="menuStyle" @contextmenu.prevent="">
   <div @click="recallMessage" v-if="isFrom">
    <a> 撤回消息 </a>
   </div> 
   <div @click="deleteMessage">
    <a> 删除消息 </a>
   </div>
   <div @click="relayMessage">
    <a> 转发 </a>
   </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import webSocketClient from '../../websocket/websocketcli';
import { SUCCESS_CODE } from '../../constant';
import RecallMessageNotification from '../../websocket/message/notification/recallMessageNotification';
import LocalStore from '../../websocket/store/localstore';
export default {
	name: 'rightmenu',
	props:['message'],
	computed:{
		...mapState([
			'showMessageRightMenu',
		]),
		menuStyle(){
            return {
				"right-menu-content": this.message.direction == 0,
				"right-menu-content-left": this.message.direction != 0
			}
		},
		isFrom(){
			// return this.message.direction == 0
			return true
		}
	},
	mounted() {
        document.addEventListener("click", e => {
            var isString = typeof(e.target.className) == 'string'
            let rightMenuDom = document.getElementById("right-menu-content");
			//注意点击显示按钮事件的处理，防止状态发生反转
			var menuSetting = this.showMessageRightMenu.find(setting => setting.messageId == this.message.messageId)
			var show = menuSetting ? menuSetting.show : false
			// console.log("isString "+isString +" show " +e.target.className.search('right-menu-content')+" show "+show+" contain "+rightMenuDom)
			if (isString && e.target.className.search('right-menu-content') == -1 && show) {
				this.noShowMenu();
            }
        });
    },
	methods:{
		recallMessage(){
			this.$store.state.currentRightMenuMessage = this.message
			webSocketClient.recallMessage(this.message.messageUid).then(data => {
				if(data.code == SUCCESS_CODE){
					if(data.result == 200){
						var recallMessageContent = new RecallMessageNotification(LocalStore.getUserId(),this.message.messageUid);
						this.message.content = recallMessageContent.encode();
						console.log("recall message "+this.message.messageId);
					} else {
						this.$message.error('非管理员只能撤回自己发送的消息');
					}
					
				}
			});
			this.noShowMenu();
		},
		deleteMessage(){
			this.$store.state.currentRightMenuMessage = this.message
			console.log("delete message id "+this.message.messageId)
			this.$store.dispatch('deleteMessage',this.message.messageId)
            this.noShowMenu();
		},
		relayMessage(){
			this.$store.state.currentRightMenuMessage = this.message
			this.$store.state.showRelayMessageDialog = true;
            this.noShowMenu();
		},
		noShowMenu(){
			var menuSetting = this.showMessageRightMenu.find(setting => setting.messageId == this.message.messageId)
			if(menuSetting){
                menuSetting.show = false;
			}
		}
	}
}
</script>


<style scoped>
div {
	-o-user-select: none;
    -moz-user-select: none; /*火狐 firefox*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10+*/
    -khtml-user-select :none; /*早期的浏览器*/
    user-select: none; 
}
.right-menu-content {
	position: absolute;
	background: #fff;
	width: 80px;
	text-align: center;
	right: 0px;
	bottom: 40px;
	z-index: 2000;
	padding: 2px 0;
	box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
	border-radius: 4px
}

.right-menu-content-left {
	position: absolute;
	background: #fff;
	width: 80px;
	text-align: center;
	left: 0px;
	bottom: 40px;
	z-index: 2000;
	padding: 2px 0;
	box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
	border-radius: 4px
}

div a {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	position: relative;
	cursor: pointer;
	font-size: 12px;
	color: #333
}

div a:hover {
	color: rgb(0,220,65)
}

div a:hover i {
	color: rgb(0,220,65)
}

.iconhover:hover {
	color: rgb(0,220,65)
}

.iconhover.on:hover {
	color: rgb(0,220,65)
}
</style>