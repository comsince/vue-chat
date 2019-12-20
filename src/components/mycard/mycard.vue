<!-- 最左边的选择框 -->
<template>
	<div class="mycard">
	    <header>
	    	<img :src="user.img" class="avatar">
	    </header>
	    <div class="navbar" @click="clearSearch">
	         <router-link to="/chat" class="icon iconfont icon-msg" ></router-link>
	         <router-link to="/friend" class="icon iconfont icon-friend"></router-link>
	         <router-link to="/my" class="icon iconfont icon-collection"></router-link>
	    </div>
	    <footer>
	        <i class="icon iconfont icon-more"></i>
	    </footer>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
       ...mapState([
       	  'user',
       ])
    },
    methods: {
    	clearSearch() {
    		this.$store.dispatch('search', '')
    	}
    }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/fonts/iconfont.css'
.mycard
    position: relative
    width: 100%
    height: 100%
    .avatar
	    width: 36px
	    height: 36px
	    margin: 20px 12px 0 12px
	    border-radius: 2px
    .navbar
        width: 100%
        text-align: center
	    .icon
	        display: inline-block
	        font-size: 26px
	        margin-top: 28px
	        padding: 0 16px
	        box-sizing: border-box
	        color: rgb(173,174,175)
	        opacity: 0.8
	        cursor: pointer
	        &.active
	            color: rgb(0,220,65)
	        &:hover
	            opacity: 1;
	    .icon-msg,.icon-more
	        font-size: 22px
	    .icon-msg
	        padding: 0 19px
	footer
	    position: absolute
	    bottom: 20px
	    width: 100%
	    text-align: center
</style>
