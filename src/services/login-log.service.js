import { httpClient as http } from '@/services/index'
const internals = {}
const apiUrl = 'api/system/login-log/'

internals.getLoginLogListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

export default internals
