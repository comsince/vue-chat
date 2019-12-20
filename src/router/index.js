import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
// 共三个页面： 聊天页面，好友页面，个人简历分别对应一下路由
  routes: [
    {
      path: '/chat',
      component: require('@/page/chat/chat.vue')
    },
    {
      path: '/friend',
      component: require('@/page/friend/friend.vue')
    },
    {
      path: '/my',
      component: require('@/page/resume/resume.vue')
    }
  ],
  linkActiveClass: 'active'
})
router.push({ path: '/chat' });
export default router