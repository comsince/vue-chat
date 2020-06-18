import Logger from "./utils/logger";
import vuexStore from '../store'


export class WebSocketClient {
    
    getDisplayName(userId){
       var userInfolist = vuexStore.state.userInfoList;
       var userInfo = userInfolist.find(user => user.uid == userId);
       var displayName = userId;
       var friendData = vuexStore.state.friendDatas.find(friend => friend.friendUid == userId)
       if(friendData && friendData.alias && friendData.alias != ""){
           displayName = friendData.alias
       } else if(userInfo){
          displayName = userInfo.displayName;
          if(displayName == ''){
             displayName = userInfo.mobile;
          }
       } else {
         vuexStore.state.vueSocket.getUserInfo(userId);
       }
      //    console.log("userId "+userId +" displayName "+displayName) 
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

    modifyGroupInfo(info){
       return vuexStore.state.vueSocket.modifyGroupInfo(info);
    }

    quitGroup(groupId){
       return vuexStore.state.vueSocket.quitGroup(groupId);
    }

    dismissGroup(groupId){
       return vuexStore.state.vueSocket.dismissGroup(groupId);
    }

    getGroupMember(groupId){
       return vuexStore.state.vueSocket.getGroupMember(groupId);
    }

    addMembers(groupId, memberIds){
       return vuexStore.state.vueSocket.addMembers(groupId,memberIds);
    }

    kickeMembers(groupId,memberIds){
       return vuexStore.state.vueSocket.kickeMembers(groupId,memberIds);
    }

    recallMessage(messageUid){
       return vuexStore.state.vueSocket.recallMessage(messageUid);
    }

    getMinioUploadUrl(mediaType,key){
       return vuexStore.state.vueSocket.getMinioUploadUrl(mediaType,key);
    }
  
    modifyFriendAlias(targetUid,alias){
       return vuexStore.state.vueSocket.modifyFriendAlias(targetUid,alias)
    }

}

const self = new WebSocketClient();
export default self;