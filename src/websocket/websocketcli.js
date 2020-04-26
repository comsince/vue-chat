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


}

const self = new WebSocketClient();
export default self;