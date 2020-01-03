import router from './router'
import store from './store'
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('vue-token');
  console.log('match route token '+token+" to "+to.path +" from "+from.path +" next "+next.path);
  if (token) {
    if (to.path === '/login') {
      next({ path: '/conversation' })
    } else {
        next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})