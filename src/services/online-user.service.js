import { httpClient as http } from '@/services/index'
const internals = {}
const apiUrl = 'api/system/online-user/'

internals.getOnlineUserListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

internals.kickUser = (data) => {
  return http.delete(apiUrl + 'kick', data)
}

export default internals
