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
export default {
   components: {
   	 search,
   	 chatlist,
   	 message,
   	 vText
   },
   mounted(){
      var socket = new VueSocket('ws','127.0.0.1',9326, 25 * 1000, 30 * 1000,'blob');
	  socket.connect(true);
   }
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  width: 800px
  .msglist
    width: 250px
    background: rgb(230,230,230)
  .chatbox
    flex: 1
</style>
