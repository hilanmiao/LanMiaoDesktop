import { httpClient as http } from '@/services/index'
const internals = {}
const apiUrl = 'api/system/user/'

internals.getUser = (params) => {
  return http.get(apiUrl, params)
}

internals.getUserList = (params) => {
  return http.get(apiUrl + 'list', params)
}

internals.getUserListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

internals.createUser = (data) => {
  return http.post(apiUrl, data)
}

internals.updateUser = (data) => {
  return http.put(apiUrl, data)
}

internals.deleteUser = (data) => {
  return http.delete(apiUrl, data)
}

internals.updateCurrentUserProfile = (data) => {
  return http.put(apiUrl + 'profile', data)
}

export default internals
