<template>
	<div class="content">
		<div class="friend-wrapper">
			<search></search>
      <friendlist></friendlist>
		</div>
		<div class="friendinfo">
			<info></info>
		</div>
	</div>
</template>

<script>
import search from '../../components/search/search'
import friendlist from '../../components/friendlist/friendlist'
import info from '../../components/info/info'
export default{
    components: {
        search,
        friendlist,
        info
    }
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  width: 100%
  height: 100%
  .friend-wrapper
    width: 250px
    background: var(--main-bg)
    transition: background-color 0.3s ease
  .friendinfo
    flex: 1
    background: var(--main-bg)
    transition: background-color 0.3s ease
</style>