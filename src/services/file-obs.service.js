import { httpClient as http } from '@/services/index'

const internals = {}

internals.uploadImage = (name, file, options) => {
  const data = new FormData()
  data.append('name', name)
  data.append('file', file)
  return http.post('api/obs/upload/image', data, options)
}

export default internals
