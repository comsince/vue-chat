import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
// 共三个页面： 聊天页面，好友页面，个人简历分别对应一下路由
  routes: [
    {
      path: '/login',
      component: require('@/page/login/login.vue')
    },
    {
      path: '/',
      component: require('@/page/main.vue'),
      redirect: 'conversation',
      children: [{
          path: 'conversation',
          name: 'conversation',
          component: require('@/page/chat/chat.vue'),
          hidden:true,
      },
      {
        path: 'friend',
        name: 'friend',
        component: require('@/page/friend/friend.vue'),
        hidden:true,
      }],
    },
  ],
  linkActiveClass: 'active'
})
// router.push({ path: '/chat' });
export default router