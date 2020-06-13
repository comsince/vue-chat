<template>
    <div class="personal-card" id="personal-card">
        <div class="profile_mini">
            <div class="profile_mini_hd">
                <div class="avatar">
                    <el-tooltip class="item" effect="dark" content="点击更换头像" placement="top">
                        <div>
                            <a href="javascript:void(0)" id="add" @click="openfile">
                                <img class="img" :src="user.img" alt="点击更换头像">
                            </a>
                            <input type="file" accept="image/*" style="display:none" ref="changeAvatar" @change="changeAvatar"/>
                        </div>
                    </el-tooltip>
                </div>
            </div>
            <div class="profile_mini_bd">
                <div class="nickname_area">
                    <a class="opt">
                       <i class="web_wechat_tab_launch-chat"></i>
                    </a>
                    <el-tooltip class="item" effect="dark" content="点击修改昵称，最长10个字符" placement="top-start">
                        <div class="nickname_item">
                            <p class="nickname" contenteditable="true" @keydown.enter="modifyNickName" @blur="modifyNickNameBlur">{{displayName}}</p>
                            <i  class="web_wechat_men" v-show="false"></i>
                        </div>
                    </el-tooltip>
                </div>
                <div class="meta_area">
                    <div class="meta_item">
                        <label class="label" for="">备注：</label>
                        <p class="value" contenteditable="true" @keydown.enter="modifyExtra">{{extra}}</p>
                    </div>
                    <div class="meta_item">
                        <label class="label">手机号：</label>
                        <p class="value">{{mobile}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Logger from '../../websocket/utils/logger';
import MyInfoType from '../../websocket/message/myInfoType'
import MessageContentMediaType from '../../websocket/message/messageContentMediaType';
import LocalStore from '../../websocket/store/localstore';
import * as qiniu from 'qiniu-js'
import { mapGetters, mapState } from 'vuex'
import { UPLOAD_BY_QINIU,SUCCESS_CODE } from '../../constant';
import webSocketCli from '../../websocket/websocketcli'
export default {
    name: 'persionCard',
    props: ['userId'],
    data() {
        return {
            extra: '备注无',
            address: '',
        }
    },
    methods: {
       modifyNickName(e){
           if(e.keyCode ==13){
              this.modifyNickNameBlur(e);
              e.preventDefault();
           }
       },
       modifyNickNameBlur(e){
             Logger.log("modify displayName "+e.target.innerText);
              var inputName = e.target.innerText;
              this.displayName = inputName;
              if(inputName.length < 10){
                 this.$store.dispatch("modifyMyInfo",{
                     type: MyInfoType.Modify_DisplayName,
                     value: inputName
                 });
              }
       },
       modifyExtra(e){
           if(e.keyCode ==13){
              e.preventDefault();
           }
       },
       openfile(){
           this.$refs.changeAvatar.click();
       },
       changeAvatar(e){
           var _this = this;
           var store = this.$store;
           if(UPLOAD_BY_QINIU){
                store.dispatch('getUploadToken', MessageContentMediaType.Image);
                console.log("changeAvatar "+e.target.value);
                var file = e.target.files[0];
                var key = MessageContentMediaType.Image +"-"+LocalStore.getUserId()+"-"+new Date().getTime()+"-"+file.name;
                setTimeout(()=> {
                        var token = LocalStore.getImageUploadToken();
                        console.log("upload avatar key "+key+" token "+token);
                        if(token){
                            var observable = qiniu.upload(file, key, token, null, null);
                            var observer = {
                                    next(res){
                                        console.log('uploading '+res.total.percent);
                                    },
                                    error(err){
                                        console.log("upload error "+err.code +" message "+err.message);
                                    }, 
                                    complete(res){
                                        console.log("upload complete "+res);
                                        var localPath = e.target.value;
                                        var remotePath = "http://image.comsince.cn/"+key;
                                        _this.$store.state.user.img = remotePath;
                                        store.dispatch("modifyMyInfo",{
                                            type: MyInfoType.Modify_Portrait,
                                            value: remotePath
                                        });
                                    }
                                }
                            observable.subscribe(observer);
                        }
                        
                },200);
           } else {
               var file = e.target.files[0];
               var key = MessageContentMediaType.Image +"-"+LocalStore.getUserId()+"-"+new Date().getTime()+"-"+file.name;
               webSocketCli.getMinioUploadUrl(MessageContentMediaType.Image,key).then(data => {
                    if(data.code == SUCCESS_CODE){
                        console.log("domain "+data.result.domain+" url "+data.result.url)
                        fetch(data.result.url, {
                            method: 'PUT',
                            body: file
                            }).then(() => {
                                var remotePath = data.result.domain+"/"+key;
                                _this.$store.state.user.img = remotePath;
                                    store.dispatch("modifyMyInfo",{
                                            type: MyInfoType.Modify_Portrait,
                                            value: remotePath
                                });
                            }).catch((e) => {
                                console.error(e);
                            });
                    }
                }) 
           }
           
           this.$refs.changeAvatar.value = null;
       }
    },
    computed: {
        ...mapState([   
            'user',
            'userInfoList'
        ]),
        personImg: {
            get() {
                var userInfo = this.userInfoList.find(user => user.uid == this.userId);
                var portrait = '';
                if(userInfo){
                    portrait = userInfo.portrait;
                } 
                if(portrait === ''){
                    portrait = 'static/images/vue.jpg';
                }
                return portrait;
            },
            set(value) {
                var userInfo = this.userInfoList.find(user => user.uid == this.userId);
                if(userInfo){
                    userInfo.portrait = value;
                }
            }

        },
        displayName: {
           get() {
                var userInfo = this.userInfoList.find(user => user.uid == this.userId);
                var displayName = '';
                if(userInfo){
                    displayName = userInfo.displayName == '' ? userInfo.mobile : userInfo.displayName;
                } 
                return displayName;
           },
           set(value) {
                var userInfo = this.userInfoList.find(user => user.uid == this.userId);
                if(userInfo){
                    userInfo.displayName = value;
                }
           } 
        },
        mobile() {
            var userInfo = this.userInfoList.find(user => user.uid == this.userId);
            if(userInfo){
                 return userInfo.mobile;
            }else {
                return '';
            }
        }
    }
}
</script>


<style scoped>
.personal-card {
	position: absolute;
	background: #fff;
	width: 250px;
	top: 20px;
	left: 60px;
	z-index: 20;
	box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
	border-radius: 4px
}

.profile_mini_hd .avatar .img {
    width: 250px;
    height: 220px;
    display: block;
    border-top-left-radius:4px;
    border-top-right-radius:4px;
    cursor: pointer;
}

.profile_mini_bd {
    padding: 20px;
    min-height: 74px;
}

.profile_mini_bd .nickname_item {
    overflow: hidden;
}

.profile_mini_bd .nickname_area {
    margin-bottom: 8px;
    line-height: 1.6;
}

.profile_mini_bd .opt {
    float: right;
}

.web_wechat_tab_launch-chat {
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 22px;
    background: url(https://res.wx.qq.com/a/wx_fed/webwx/res/static/css/5af37c4a880a95586cd41c5b251d5562@1x.png) no-repeat;
    background-position: -223px -432px;
    -webkit-background-size: 487px 462px;
    background-size: 487px 462px;
}

.profile_mini_bd .nickname {
    font-weight: 400;
    font-size: 18px;
    vertical-align: middle;
    width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    line-height: 1.6;
    margin-left: 5px;
}

.web_wechat_men {
    display: inline-block;
    vertical-align: middle;
}

.web_wechat_men {
    width: 16px;
    height: 16px;
    background: url(https://res.wx.qq.com/a/wx_fed/webwx/res/static/css/5af37c4a880a95586cd41c5b251d5562@1x.png) no-repeat;
    background-position: -384px -304px;
    -webkit-background-size: 487px 462px;
    background-size: 487px 462px;
}

.profile_mini_bd .meta_area {
    line-height: 1.6;
    margin-left: 5px;
}

.profile_mini_bd .meta_item {
    overflow: hidden;
}

.profile_mini_bd .meta_item .label {
    float: left;
    font-size: 12px;
    color: #888;
    margin-right: 10px;
}

.profile_mini_bd .meta_item .value {
    font-size: 12px;
    color: #888;
    width: 105px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    padding-left: 5px;
    padding-right: 5px;
}
</style>