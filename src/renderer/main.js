import devtools from '@vue/devtools'
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify' // 引入Vuetify
import 'vuetify/dist/vuetify.min.css' // 引入Vuetify的css文件
import 'material-design-icons-iconfont/dist/material-design-icons.css' // 引入Material Desgin Icon的css文件

Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// if (process.env.NODE_ENV === 'development') {
//     devtools.connect('localhost', '9080')
// }
