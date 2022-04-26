import { httpClient as http } from '@/services'
const internals = {}
const apiUrl = 'api/bag/'

internals.getBag = (params) => {
  return http.get(apiUrl, params)
}

internals.getBagList = (params) => {
  return http.get(apiUrl + 'list', params)
}

internals.getBagListByPage = (params) => {
  return http.get(apiUrl + 'page', params)
}

internals.createBag = (data) => {
  return http.post(apiUrl, data)
}

internals.updateBag = (data) => {
  return http.put(apiUrl, data)
}

internals.deleteBag = (data) => {
  return http.delete(apiUrl, data)
}

export default internals
