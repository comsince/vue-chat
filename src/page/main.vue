<template>
  <div id="app" :class="{fullscreen: changeFullScreenMode}">
    <div class="sidebar">
      <mycard></mycard>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mycard from '../components/mycard/mycard'
import { mapActions, mapState } from 'vuex'
import VueWebSocket from '../websocket';
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE} from '../constant/index'
export default {
   components: {
     mycard
   },
   created () {
       this.$store.dispatch('initData');
   },
   computed: {
       ...mapState([
            'changeFullScreenMode'
        ])
   }
}
</script>

<style lang="stylus" scoped>

#app
  &.fullscreen
    width: 100%
    height: 100%
  display: flex
  border-radius 50px
  width: 75%
  height: 80%
  background-color: #fff
  .sidebar
    width: 60px
    height: 100%
    background: #2b2c2f
  .main
    flex: 1
    height: 100%
    background: #f2f2f2
</style>
