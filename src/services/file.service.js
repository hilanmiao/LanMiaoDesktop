import { httpClient as http } from '@/services/index'

const internals = {}

internals.upload = (name, file, options) => {
  const data = new FormData()
  data.append('name', name)
  data.append('file', file)
  return http.post('api/upload', data, options)
}

internals.uploadAvatar = (name, file, options) => {
  const data = new FormData()
  data.append('name', name)
  data.append('file', file)
  return http.post('api/uploadAvatar', data, options)
}

internals.uploadPhotoWH = (name, file, options) => {
  const data = new FormData()
  data.append('name', name)
  data.append('file', file)
  return http.post('api/uploadPhotoWH', data, options)
}

internals.uploadZip = (name, file, options) => {
  const data = new FormData()
  data.append('name', name)
  data.append('file', file)
  return http.post('api/uploadZip', data, options)
}

export default internals
