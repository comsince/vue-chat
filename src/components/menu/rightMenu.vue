<template>
  <div class="add-content">
   <div @click="recallMessage">
    <a> 撤回消息 </a>
   </div> 
   <div @click="deleteMessage">
    <a> 删除消息 </a>
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
            'showMessageRightMenu'
        ]),
	},
	methods:{
		recallMessage(){
			webSocketClient.recallMessage(this.message.messageUid).then(data => {
				if(data.code == SUCCESS_CODE){
					var recallMessageContent = new RecallMessageNotification(LocalStore.getUserId(),this.message.messageUid);
					this.message.content = recallMessageContent.encode();
					console.log("recall message "+this.message.messageId);
				}
			});
			this.noShowMenu();
		},
		deleteMessage(){
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
.add-content {
	position: absolute;
	background: #fff;
	width: 80px;
	text-align: center;
	right: 0px;
	bottom: 40px;
	z-index: 20;
	padding: 2px 0;
	box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
	border-radius: 4px
}
.add-content a {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	position: relative;
	cursor: pointer;
	font-size: 12px;
	color: #333
}

.add-content a:hover {
	color: rgb(0,220,65)
}

.add-content a:hover i {
	color: rgb(0,220,65)
}

.iconhover:hover {
	color: rgb(0,220,65)
}

.iconhover.on:hover {
	color: rgb(0,220,65)
}
</style>