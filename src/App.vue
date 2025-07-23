<template>
  <div class="layout-container" id="app-chat" :class="{ 'dark-mode': isDarkMode }">
    <router-view></router-view>
    <searchfriend></searchfriend>
    <creategroup></creategroup>
    <relayMessage></relayMessage>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import searchfriend from './page/friend/searchfriend'
import creategroup from './page/group/creategroup'
import relayMessage from './components/menu/relayMessage'
export default {
   name : 'AppChat',
   components: {
     searchfriend,
     creategroup,
     relayMessage
   },
   computed: {
       ...mapState([
           'isDarkMode'
       ])
   }
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    min-width: 1088px;
    min-height: 550px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    --bg-color: #fff;
    --text-color: #333;
    --sidebar-bg: #2b2c2f;
    --main-bg: #ffffff;
    --border-color: #e1e1e1;
    --hover-bg: #f5f5f5;
    transition: background-color 0.3s ease;
}

.layout-container.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #e1e1e1;
    --sidebar-bg: #1a1a1a;
    --main-bg: #2a2a2a;
    --border-color: #404040;
    --hover-bg: #333333;
}
</style>


