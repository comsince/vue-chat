import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import VueWebSocket from './websocket';
import VoipClient from './webrtc/voipclient'
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE, KEY_VUE_USER_ID, KEY_VUE_TOKEN} from './constant/index'
import StateConversationInfo from './websocket/model/stateConversationInfo';
import StateChatMessage from './websocket/model/stateSelectChatMessage'
import Message from './websocket/message/message';
import ProtoMessage from './websocket/message/protomessage';
import ConversationType from './websocket/model/conversationType';
import LocalStore from './websocket/store/localstore';
import ProtoConversationInfo from './websocket/model/protoConversationInfo';
import UnreadCount from './websocket/model/unReadCount';
import StateSelectChateMessage from './websocket/model/stateSelectChatMessage';
import Notify from '@wcjiang/notify';
import MessageConfig from './websocket/message/messageConfig';
import ChatManager from './websocket/chatManager';
import ProtoMessageContent from './websocket/message/protomessageContent';

Vue.use(Vuex)

//获取当前时间
const now = new Date();
const state = {
	// 输入的搜索值
	searchText: '',
	// 当前登录用户
    user: {
    	name: 'ratel',
    	img: 'static/images/vue.jpg'
    },
    // 好友列表
    friendlist: [
        {
            id: 0,
            wxid: "new", //微信号
            initial: '新的朋友', //姓名首字母
            img: 'static/images/newfriend.jpg', //头像
            signature: "", //个性签名
            nickname: "新的朋友",  //昵称
            sex: 0,   //性别 1为男，0为女
            remark: "新的朋友",  //备注
            area: "",  //地区
        }
        
    ],
    //emoji表情
    emojis: [
        { file: '100.gif', code: '/::)', title: '微笑',reg:/\/::\)/g },
        { file: '101.gif', code: '/::~', title: '伤心',reg:/\/::~/g },
        { file: '102.gif', code: '/::B', title: '美女',reg:/\/::B/g },
        { file: '103.gif', code: '/::|', title: '发呆',reg:/\/::\|/g },
        { file: '104.gif', code: '/:8-)', title: '墨镜',reg:/\/:8-\)/g },
        { file: '105.gif', code: '/::<', title: '哭',reg:/\/::</g },
        { file: '106.gif', code: '/::$', title: '羞',reg:/\/::\$/g },
        { file: '107.gif', code: '/::X', title: '哑',reg:/\/::X/g },
        { file: '108.gif', code: '/::Z', title: '睡',reg:/\/::Z/g },
        { file: '109.gif', code: '/::\'(', title: '哭',reg:/\/::'\(/g },
        { file: '110.gif', code: '/::-|', title: '囧',reg:/\/::-\|/g },
        { file: '111.gif', code: '/::@', title: '怒',reg:/\/::@/g },
        { file: '112.gif', code: '/::P', title: '调皮',reg:/\/::P/g },
        { file: '113.gif', code: '/::D', title: '笑',reg:/\/::D/g },
        { file: '114.gif', code: '/::O', title: '惊讶',reg:/\/::O/g },
        { file: '115.gif', code: '/::(', title: '难过',reg:/\/::\(/g },
        { file: '116.gif', code: '/::+', title: '酷',reg:/\/::\+/g },
        { file: '117.gif', code: '/:--b', title: '汗',reg:/\/:--b/g },
        { file: '118.gif', code: '/::Q', title: '抓狂',reg:/\/::Q/g },
        { file: '119.gif', code: '/::T', title: '吐',reg:/\/::T/g },
        { file: '120.gif', code: '/:,@P', title: '笑',reg:/\/:,@P/g },
        { file: '121.gif', code: '/:,@-D', title: '快乐',reg:/\/:,@-D/g },
        { file: '122.gif', code: '/::d', title: '奇',reg:/\/::d/g },
        { file: '123.gif', code: '/:,@o', title: '傲' ,reg:/\/:,@o/g},
        { file: '124.gif', code: '/::g', title: '饿',reg:/\/::g/g },
        { file: '125.gif', code: '/:|-)', title: '累' ,reg:/\/:\|-\)/g},
        { file: '126.gif', code: '/::!', title: '吓',reg:/\/::!/g },
        { file: '127.gif', code: '/::L', title: '汗',reg:/\/::L/g },
        { file: '128.gif', code: '/::>', title: '高兴',reg:/\/::>/g },
        { file: '129.gif', code: '/::,@', title: '闲',reg:/\/::,@/g },
        { file: '130.gif', code: '/:,@f', title: '努力',reg:/\/:,@f/g },
        { file: '131.gif', code: '/::-S', title: '骂',reg:/\/::-S/g },
        { file: '133.gif', code: '/:,@x', title: '秘密',reg:/\/:,@x/g },
        { file: '134.gif', code: '/:,@@', title: '乱',reg:/\/:,@@/g },
        { file: '135.gif', code: '/::8', title: '疯',reg:/\/::8/g },
        { file: '136.gif', code: '/:,@!', title: '哀',reg:/\/:,@!/g },
        { file: '137.gif', code: '/:!!!', title: '鬼',reg:/\/:!!!/g },
        { file: '138.gif', code: '/:xx', title: '打击',reg:/\/:xx/g },
        { file: '139.gif', code: '/:bye', title: 'bye',reg:/\/:bye/g },
        { file: '142.gif', code: '/:handclap', title: '鼓掌',reg:/\/:handclap/g },
        { file: '145.gif', code: '/:<@', title: '什么',reg:/\/:<@/g },
        { file: '147.gif', code: '/::-O', title: '累',reg:/\/::-O/g },
        { file: '153.gif', code: '/:@x', title: '吓',reg:/\/:@x/g },
        { file: '155.gif', code: '/:pd', title: '刀',reg:/\/:pd/g },
        { file: '156.gif', code: '/:<W>', title: '水果',reg:/\/:<W>/g },
        { file: '157.gif', code: '/:beer', title: '酒',reg:/\/:beer/g },
        { file: '158.gif', code: '/:basketb', title: '篮球',reg:/\/:basketb/g },
        { file: '159.gif', code: '/:oo', title: '乒乓',reg:/\/:oo/g },
        { file: '195.gif', code: '/:circle', title: '跳舞',reg:/\/:circle/g },
        { file: '160.gif', code: '/:coffee', title: '咖啡',reg:/\/:coffee/g }
     ],
    // 得知当前选择的是哪个对话
    selectId: 1,
    //选择的会话target
    selectTarget: '',
    // 得知当前选择的是哪个好友
    selectFriendId: 0,
    vueSocket: null,
    voipClient: null,
    //会话列表
    conversations: [],
    //消息列表
    messages: [],
    //搜索用户列表
    searchUsers: [],
    friendRequests: [],
    deviceId: '',
    userId: '',
    token: '',
    userInfos: new Map(),
    notify:'',
    firstLogin: false,
    //修改全屏模式
    changeFullScreenMode: false,
    appHeight: 638,
    visibilityState: 'hidden',
    //是否限制音视频对话框
    showChatBox: false,
    showAudioBox: false,
    showSearchFriendDialog: false
}

const mutations = {
    // 从localStorage 中获取数据
    initData (state) {
        state.userId = localStorage.getItem('vue-user-id');
        state.token = localStorage.getItem('vue-token');
        const vueSocket = new VueWebSocket(WS_PROTOCOL,WS_IP,WS_PORT, HEART_BEAT_INTERVAL, RECONNECT_INTERVAL,BINTRAY_TYPE,store);
        vueSocket.connect(true);
        state.vueSocket = vueSocket;
        //voip client
        state.voipClient = new VoipClient(store);
        let conversations = LocalStore.getConversations();
        if(conversations){
            state.conversations = conversations;
        }
        let messages = LocalStore.getMessages();
        if(messages){
            state.messages = messages;
        }
        state.selectTarget = LocalStore.getSelectTarget();
        state.notify = new Notify({
            effect: 'flash',
            interval: 500,
            onclick: () => {
                console.log('on click');
                state.notify.close();
            }
          });
    },
    // 获取搜索值
	search (state, value) {
       state.searchText = value
    },
    // 得知用户当前选择的是哪个对话。便于匹配对应的对话框
    selectSession (state, value) {
       state.selectId = value
    },
    selectConversation(state,value){
       state.selectTarget = value;
       //清除未读数
       var stateConversationInfo = state.conversations.find(stateConversationInfo => stateConversationInfo.conversationInfo.target === value);
       if(stateConversationInfo && stateConversationInfo.conversationInfo.unreadCount){
         stateConversationInfo.conversationInfo.unreadCount.unread = 0;
       }
    },

    clearUnreadStatus(state){
        var stateConversationInfo = state.conversations.find(stateConversationInfo => stateConversationInfo.conversationInfo.target === state.selectTarget);
        if(stateConversationInfo && stateConversationInfo.conversationInfo.unreadCount){
          stateConversationInfo.conversationInfo.unreadCount.unread = 0;
        }
    },
    // 得知用户当前选择的是哪个好友。
    selectFriend (state, value) {
       state.selectFriendId = value
       if(value === 0){
          state.vueSocket.getFriendRequest(0);
       }
    },

    //更新朋友列表
    updateFriendList(state,value){
        var first = state.friendlist[0];
        state.friendlist = [];
        state.friendlist.push(first);
        for(var i in value){
            if(value[i].wxid != state.userId){
                state.friendlist.push(value[i]);
            }    
        }
        //更新会话信息
        for(var stateConversationInfo of state.conversations){
            var friend = state.friendlist.find(friend => friend.wxid === stateConversationInfo.conversationInfo.target);
            if(friend){
                stateConversationInfo.name = friend.nickname;
                stateConversationInfo.img = friend.img;
            }
        }
    },

    updateUserInfos(state,userInfos){
        let userInfoMap = state.userInfos;
        if(!userInfoMap){
            userInfoMap = new Map();
        }
        for(let userInfo of userInfos){
            console.log("uid "+userInfo.uid+" portrait "+userInfo.portrait);
           if(userInfo.uid === state.userId){
               state.user.img = userInfo.portrait;
               state.user.name = userInfo.displayName;
           } 
           userInfoMap.set(userInfo.uid,userInfo);
        }
        state.userInfos = userInfoMap;
    },
    // 发送信息
    sendMessage (state, sendMessage){
        var message = Message.toMessage(state,sendMessage);
        var protoMessage = ProtoMessage.convertToProtoMessage(message);
        console.log("send protomessage "+JSON.stringify(protoMessage));
        
        if(MessageConfig.isDisplayableMessage(protoMessage)){
            var stateConversationInfo = state.conversations.find(stateConversationInfo => stateConversationInfo.conversationInfo.target === protoMessage.target);
            stateConversationInfo.conversationInfo.lastMessage = protoMessage;
            stateConversationInfo.conversationInfo.timestamp = protoMessage.timestamp;

            var stateChatMessage = state.messages.find(chatmessage => chatmessage.target === protoMessage.target);
            if(!stateChatMessage){
                stateChatMessage = new StateSelectChateMessage();
                stateChatMessage.target = protoMessage.target;
                var friend = state.friendlist.find(friend => friend.wxid === protoMessage.target);
                if(friend != null){
                 stateChatMessage.name =  friend.nickname;
                }
                stateChatMessage.protoMessages.push(protoMessage);
                state.messages.push(stateChatMessage);
            } else {
                stateChatMessage.protoMessages.push(protoMessage);
            }
            
        }

        //发送消息到对端
        state.vueSocket.sendMessage(protoMessage);
    },

    // 选择好友后，点击发送信息。判断在聊天列表中是否有该好友，有的话跳到该好友对话。没有的话
    // 添加该好友的对话 并置顶
    send (state) {
        let result = state.friendlist.find(friend => friend.id === state.selectFriendId)
        let stateConversationInfo = state.conversations.find(stateConversationInfo => stateConversationInfo.conversationInfo.target === result.wxid)
        if( !stateConversationInfo ){
            state.selectTarget  = result.wxid;
            var protoConversationInfo = new ProtoConversationInfo();
            protoConversationInfo.conversationType = ConversationType.Single;
            protoConversationInfo.target = result.wxid;
            protoConversationInfo.line = 0;
            protoConversationInfo.top = false;
            protoConversationInfo.slient = false;
            protoConversationInfo.timestamp = new Date().getTime();
            protoConversationInfo.unreadCount = new UnreadCount();
            protoConversationInfo.lastMessage = null;

            var newStateConversationInfo = new StateConversationInfo();
            newStateConversationInfo.name = result.remark;
            newStateConversationInfo.img = result.img;
            newStateConversationInfo.conversationInfo = protoConversationInfo;
            state.conversations.unshift(newStateConversationInfo);
        } else {
            state.selectTarget = stateConversationInfo.conversationInfo.target
            
        }
        router.push({ path: '/conversation'})
    },

    //更新会话列表
    updateConversationInfo(state,protoConversationInfo){
        var update = false;
        var updateStateConverstaionInfo;
        var currentConversationInfoIndex;
        for(var index in state.conversations){
            var stateConverstaionInfo = state.conversations[index];
            if(stateConverstaionInfo.conversationInfo.conversationType == protoConversationInfo.conversationType 
                && stateConverstaionInfo.conversationInfo.target == protoConversationInfo.target){
                update = true;
                currentConversationInfoIndex = index;
                stateConverstaionInfo.conversationInfo.lastMessage = protoConversationInfo.lastMessage;
                stateConverstaionInfo.conversationInfo.timestamp = protoConversationInfo.lastMessage.timestamp;
                updateStateConverstaionInfo = stateConverstaionInfo;
                break;
            }
        }
        //新消息会话置顶
        if(update){
            state.conversations.splice(currentConversationInfoIndex,1);
            state.conversations.unshift(updateStateConverstaionInfo);
        }
        if(!update){
           updateStateConverstaionInfo = new StateConversationInfo();
           updateStateConverstaionInfo.conversationInfo = protoConversationInfo;

            //单聊会话
           if(protoConversationInfo.conversationType == ConversationType.Single){
                var friend = state.friendlist.find(friend => friend.wxid === protoConversationInfo.target);
                if(friend != null){
                    var name = friend.nickname;
                    var img = friend.img == null ? 'static/images/vue.jpg': friend.img;
                    updateStateConverstaionInfo.name = name;
                    updateStateConverstaionInfo.img = img;
                }
            } else {
                //群聊会话
                updateStateConverstaionInfo.name = protoConversationInfo.target;
                if(!updateStateConverstaionInfo.img){
                    state.vueSocket.getGroupInfo(protoConversationInfo.target,false);
                }
                updateStateConverstaionInfo.img = 'static/images/vue.jpg';
            }
            state.conversations.push(updateStateConverstaionInfo);
        }

        // 消息是否属于当前会话
        var isCurrentConversationMessage = (state.selectTarget === protoConversationInfo.target);
        var visibilityStateVisible = (state.visibilityState === 'visible');
        //只显示接收消息，同一用户不同session，不再通知
        var isShowSendingMessage = protoConversationInfo.lastMessage.direction === 1;
        //更新会话消息未读数
        if(!state.firstLogin && (!isCurrentConversationMessage || (isCurrentConversationMessage && !visibilityStateVisible)) && isShowSendingMessage){
           //统计消息未读数,注意服务端暂时还没有将透传消息发送过来，原则上这里过来的消息都不是透传消息
           var num = updateStateConverstaionInfo.conversationInfo.unreadCount.unread += 1;
           var notifyBody = protoConversationInfo.lastMessage.content.searchableContent;
           console.log("target "+protoConversationInfo.target+" unread count "+num+ " notify body "+notifyBody);
           if(!notifyBody){
              notifyBody = ProtoMessageContent.typeToContent(protoConversationInfo.lastMessage.content);
           }
           //notify 弹框
           if(!state.firstLogin){
                state.notify.notify({
                    title: updateStateConverstaionInfo.name, // Set notification title
                    body: notifyBody, // Set message content
                    icon: updateStateConverstaionInfo.img
                });
            }
        }


       
    },

    /**
     * 更新会话简介，主要更新会话的名称与图像
     */
    updateConversationIntro(state,groupInfos){
        for(var groupInfo of groupInfos){
           var stateConverstaionInfo = state.conversations.find(stateConverstaionInfo => stateConverstaionInfo.name === groupInfo.target);
           if(stateConverstaionInfo){
            console.log("update conversation name "+stateConverstaionInfo.name);
               stateConverstaionInfo.name = groupInfo.name;
               if(groupInfo.portrait){
                   stateConverstaionInfo.img = groupInfo.portrait;
               }
           }
           //更新会话标题

           var stateChatMessage = state.messages.find(stateChatMessage => stateChatMessage.target === groupInfo.target);
           if(stateChatMessage){
               stateChatMessage.name = groupInfo.name;
           }
        }
    },

    addProtoMessage(state,protoMessage){
       var added = false;
       var isExistMessage = false;
       for(var stateChatMessage of state.messages){
           if(protoMessage.target == stateChatMessage.target){
               added = true;
               var isSameProtoMessage = stateChatMessage.protoMessages.find(message => message.messageId === protoMessage.messageId);
               if(!isSameProtoMessage){
                stateChatMessage.protoMessages.push(protoMessage);
               } else {
                   isExistMessage = true;
               }
           }
       }
       if(!added){
          var stateChatMessage = new StateChatMessage();
          var friend = state.friendlist.find(friend => friend.wxid === protoMessage.target);
          if(friend != null){
             stateChatMessage.name =  friend.nickname;
          }
          stateChatMessage.target = protoMessage.target;
          stateChatMessage.protoMessages.push(protoMessage);
          state.messages.push(stateChatMessage);
       }
       console.log("current message "+protoMessage.messageId +" isExist "+isExistMessage);
       if(!isExistMessage){
           var protoConversationInfo = new ProtoConversationInfo();
           protoConversationInfo.conversationType = protoMessage.conversationType;
           protoConversationInfo.target = protoMessage.target;
           protoConversationInfo.line = 0;
           protoConversationInfo.top = false;
           protoConversationInfo.slient = false;
           protoConversationInfo.timestamp = protoMessage.timestamp;
           protoConversationInfo.lastMessage = protoMessage;
           protoConversationInfo.unreadCount = new UnreadCount();

           this.commit('updateConversationInfo',protoConversationInfo);
       }
       
    },

    loginOut(state,message){
        state.userId = '';
        state.token = '';
        localStorage.setItem(KEY_VUE_USER_ID,'');
        localStorage.setItem(KEY_VUE_TOKEN,'');
        state.selectTarget = '',
        state.vueSocket.sendDisConnectMessage();
        state.vueSocket = null;
        state.voipClient = null;
        state.conversations = [],
        state.messages = [],
        LocalStore.clearLocalStore();
        ChatManager.removeOnReceiveMessageListener();
        //发送断开消息，清除session，防止同一个设备切换登录导致的验证失败
        router.push({path: '/login'})
    },

    changetFirstLogin(state,value){
        console.log("first login "+value);
        state.firstLogin = value;
    },

    getUploadToken(state,value){
       state.vueSocket.getUploadToken(value);
    },

    visibilityChange(state,value){
       state.visibilityState = value;
    },

    searchUser(state,value){
       state.vueSocket.searchUser(value);
    },

    updateSearchUser(state,value){
        state.searchUsers = [];
        for(var searchUser of value){
            var friend = state.friendlist.find(friend => friend.wxid === searchUser.uid);
            if(!friend && searchUser.uid !== state.userId){
               state.searchUsers.push(searchUser);
            }
       }
    },

    sendFriendAddRequest(state,value){
       state.vueSocket.sendFriendAddRequest(value);
    },

    updateFriendRequest(state,value){
       state.friendRequests = value;
    },

    handleFriendRequest(state,value){
        var friendRequest = state.friendRequests.find(friendRequest => friendRequest.target === value.targetUid);
        friendRequest.status = 1;
       state.vueSocket.handleFriendRequest(value);
    }

}
const getters = {
    //筛选会话列表
    searchedConversationList(){
       return state.conversations.filter(conversationInfo => conversationInfo.name ? conversationInfo.name.includes(state.searchText): false);
    },
    //当前会话是否为单聊会话
    isSingleConversation(){
       let stateConversation = state.conversations.find(stateConversation => stateConversation.conversationInfo.target === state.selectTarget);
       if(!stateConversation){
          return false;
       }
       return stateConversation.conversationInfo.conversationType === ConversationType.Single; 
    },
    // 筛选出含有搜索值的好友列表
    searchedFriendlist (state) {
       let friends = state.friendlist.filter(friends => friends.remark.includes(state.searchText));
       return friends
    },
    // 通过当前选择是哪个对话匹配相应的对话
    selectedChat (state) {
       let chatMessage = state.messages.find(chatMessage => chatMessage.target === state.selectTarget);
       if(chatMessage == null){
          chatMessage = {
              name: '',
              target: '',
              protoMessages: []
          }
       }
       console.log("selectedChat "+chatMessage.name+" target "+chatMessage.target);
       return chatMessage
    },
    // 通过当前选择是哪个好友匹配相应的好友
    selectedFriend (state) {
       let friend = state.friendlist.find(friend => friend.id === state.selectFriendId);
       return friend
    },
    messages (state) {
        let chatMessage = state.messages.find(chatMessage => chatMessage.target === state.selectTarget);
        if(chatMessage == null){
            return [];
        }
        return chatMessage.protoMessages;
    },
    userInfos(){
        return state.userInfos;
    },
    unreadTotalCount(state){
        var total = 0;
        if(state.conversations){
            for(var stateConversationInfo of state.conversations){
                if(stateConversationInfo.conversationInfo.unreadCount){
                    total += stateConversationInfo.conversationInfo.unreadCount.unread;
                }
            }
        }
        if(total === 0){
            state.notify.faviconClear();
            state.notify.setTitle();
            state.notify.close();
        } else {
            state.notify.setFavicon(total)
            state.notify.setTitle('你有新的消息未读');
        }
        return total;
    },
}

const actions = {
	search: ({ commit }, value) => {
        setTimeout(() => {
                commit('search', value)
        }, 100)
    },
    selectSession: ({ commit }, value) => commit('selectSession', value),
    selectConversation: ({ commit }, value) => commit('selectConversation', value),
    clearUnreadStatus: ({ commit }, value) => commit('clearUnreadStatus', value),
    selectFriend: ({ commit }, value) => commit('selectFriend', value),
    updateFriendList: ({ commit }, value) => commit('updateFriendList', value),
    updateUserInfos: ({ commit }, value) => commit('updateUserInfos', value),
    sendMessage: ({ commit }, msg) => commit('sendMessage', msg),
    send: ({ commit }) => commit('send'),
    initData: ({ commit }) => commit('initData'),
    updateConversationInfo: ({ commit }, value) => commit('updateConversationInfo', value),
    updateConversationIntro: ({ commit }, value) => commit('updateConversationIntro', value),
    addProtoMessage: ({ commit }, value) => commit('addProtoMessage', value),
    loginOut: ({ commit }, value) => commit('loginOut', value),
    changetFirstLogin: ({ commit }, value) => commit('changetFirstLogin', value),
    getUploadToken: ({ commit }, value) => commit('getUploadToken', value),
    visibilityChange: ({ commit }, value) => commit('visibilityChange', value),
    searchUser: ({ commit }, value) => commit('searchUser', value),
    updateSearchUser: ({ commit }, value) => commit('updateSearchUser', value),
    sendFriendAddRequest: ({ commit }, value) => commit('sendFriendAddRequest', value),
    updateFriendRequest: ({ commit }, value) => commit('updateFriendRequest', value),
    handleFriendRequest: ({ commit }, value) => commit('handleFriendRequest', value),
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

store.watch(
    state => state.conversations,
    value => {
        LocalStore.saveConverSations(value);
    },
    {
        deep : true
    }
)

store.watch(
    state => state.messages,
    value => {
        LocalStore.saveMessages(value);
    },
    {
        deep : true
    }
)

store.watch(
    state => state.selectTarget,
    value => {
        LocalStore.setSelectTarget(value);
    },
    {
        deep : true
    }
)

export default store;
