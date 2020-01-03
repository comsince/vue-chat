import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('vue-token');
  console.log('match route token '+token);
  if (token) {
    if (to.path === '/login') {
      next({ path: '/chat' })
    } else {
        next();
    }
  } else {
    next('/login')
  }
})