import { httpClient as http } from '../services'
const internals = {}
const apiUrl = 'api/common/'

internals.getImageCaptcha = (params) => {
  return http.get(apiUrl + 'captcha/img', params)
}

export default internals
