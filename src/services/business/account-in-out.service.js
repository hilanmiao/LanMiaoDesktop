import { httpClient as http } from '@/services'
const internals = {}
const apiUrl = 'api/account-in-out/'

internals.getAccountInOut = (params) => {
  return http.get(apiUrl, params)
}

internals.getAccountInOutList = (params) => {
  return http.get(apiUrl + 'list', params)
}

internals.getAccountInOutListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

internals.createAccountInOut = (data) => {
  return http.post(apiUrl, data)
}

internals.updateAccountInOut = (data) => {
  return http.put(apiUrl, data)
}

internals.deleteAccountInOut = (data) => {
  return http.delete(apiUrl, data)
}

export default internals
