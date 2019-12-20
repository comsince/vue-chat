<!-- 文本输入框 -->
<template>
<div class="text">
    <div class="emoji">
          <i class="icon iconfont icon-look" @click="showEmoji=!showEmoji"></i>
          <transition name="showbox">
             <div class="emojiBox" v-show="showEmoji">
                 <li v-for="(item, index) in emojis">
                    <img :src="'static/emoji/'+item.file" :data="item.code" @click="content +=item.code">
                 </li>
             </div>
          </transition>
    </div>
    <textarea ref="text" v-model="content" @keyup="onKeyup" @click="showEmoji=false"></textarea>
    <div class="send" @click="send">
    	<span>发送(ent)</span>
    </div>
    <transition name="appear">
	    <div class="warn" v-show="warn">
	    	<div class="description">不能发送空白信息</div>
	    </div>
	</transition>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data () {
        return {
            content: '',
            reply: '未找到',  
            frequency: 0,
            warn: false,
            showEmoji: false,
        };
    },
    computed: {
        ...mapState([   
            'selectId',
            'emojis'
        ]),
        ...mapGetters([
            'selectedChat',
        ])
    },
    methods: {
        // 按回车发送信息
        onKeyup (e) {
            if ( e.keyCode === 13 ) {
               this.send()
            }
        },
        // 点击发送按钮发送信息
        send () {
            if(this.content.length <= 1){
                this.warn = true
                this.content = ''
                setTimeout(() => {
                    this.warn = false;
                  }, 1000)
               }else{
                    if(this.selectedChat.user.name === '机器人'){
                        this.$http.get(`https://zhaoplus.com/api/AI?search=${this.content}`).then(res => {
                            this.reply = res.data.result.text
                            if(this.content.includes('/:')){
                                this.reply = '嘻嘻'
                            }
                            var msg = {
                                content: this.content,
                                reply: this.reply
                            }
                            this.$store.dispatch('sendMessage', msg)
                            this.content = ''
                       })
                    }else{
                        var msg = {
                            content: this.content,
                        }
                        this.$store.dispatch('sendMessage', msg)
                            this.content = ''
                    }
               }
        }
    },
    // 在进入的时候 聚焦输入框
    mounted() {
            this.$refs.text.focus()
    },
    watch: {
        // 在选择其它对话的时候 聚焦输入框
        selectId() {
          setTimeout(() => {
            this.$refs.text.focus()
          }, 0)
        },
        // 当输入框中的值为空时 弹出提示  并在一秒后消失
        content() {
            if(this.content === ''){
                if( this.frequency === 0){
                  this.warn = true;
                  this.frequency++
                  setTimeout(() => {
                    this.warn = false;
                  }, 1000)
                }
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.text
    position: relative
    height: 150px
    background: #fff
    .emoji
        position: relative
        width: 100%
        height: 40px
        line-height: 40px
        font-size: 12px
        padding: 0 30px
        box-sizing: border-box
        color: #7c7c7c
        .icon-look
            cursor: pointer
            &:hover
                color: #1aad19
        .emojiBox
            position: absolute
            display: flex
            flex-wrap: wrap
            top: -210px
            left: -100px
            width: 300px
            height: 200px
            padding: 5px
            background-color: #fff
            border: 1px solid #d1d1d1
            border-radius: 2px
            box-shadow:0 1px 2px 1px #d1d1d1
            &.showbox-enter-active, &.showbox-leave-active
                transition: all .5s
            &.showbox-enter,&.showbox-leave-active
                opacity: 0
    textarea
        box-sizing: border-box
        padding: 0 30px
        height: 110px
        width: 100%
        border: none
        outline: none
        font-family: "Micrsofot Yahei"
        resize: none
    .send
        position: absolute
        bottom: 10px
        right: 30px
        width: 75px
        height: 28px
        line-height: 28px
        box-sizing: border-box
        text-align: center
        border: 1px solid #e5e5e5
        border-radius: 3px
        background: #f5f5f5
        font-size: 14px
        color: #7c7c7c
        &:hover
            background: rgb(18,150,17)
            color: #fff
    .warn
         position: absolute
         bottom: 50px
         right: 10px
         width: 110px
         height: 30px
         line-height: 30px
         font-size: 12px
         text-align: center
         border: 1px solid #bdbdbd
         border-radius: 4px
         box-shadow:0 1px 5px 1px #bdbdbd
         &.appear-enter-active, &.appear-leave-active
            transition: all 1s
         &.appear-enter,&.appear-leave-active
            opacity: 0
         &:before
            content: " "
            position: absolute
            top: 100%
            right: 20px
            border: 7px solid transparent
            border-top-color: #fff
            filter:drop-shadow(1px 3px 2px #bdbdbd)
</style>
