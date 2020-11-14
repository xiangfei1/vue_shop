import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')
const Welcome = () => import('@/component/Welcome.vue')
const User = () => import('@/component/user/User.vue')
const Rights = () => import('@/component/power/Rights.vue')
const Roles = () => import('@/component/power/Roles.vue')
const Categories = () => import('@/component/goods/Categories.vue')
const Params = () => import('@/component/goods/Params.vue')
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫，用户未登录不能通过改变 URL进入系统
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = sessionStorage.getItem('token')
  if (!tokenstr) next('/login')
  next()
})
export default router
