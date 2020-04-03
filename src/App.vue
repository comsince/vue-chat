<template>
  <div class="layout-container" id="app-chat">
    <router-view></router-view>
    <searchfriend></searchfriend>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import searchfriend from './page/friend/searchfriend'
export default {
   name : 'AppChat',
   components: {
     searchfriend
   }
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
}

</style>


