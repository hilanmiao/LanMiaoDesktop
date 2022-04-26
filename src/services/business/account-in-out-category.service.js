import { httpClient as http } from '@/services'
const internals = {}
const apiUrl = 'api/account-in-out-category/'

internals.getAccountInOutCategory = (params) => {
  return http.get(apiUrl, params)
}

internals.getAccountInOutCategoryList = (params) => {
  return http.get(apiUrl + 'list', params)
}

internals.getAccountInOutCategoryListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

internals.createAccountInOutCategory = (data) => {
  return http.post(apiUrl, data)
}

internals.updateAccountInOutCategory = (data) => {
  return http.put(apiUrl, data)
}

internals.deleteAccountInOutCategory = (data) => {
  return http.delete(apiUrl, data)
}

export default internals
