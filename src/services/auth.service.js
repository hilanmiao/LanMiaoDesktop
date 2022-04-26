import store from '../store'

import { httpClient as http } from '../services'

const internals = {}

internals.login = data => {
  return http
    .post('api/login', data)
    .then(response => {
      const { data } = response.data
      store.dispatch('auth/setAuth', data)
    })
    .catch(error => {
      console.error('authService.login-error:\n', error)
      throw error
    })
}

internals.logout = () => {
  store.dispatch('auth/useRefreshToken')
  return http
    .put('api/logout')
    .then(response => {
      store.dispatch('auth/clearAuth')
    })
    .catch(error => {
      console.error('authService.logout-error:\n', error)
      throw error
    })
}

internals.getUserInfo = () => {
  return http
    .get('api/system/user/basic')
    .then(response => {
      // store.dispatch('auth/setUserInfo', response.data)
      return response
    })
    .catch(error => {
      console.error('authService.getUserInfo-error:\n', error)
      throw error
    })
}

export default internals
