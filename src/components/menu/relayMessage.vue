<template>
    <div class="relay-message">
        <el-dialog
        title="转发"
        :visible.sync="showRelayMessageDialog"
        width="30%"
        :show-close="true"
        @close="handleClose"
        center>

        <el-dialog
          width="30%"
          title="转发"
          :visible.sync="innerVisible"
          append-to-body>
          <div v-if="isTextMessage">
            <el-input  
             type="textarea"
             :rows="3"
             v-model="waitRelayMessage"></el-input>
          </div>

          <div v-if="isImageMessage" style="text-align:center">
                <img :src="waitRelayImageUrl" class="preview-image">
          </div>

          <div v-if="isVideoMessage && innerVisible" style="text-align:center">
            <Xgplayer :config="videoConfig" @player="Player = $event"/>
          </div>
          
          <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="info" plain round @click="innerVisible=false">取 消</el-button>
            <el-button size="medium" type="success" plain round @click="sendRelayMessage">确 定</el-button>
        </span>   
        </el-dialog>

        <el-input v-model="conversationInput" prefix-icon="el-icon-search" placeholder="请输入会话名称" @keydown.enter.native="searchConversation"></el-input>
        <el-table
            :data="conversationList"
            :show-header="false"
            :fit="true"
            :highlight-current-row="false"
            max-height="300"
            @row-click="showRelayMessageRequestDialog"
            style="width: 100%;margin-top:10px">
            <el-table-column
                prop="image"
                label="会话头像"
                width="50"
                >
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.image"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="会话名称">
                <template slot-scope="scope">
                    <div>
                        <p class="conversation-name">{{scope.row.name}}</p>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MessageConfig from '../../websocket/message/messageConfig';
import TextMessageContent from '../../websocket/message/textMessageContent';
import ImageMessageContent from '../../websocket/message/imageMessageContent';
import SendMessage from '../../websocket/message/sendMessage'
import Xgplayer from 'xgplayer-vue';
import VideoMessageContent from '../../websocket/message/videoMessageContent';
export default {
    components:{
        Xgplayer
    },
    data() {
        return {
            conversationInput: '',
            waitRelayMessage: '',
            waitRelayImageUrl: '',
            innerVisible: false,
            waitSendTarget: null,
            currentSendMessage: null,
            videoConfig: null,
            Player: null,
        }
    },
    methods: {
      changeRelayMessageDialog(){
        this.$store.state.showRelayMessageDialog = false;
      },
      searchConversation(e){
         console.log("search conversation ");
         if(e.keyCode === 13 && this.conversationInput != ""){
            //this.$store.dispatch('searchUser', this.conversationInput);
            this.conversationInput = '';
         }
      },
      handleClose(){
          //this.$store.dispatch('updateSearchUser', []);
      },
      showRelayMessageRequestDialog(row, event, column){
          var target = row.target;
          this.innerVisible=true;
          if(this.currentRightMenuMessage){
              console.log("conent type "+this.currentRightMenuMessage.content.type)
              var messageContent = MessageConfig.convert2MessageContent(this.currentRightMenuMessage.from,this.currentRightMenuMessage.content)
              if(messageContent instanceof TextMessageContent){
                   this.waitRelayMessage = messageContent.digest();
              } else if(messageContent instanceof ImageMessageContent){
                   this.waitRelayImageUrl = messageContent.remotePath;
              } else if(messageContent instanceof VideoMessageContent){
                  var posterBase64 = "data:image/png;base64,"+messageContent.thumbnail;
                   this.videoConfig = {
                        id: 'vs'+new Date().getTime(),
                        // url 为空,可能导致不显示,这里强制写入poster
                        url: messageContent.remotePath == ''? posterBase64: messageContent.remotePath,
                        // height: 330,
                        // width: 250,
                        fluid: true,
                        // fitVideoSize: 'fixHeight',
                        poster: posterBase64,
                        autoplay: false,
                        download: true
                    }
              }
              this.currentSendMessage = new SendMessage(target,messageContent);
          }
      },
      sendRelayMessage(){
        this.innerVisible=false;
        this.$store.dispatch('sendMessage', this.currentSendMessage)
      },
      
   },
   computed: {
     ...mapState([
         'currentRightMenuMessage'
        ]),
    ...mapGetters([
            'searchedConversationList',
        ]),    
     showRelayMessageDialog : {
         get () {
             return this.$store.state.showRelayMessageDialog;
         },
         set(val) {
             this.$store.state.showRelayMessageDialog = val;
         }
     },
     conversationList(){
         var conversationList = [];
         if(this.searchedConversationList){
             for(var conversationInfo of this.searchedConversationList){
                conversationList.push({
                    image : conversationInfo.img,
                    name : conversationInfo.name,
                    target : conversationInfo.conversationInfo.target
                })
             }
         }
         return conversationList;
     },
     isTextMessage(){
          var flag = false
          if(this.currentRightMenuMessage){
              flag = this.currentRightMenuMessage.content.type == 1
          }
          console.log("flag "+flag)
          return flag
     },
     isImageMessage(){
         var flag = false
          if(this.currentRightMenuMessage){
              flag = this.currentRightMenuMessage.content.type == 3
          }
          console.log("flag "+flag)
          return flag
     },
     isVideoMessage(){
         var flag = false
          if(this.currentRightMenuMessage){
              flag = this.currentRightMenuMessage.content.type == 6
          }
          console.log("flag "+flag)
          return flag
     }
   }
}
</script>

<style scoped>

.preview-image{
    max-width : 115px;
    max-height : 330px;
    text-align: center;
    border-radius: 3px
}
      

.relay-message .icon {
   display: inline-block;
   font-size: 26px; 
   color: rgb(0,220,65);
}

.conversation-name {
    line-height: 15px;
    font-size: 14px;
    width: 300px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}

.layout-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
}

.el-dialog__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>