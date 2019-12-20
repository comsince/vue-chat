<template>
  <div id="app">
    <div class="sidebar">
      <mycard></mycard>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mycard from './components/mycard/mycard'
import { mapActions } from 'vuex'
export default {
   components: {
     mycard
   },
   created () {
       this.$store.dispatch('initData')
   }
}
</script>

<style lang="stylus" scoped>
#app
  display: flex
  border-radius 50px
  margin: 20px auto
  width: 860px
  height: 600px
  background-color: #fff
  .sidebar
    width: 60px
    height: 600px
    background: #2b2c2f
  .main
    flex: 1
    height: 600px
    background: #f2f2f2
</style>
