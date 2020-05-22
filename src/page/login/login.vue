<template>
  <!--  账号输入登录-->
  <div class="login_box">
    <router-link to="#">
      <div class="login_close"></div>
    </router-link>
    <div class="login_panel">
      <div class="login_title">
        <img src="../../assets/img/logo.png" alt="">
        <p>输入账号进行安全登录</p>
      </div>
      <label style="margin-top: 50px">手机号码：</label>
      <input v-model="mobile" type="tel" pattern="^\d{11}$" title="请输入账号">
      <label>验证码：</label>
      <div class="pass-form">
        <input class="pass-input" v-model="code" type="num" title="请输入密码" @keydown.enter="loginEnter">
        <el-button class="send-verify-code" type="primary" :disabled="sendVerifyBtnDisabled" @click="sendVerifyCode">{{sendVerifyBtnText}}</el-button>
      </div>
      <input class="bt" @click="login" type="submit" value="登录">
    </div>
  </div>
</template>

<script>
import { LOGIN_API, KEY_VUE_DEVICE_ID, KEY_VUE_USER_ID, KEY_VUE_TOKEN, SNED_VERIFY_CODE_API } from '../../constant'
import { mapGetters } from 'vuex'
import UUID from 'uuid-js'
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      mobile: '',
      code: '',
      countDownTimer: null,
      sendVerifyBtnText: '发送验证码',
      sendVerifyBtnDisabled: false,
      loginAPI: LOGIN_API, // 通过用户ID登录接口
    }
  },
  destroyed() {
      if(this.countDownTimer){
          clearInterval(this.countDownTimer);
      }
  },
  methods: {
    login () {
      //初始唯一id
        let vueDeviceId = localStorage.getItem(KEY_VUE_DEVICE_ID);
        if(vueDeviceId == null){
           vueDeviceId = UUID.create().toString();
           console.log('generate device id '+vueDeviceId);
           localStorage.setItem(KEY_VUE_DEVICE_ID,vueDeviceId);
        }
        console.log('vue deviceId '+vueDeviceId);
        if(!(/^1[3|4|5|7|8|9]\d{9}$/.test(this.mobile))){
           this.$message.error('请输入正确的手机号');
           return; 
        }
        axios({
            method: 'post',
            url: LOGIN_API,
            data: JSON.stringify({
              mobile: this.mobile,
              code: this.code,
              clientId: vueDeviceId,
            }),
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            console.log('login code '+response.data.code+" message "+response.data.message)
              if(response.data.code == 0){
                  var userId = response.data.result.userId;
                  var token = response.data.result.token;
                  console.log('userId '+userId+" token "+token);
                  this.$store.state.userId = userId;
                  this.$store.state.token = token;
                  localStorage.setItem(KEY_VUE_USER_ID,userId);
                  localStorage.setItem(KEY_VUE_TOKEN,token);
                  //跳转到聊天页面
                  this.$router.push({path: '/conversation'})
              } else {
                this.$message.error(response.data.message);
              }
          }).catch((error) => {
            console.log(error)
          })
    },
    loginEnter(e){
        if(e.keyCode === 13 && this.mobile != '' && this.code != ''){
            this.login();
        }
    },
    sendVerifyCode(){
        if(!(/^1[3|4|5|7|8|9]\d{9}$/.test(this.mobile))){
           this.$message.error('请输入正确的手机号');
           return; 
        }
        axios({
          method: 'post',
          url: SNED_VERIFY_CODE_API,
          data: JSON.stringify({
            mobile: this.mobile
          }),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(response => {
          console.log('send code '+response.data.code+" message "+response.data.message)
          if(response.data.code == 0){
            var _this = this;
            this.sendVerifyBtnDisabled = true; 
            var countDown = 60;
            this.countDownTimer = setInterval(() => {
              _this.sendVerifyBtnText = --countDown +"S";
              // console.log("countdown "+countDown);
              if(countDown == 0){
                 clearInterval(_this.countDownTimer);
                 _this.sendVerifyBtnDisabled = false;
                 _this.sendVerifyBtnText = "发送验证码";
              }
            }, (1000));
          } else {
            this.$message.error(response.data.message);
          }
        }).catch(error => {
          console.log(error)
        })
        
    }
  },
}
</script>

<style scoped>
  /*登录框*/
  .login_box {
    z-index: 99;
    position: absolute;
    width: 380px;
    height: 540px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
    margin-top: -270px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 10px #999;
  }
  .login_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 64px;
    height: 64px;
    background: url(../../assets/img/qrcode.png) no-repeat right top;
    background-size: 100% 100%;
    border-top-right-radius: 5px;
    cursor: pointer;
    z-index: 99;
  }
  /*登录*/
  .login_panel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 270px;
    height: 540px;
    padding: 0 0px;
    transform: translate(-50%, -50%);
    /* background: #fff; */
    border-radius: 6px;
    overflow: hidden;
  }
  .login_panel .login_title {
    text-align: center;
  }
  .login_panel .login_title img {
    margin-top: 60px;
    height: 80px;
    width: 80px;
    border-radius: 50%;
    padding: 10px;
  }
  .login_panel .login_title p {
    margin-top: 15px;
    color: #999999;
    font-size: 15px;
  }
  .login_panel label {
    display: block;
    font-size: 12px;
    line-height: 18px;
    color: #a9a8a5;
    margin-top: 10px;
  }
  .login_panel input {
    display: inline;
    height: 42px;
    padding: 0 5%;
    line-height: 42px;
    font-size: 14px;
    color: #333333;
    border-radius: 4px;
    outline: 0;
    border: 0;
    width: 100%;
    background: #d7e8fc;
  }
  /* 按钮 */
  .login_panel .bt {
    margin-top: 35px;
    width: 100%;
    color: #ffffff;
    background: #379df6;
    cursor: pointer;
  }
  .login_panel .bt:hover {
    background-color: #2f86f6;
  }

  .pass-form {
    /* position: relative; */
  }
  .pass-form .pass-input {
    display: block;
    float: left;
    margin-right: 5px;
    width: 162px;
  }
  .pass-form .send-verify-code {
    display: block;
    float: left;
    width: 103px;
    height: 42px;
  }
</style>