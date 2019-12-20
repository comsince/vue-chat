<!-- 搜索框 -->
<template>
<div class="wrapper">
	<div class="search-wrapper">
		<input type="text" class="searchInput" v-model="search" @keyup="change" placeholder="搜索">
		<i class="icon iconfont icon-search" v-show="noText"></i>
		<div class="searchInput-delete" v-show="haveText" @click="del"></div>
	</div>
</div>
</template>

<script>
export default {
	 methods: {
        change () {
        	this.$store.dispatch('search', this.search)
        },
        del () {
            this.search= ''
            this.change()
        }
     },
     data () {
     	return {
     		search: '',
     		active: false
     	}
     },
     computed: {
        noText () {
   	      if(this.search  === '') return true
   	      return false
        },
        haveText () {
   	      if(this.search  === '') return false
   	      return true
        }
     }
}
</script>

<style lang="stylus" scoped>
.wrapper
    padding: 22px 12px 12px 12px
	.search-wrapper
	  position: relative
	  display: flex
	  box-sizing: border-box
	  height: 26px
	  width: 100%
	  background-color: #e5e3e2
	  border: 1px solid #d9d7d6
	  border-radius: 2px
	  .searchInput
	    flex: 1
	    font-size: 12px
	    padding: 6px
	    background-color: #e5e3e2
	    outline: none
	    &:focus
	    	background-color: #f2efee
	  .icon-search
	    display: inline-block
	    width: 24px
	    height: 24px
	    font-size: 14px
	    line-height: 24px
	    text-align: center
	  .searchInput-delete
	    display: block
	    position: absolute
	    outline: none
	    top: 0;
	    right: 0;
	    width: 24px
	    height: 100%
	    background-image: url(delete.png)
	    background-size: 26px
	    background-position: center
	    background-repeat: no-repeat
	    cursor: pointer
</style>
