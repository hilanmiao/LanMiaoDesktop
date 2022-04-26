import store from '../store'
import vm from '../renderer'
import { Message, MessageBox } from 'element-ui'
import { camelizeKeys } from '@/utils'

const internals = {}

internals.response = async(response) => {
  // 递归下划线转驼峰
  // TODO：因为我的后台返回的是带下划线的字段，转换为驼峰方便前端，但是如果全大写的字段会变成全小写，
  //  如车辆识别码VIN-vin，所以前后端命名基本没有大写的字段，有一定的局限性，可以把统一转换为驼峰这一行注释掉，让每个具体的业务逻辑自行处理
  response.data = camelizeKeys(response.data)
  console.log(response)
  const { code } = response.data

  if (code !== 200) {
    if (code === 20104) {
      // accessToken 过期，允许尝试一次 refreshToken，交由 http-client 处理
      response = 'EXPIRED_ACCESS_TOKEN'
    } else if (code === 20105 || code === 20109) {
      // 如果 accessToken 是无效的，或者 refreshToken 已过期，强制用户登录
      MessageBox.confirm('登录认证已过期，您可以取消停留在该页上，或重新登录', '警告', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        console.debug('accessToken 是无效的，或者 refreshToken 已过期，强制用户登录')
        await store.dispatch('auth/clearAuth')
        vm.$router.push('/login')
      }).catch(() => {})
    } else if (code === 20105) {
      console.debug('检验失败，这个用户的session可能已经被删除')
      Message.error('用户已被下线')
      await store.dispatch('auth/clearAuth')
      vm.$router.push('/login')
    } else if (code === 20110) {
      console.debug('检验失败，这个用户的session可能已经被删除')
      Message.error('用户会话可能已经被删除')
      await store.dispatch('auth/clearAuth')
      vm.$router.push('/login')
    } else if (code === 20111) {
      console.debug('校验失败，这个用户可能已经被删除')
      Message.error('用户可能已经被删除')
      await store.dispatch('auth/clearAuth')
      vm.$router.push('/login')
    } else if (code === 20105) {
      console.debug('检验失败，用户密码可能已经被修改了（另一台电脑）')
      Message.error('用户密码可能已经被修改')
      await store.dispatch('auth/clearAuth')
      vm.$router.push('/login')
    }
    return Promise.reject(response)
  }

  return Promise.resolve(response)
}

internals.responseError = function(error) {
  // 系统错误
  const errorMessage = error && error.response && error.response.message || '发生了一些未知的错误，请重试！'
  Message.error(errorMessage)

  return Promise.reject(error)
}

export default {
  response: internals.response,
  responseError: internals.responseError
}
