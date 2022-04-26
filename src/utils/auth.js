import storage from 'store'

const AccessTokenKey = 'accessToken'
const RefreshTokenKey = 'refreshToken'

export function getAccessToken() {
  return storage.get(AccessTokenKey)
}

export function setAccessToken(token) {
  return storage.set(AccessTokenKey, token)
}

export function removeAccessToken() {
  return storage.remove(AccessTokenKey)
}

export function getRefreshToken() {
  return storage.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return storage.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return storage.remove(RefreshTokenKey)
}

