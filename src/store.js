import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import VueWebSocket from './websocket';
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE, KEY_VUE_USER_ID, KEY_VUE_TOKEN} from './constant/index'
import StateConversationInfo from './websocket/model/stateConversationInfo';
import StateChatMessage from './websocket/model/stateSelectChatMessage'
import Message from './websocket/message/message';
import ProtoMessage from './websocket/message/protomessage';
import ConversationType from './websocket/model/conversationType';
import GroupInfo from './websocket/model/groupInfo';
import LocalStore from './websocket/store/localstore';

Vue.use(Vuex)

//获取当前时间
const now = new Date();
const state = {
	// 输入的搜索值
	searchText: '',
	// 当前登录用户
    user: {
    	name: 'ratel',
    	img: 'static/images/UserAvatar.jpg'
    },
    // 对话好友列表
    chatlist: [
        {
        	id: 1, 
        	user: {
        		name: '妈咪',
        		img: 'static/images/mother.jpg'
        	},
        	messages: [
                {
                	content: '么么哒，妈咪爱你',  //聊天内容
                	date: now  //时间
                },
                {
                	content: '按回车可以发送信息，还可以给我发送表情哟',
                	date: now
                }
        	],
            index: 1  // 当前在聊天列表中的位置,从1开始

        },
        {
        	id: 2,
        	user: {
        		name: 'father',
        		img: 'static/images/father.jpg'
        	},
        	messages: [
                {
                	content: 'Are you kidding me?',
                	date: now
                }
        	],
            index: 2
        },
        {
            id: 3,
            user: {
                name: '机器人',
                img: 'static/images/vue.jpg'
            },
            messages: [
                {
                    content: '我会跟你聊聊天的哟',
                    date: now
                }
            ],
            index: 3
        }
    ],
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
    selectTarget: 'new',
    // 得知当前选择的是哪个好友
    selectFriendId: 0,
    vueSocket: null,
    //会话列表
    conversations: [],
    //消息列表
    messages: [],
    deviceId: '',
    userId: '',
    token: '',
    userInfos: new Map()
}

const mutations = {
    // 从localStorage 中获取数据
    initData (state) {
        state.userId = localStorage.getItem('vue-user-id');
        state.token = localStorage.getItem('vue-token');
        const vueSocket = new VueWebSocket(WS_PROTOCOL,WS_IP,WS_PORT, HEART_BEAT_INTERVAL, RECONNECT_INTERVAL,BINTRAY_TYPE,store);
        vueSocket.connect(true);
        state.vueSocket = vueSocket;
        let data = localStorage.getItem('vue-chat');
        if (data) {
            state.chatlist = JSON.parse(data);
        }
        let conversations = LocalStore.getConversations();
        if(conversations){
            state.conversations = conversations;
        }
        let messages = LocalStore.getMessages();
        if(messages){
            state.messages = messages;
        }
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
    },
    // 得知用户当前选择的是哪个好友。
    selectFriend (state, value) {
       state.selectFriendId = value
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
    sendMessage (state, messageContent){
        var message = Message.toMessage(state,messageContent);
        var protoMessage = ProtoMessage.convertToProtoMessage(message);
        console.log("send protomessage "+JSON.stringify(protoMessage));
        var stateConversationInfo = state.conversations.find(stateConversationInfo => stateConversationInfo.conversationInfo.target === protoMessage.target);
        stateConversationInfo.conversationInfo.lastMessage = protoMessage;
        stateConversationInfo.conversationInfo.timestamp = protoMessage.timestamp;

        var stateChatMessage = state.messages.find(chatmessage => chatmessage.target === protoMessage.target);
        stateChatMessage.protoMessages.push(protoMessage);

        //发送消息到对端
        state.vueSocket.sendMessage(protoMessage);
    },

    // 选择好友后，点击发送信息。判断在聊天列表中是否有该好友，有的话跳到该好友对话。没有的话
    // 添加该好友的对话 并置顶
    send (state) {
        let result = state.friendlist.find(friend => friend.id === state.selectFriendId)
        let msg = state.chatlist.find(msg => msg.user.name === result.remark)
        if( !msg ){
           state.selectId = 1
            for(let i = 0; i < state.chatlist.length; i++ ){
                state.chatlist[i].id++;
                state.chatlist[i].index++;
            }
            state.chatlist.unshift({
                id: 1,
                user: {
                    name: result.remark,
                    img:  result.img
                },
                messages: [
                    {
                        content: '已经置顶聊天，可以给我发信息啦！',
                        date: new Date()
                    }
                ],
                index: 1
            })
        }else {
            state.selectId = msg.index
            router.push({ path: '/chat'})
        }
    },

    //更新会话列表
    updateConversationInfo(state,protoConversationInfo){
        var update = false;
        for(var stateConverstaionInfo of state.conversations){
            if(stateConverstaionInfo.conversationInfo.conversationType == protoConversationInfo.conversationType 
                && stateConverstaionInfo.conversationInfo.target == protoConversationInfo.target){
                update = true;
                stateConverstaionInfo.conversationInfo.lastMessage = protoConversationInfo.lastMessage;
                stateConverstaionInfo.conversationInfo.timestamp = protoConversationInfo.lastMessage.timestamp;
            }
        }
        if(!update){
           var stateConverstaionInfo = new StateConversationInfo();
           stateConverstaionInfo.conversationInfo = protoConversationInfo;
           //单聊会话
           if(protoConversationInfo.conversationType == ConversationType.Single){
            var friend = state.friendlist.find(friend => friend.wxid === protoConversationInfo.target);
            if(friend != null){
             var name = friend.nickname;
             var img = friend.img == null ? 'static/images/vue.jpg': friend.img;
             stateConverstaionInfo.name = name;
             stateConverstaionInfo.img = img;
             state.conversations.push(stateConverstaionInfo);
            }
           } else {
            //群聊会话
              stateConverstaionInfo.name = protoConversationInfo.target;
              if(!stateConverstaionInfo.img){
                state.vueSocket.getGroupInfo(protoConversationInfo.target,false);
              }
              stateConverstaionInfo.img = 'static/images/vue.jpg';
              state.conversations.push(stateConverstaionInfo);
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
       for(var stateChatMessage of state.messages){
           if(protoMessage.target == stateChatMessage.target){
               added = true;
               stateChatMessage.protoMessages.push(protoMessage);
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
       
    },

    loginOut(state,message){
        state.userId = '';
        state.token = '';
        localStorage.setItem(KEY_VUE_USER_ID,'');
        localStorage.setItem(KEY_VUE_TOKEN,'');
        state.selectTarget = 'new',
        state.vueSocket.sendDisConnectMessage();
        state.vueSocket = null;
        state.conversations = [],
        state.messages = [],
        LocalStore.clearLocalStore();
        //发送断开消息，清除session，防止同一个设备切换登录导致的验证失败
        router.push({path: '/login'})
    }

}
const getters = {
    //筛选会话列表
    searchedConversationList(){
       return state.conversations;
    },
    // 筛选出含有搜索值的聊天列表
    searchedChatlist (state) {
       let sessions = state.chatlist.filter(sessions => sessions.user.name.includes(state.searchText));
       return sessions
    },
    // 筛选出含有搜索值的好友列表
    searchedFriendlist (state) {
       let friends = state.friendlist.filter(friends => friends.remark.includes(state.searchText));
       return friends
    },
    //获取用户头像
    selectImageByTarget(state){

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
    }
}

const actions = {
	search: ({ commit }, value) => {
        setTimeout(() => {
                commit('search', value)
        }, 100)
    },
    selectSession: ({ commit }, value) => commit('selectSession', value),
    selectConversation: ({ commit }, value) => commit('selectConversation', value),
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
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

// 监听聊天列表的值， 发生变化就保存在localStorage中
store.watch(
    (state) => state.chatlist,
    (val) => {
        localStorage.setItem('vue-chat', JSON.stringify(val));
    },
    {
        deep: true
    }
)

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

export default store;
