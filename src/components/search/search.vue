<!-- 搜索框 -->
<template>
<div class="wrapper">
	<div class="padding-wrapper">
		<div class="search-wrapper">
			<input type="text" class="searchInput" v-model="search" @keyup="change" placeholder="搜索">
			<i class="icon iconfont icon-sousuo" v-show="noText"></i>
			<div class="searchInput-delete" v-show="haveText" @click="del"></div>
		</div>
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
    max-height: 60px
    min-height: 60px 
    height: 60px
    background: var(--main-bg)
    transition: background-color 0.3s ease
	.padding-wrapper
	    border-right: 1px solid var(--border-color)
	    padding: 22px 12px 12px 12px
		.search-wrapper
			position: relative
			display: flex
			box-sizing: border-box
			height: 100%
			max-height: 26px
			width: 100%
			background-color: var(--input-bg)
			border: 1px solid var(--input-border)
			border-radius: 2px
			transition: background-color 0.3s ease
			.searchInput
				flex: 1
				font-size: 12px
				padding: 6px
				background-color: var(--input-bg)
				color: var(--text-color)
				border: none
				outline: none
				transition: background-color 0.3s ease, color 0.3s ease
				&:focus
					background-color: var(--hover-bg)
			.icon-sousuo
				display: inline-block
				width: 24px
				height: 24px
				font-size: 14px
				line-height: 24px
				text-align: center
				color: var(--text-color)
				opacity: 0.6
				transition: color 0.3s ease
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
