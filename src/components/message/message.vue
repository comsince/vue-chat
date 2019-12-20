<!-- 消息框 -->
<template>
	<div class="message">
		<header class="header">
			<div class="friendname">{{selectedChat.user.name}}</div>
		</header>
		<div class="message-wrapper" ref="list">
		    <ul v-if="selectedChat">
		    	<li v-for="item in selectedChat.messages" class="message-item">
		    		<div class="time"><span>{{item.date | time}}</span></div>
		    		<div class="main" :class="{ self: item.self }">
                        <img class="avatar" width="36" height="36" :src="item.self ? user.img : selectedChat.user.img" />
                        <div class="content">
                            <div class="text" v-html="replaceFace(item.content)"></div>
                        </div>
                    </div>
		    	</li>
		    </ul>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'selectedChat',
            'messages'
        ]),
        ...mapState([
            'user',
            'emojis'
        ])
    },
    mounted() {
         //  在页面加载时让信息滚动到最下面
        setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
    },
    watch: {
        // 发送信息后,让信息滚动到最下面
        messages() {
          setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
        }
    },
    methods: {
        //  在发送信息之后，将输入的内容中属于表情的部分替换成emoji图片标签
        //  再经过v-html 渲染成真正的图片
        replaceFace (con) {
            if(con.includes('/:')) {
                var emojis=this.emojis;
                for(var i=0;i<emojis.length;i++){
                    con = con.replace(emojis[i].reg, '<img src="static/emoji/' + emojis[i].file +'"  alt="" style="vertical-align: middle; width: 24px; height: 24px" />');
                }   
                return con;
            }
            return con;
        }
    },
    filters: {
            // 将日期过滤为 hour:minutes
            time (date) {
                if (typeof date === 'string') {
                    date = new Date(date);
                }
                if(date.getMinutes()<10){
                  return date.getHours() + ':0' +date.getMinutes();
                }else{
                  return date.getHours() + ':' + date.getMinutes();
                }
            }
    }
}
</script>

<style lang="stylus" scoped>
   .message
      width: 100%
      height: 450px
      .header
        height: 60px
        padding: 28px 0 0 30px
        box-sizing: border-box
        border-bottom: 1px solid #e7e7e7
        .friendname
            font-size: 18px
      .message-wrapper
        min-height: 390px
        max-height: 390px
        padding: 10px 15px
        box-sizing: border-box
        overflow-y: auto
        border-bottom: 1px solid #e7e7e7
        .message
            margin-bottom: 15px
        .time
            width: 100%
            font-size: 12px
            margin: 7px auto
            text-align: center
            span
                display: inline-block
                padding: 4px 6px
                color: #fff
                border-radius: 3px
                background-color: #dcdcdc
        .main
            .avatar 
                float: left
                margin-left: 15px
                border-radius: 3px
            .content
                display: inline-block
                margin-left: 10px
                position: relative
                padding: 6px 10px
                max-width: 330px
                min-height: 36px
                line-height: 24px
                box-sizing: border-box
                font-size: 14px
                text-align: left
                word-break: break-all
                background-color: #fafafa
                border-radius: 4px
                &:before
                    content: " "
                    position: absolute
                    top: 12px
                    right: 100%
                    border: 6px solid transparent
                    border-right-color: #fafafa
        .self
            text-align: right
            .avatar
                float: right
                margin:0 15px
            .content 
                background-color: #b2e281
                &:before 
                    right: -12px
                    vertical-align: middle
                    border-right-color: transparent
                    border-left-color: #b2e281
</style>
