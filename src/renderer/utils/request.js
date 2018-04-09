import axios from 'axios'
// import store from '../store'
// import router from '../router/index'

// 创建axios实例
const service = axios.create({
    // api的base_url
    // TODO: 改过
    // baseURL: process.env.BASE_API,
    // 请求超时时间
    timeout: 15000
})

// request拦截器
service.interceptors.request.use(config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // 携带默认参数
    // config.params = {
    //   token: getToken(),
    //   ...config.params
    // }
    // config.data = {
    //   token: getToken(),
    //   ...config.data
    // }

    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        // const res = response.data

        // // 由于登录错误也是返回的401，所以特别处理下
        // if (res.code === '401') {
        //   if (router.currentRoute.name === 'login') {
        //     Message.error(res.message)
        //   } else {
        //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //       confirmButtonText: '重新登录',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       store.dispatch('FedLogOut').then(() => {
        //         location.reload()// 为了重新实例化vue-router对象 避免bug
        //       })
        //     })
        //   }
        //   return Promise.reject('error')
        // } else {
        //   return response.data
        // }
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        // const res = response.data
        // if (res.code !== 20000) {
        //   Message({
        //     message: res.data,
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        //
        //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //       confirmButtonText: '重新登录',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       store.dispatch('FedLogOut').then(() => {
        //         location.reload()// 为了重新实例化vue-router对象 避免bug
        //       })
        //     })
        //   }
        //   return Promise.reject('error')
        // } else {
        //   return response.data
        // }
        // TODO: 记得改
        return response.data
    },
    error => {
        console.log('err' + error)// for debug
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service
