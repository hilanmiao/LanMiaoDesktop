const VUE_APP_BASE_API = 'https://services.smartmiao.com'
const VUE_APP_BASE_SOCKET = 'https://services.smartmiao.com'

import Vue from "vue";
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import _ from 'lodash'
import dayjs from 'dayjs'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import axios from 'axios'
import qs from 'qs'
import { getAccessToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import { authService, authInterceptor, notificationService } from '@/services'

// 打印项目信息
console.log('%c更多内容请访问：https://github.com/hilanmiao/smart-miao', 'color: red;')
// Ascii字符画 http://patorjk.com/software/taag/
console.log(`
┌─┐┌┬┐┌─┐┬─┐┌┬┐┌┬┐┬┌─┐┌─┐
└─┐│││├─┤├┬┘ │ ││││├─┤│ │
└─┘┴ ┴┴ ┴┴└─ ┴ ┴ ┴┴┴ ┴└─┘
`)

// 配置 NProgress
NProgress.configure({ showSpinner: false })

// 配置axios
axios.defaults.baseURL = VUE_APP_BASE_API
axios.defaults.paramsSerializer = function(params) { return qs.stringify(params) }
axios.interceptors.response.use(authInterceptor.response, authInterceptor.responseError)
axios.defaults.headers.common.Authorization = store.state.auth.accessToken

// 配置socket
const socket = io(VUE_APP_BASE_SOCKET, {
  // transports: ['websocket'],
  path: '/socket.io',
  reconnection: true,
  reconnectionAttempts: Infinity,
  autoConnect: false
})

// 配置路由
// no redirect whitelist
const whiteList = ['/login']
// 通过全局路由守卫实现权限控制、用户信息获取、加载进度
router.beforeEach(async(to, from, next) => {
  // 设置路由跳转loading（正常情况下基本看不到，但刷新页面等行为会明显看到）
  await store.dispatch('router/setLoading', true)

  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getAccessToken() || getRefreshToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
      // 设置路由跳转loading
      await store.dispatch('router/setLoading', false)
    } else {
      try {
        // TODO: 由于去掉了路由权限，代码改成这样导致了每次切换路由，下面接口都会走一遍，
        //  虽然也没毛病，但是感觉没大有必要，后期改成登录后再调用吧

        // 同步我的消息通知
        await notificationService.syncNotification()
        // 获取未读消息统计
        await store.dispatch('notification/countMyUnreadNotification')

        // 获取我的基本信息
        let user = {}
        await authService.getUserInfo()
            .then(response => {
              const { data } = response.data
              user = data
            })
            .catch(error => {
              throw error.data.message
            })
        await store.dispatch('auth/setUserInfo', user)

        next()
        // 设置路由跳转loading
        await store.dispatch('router/setLoading', false)
      } catch (error) {
        // remove token
        await store.dispatch('auth/clearAuth')
        Message.error(`${error}` || '发生了一些未知的错误，请重试！')

        // go to login page to re-login
        next(`/login?redirect=${to.path}`)
        NProgress.done()
        // 设置路由跳转loading
        await store.dispatch('router/setLoading', false)
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      // 设置路由跳转loading
      await store.dispatch('router/setLoading', false)
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
      // 设置路由跳转loading
      await store.dispatch('router/setLoading', false)
    }
  }
})
router.afterEach(async() => {
  // finish progress bar
  NProgress.done()
  // 设置路由跳转loading
  await store.dispatch('router/setLoading', false)
})

// ui
Vue.use(ElementUI)

// tools
Vue.prototype.$_ = _
Vue.prototype.$dayjs = dayjs
Vue.prototype.VUE_APP_BASE_API = VUE_APP_BASE_API
Vue.prototype.VUE_APP_BASE_SOCKET = VUE_APP_BASE_SOCKET

// socket
Vue.use(VueSocketIOExt, socket, { store })
