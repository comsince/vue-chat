<template>
	<div class="content">
		<div class="msglist">
			<search></search>
			<chatlist></chatlist>
		</div>
		<div class="chatbox">
			<message></message>
			<v-text></v-text>
		</div>
	</div>
</template>

<script>
import search from '../../components/search/search'
import chatlist from '../../components/chatlist/chatlist'
import message from '../../components/message/message'
import vText from '../../components/text/text'
import VueSocket from '../../websocket/index'
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE} from '../../constant/index'
export default {
   components: {
   	 search,
   	 chatlist,
   	 message,
   	 vText
   },
   mounted(){
    //   var socket = new VueSocket(WS_PROTOCOL,WS_IP,WS_PORT, HEART_BEAT_INTERVAL, RECONNECT_INTERVAL,BINTRAY_TYPE,this.$store);
	//   socket.connect(true);
   }
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  width: 100%
  height: 100%
  .msglist
    width: 250px
    background: #fff
  .chatbox
    flex: 1
</style>
