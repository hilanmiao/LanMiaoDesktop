import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '工作台', icon: 'dashboard' }
    }]
  },
]

const router = new Router({
  routes
})


export default router
