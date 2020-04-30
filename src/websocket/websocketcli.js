import Logger from "./utils/logger";
import vuexStore from '../store'


export class WebSocketClient {
    
    getDisplayName(userId){
       var userInfolist = vuexStore.state.userInfoList;
       var userInfo = userInfolist.find(user => user.uid == userId);
       var displayName = userId;
       if(userInfo){
          displayName = userInfo.displayName;
          if(displayName == ''){
             displayName = userInfo.mobile;
          }
       } else {
         vuexStore.state.vueSocket.getUserInfo(userId);
       }
      //  console.log("userId "+userId +" displayName "+displayName) 
       return displayName;
    }

    getPortrait(userId){
      var userInfolist = vuexStore.state.userInfoList;
      var userInfo = userInfolist.find(user => user.uid == userId);
      var portrait = 'static/images/vue.jpg'
      if(userInfo){
          portrait = userInfo.portrait;
      }
      return portrait;
    }


    createGroup(groupName,memberIds){
       return vuexStore.state.vueSocket.createGroup(groupName,memberIds);
    }

    quitGroup(groupId){
       return vuexStore.state.vueSocket.quitGroup(groupId);
    }

    getGroupMember(groupId){
       return vuexStore.state.vueSocket.getGroupMember(groupId);
    }

    recallMessage(messageUid){
       return vuexStore.state.vueSocket.recallMessage(messageUid);
    }


}

const self = new WebSocketClient();
export default self;