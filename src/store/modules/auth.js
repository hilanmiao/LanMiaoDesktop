import { getAccessToken, setAccessToken, removeAccessToken,
  getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import axios from 'axios'

const state = {
  user: {},
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
}

const mutations = {
  RESET_STATE: state => {
    state.user = {}
    state.accessToken = ''
    state.refreshToken = ''
    removeAccessToken()
    removeRefreshToken()
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
}

const actions = {
  // 更新tokens
  updateTokens({ commit }, { accessToken, refreshToken }) {
    axios.defaults.headers.common.Authorization = accessToken
    commit('SET_ACCESS_TOKEN', accessToken)
    commit('SET_REFRESH_TOKEN', refreshToken)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    console.debug('Tokens 已更新')
  },

  // 使用refreshToken
  useRefreshToken({ state }) {
    axios.defaults.headers.common.Authorization = state.refreshToken
    console.debug('使用refreshToken')
  },

  // 设置授权
  setAuth({ commit, dispatch }, data) {
    dispatch('updateTokens', data)
  },

  // 清除授权
  clearAuth({ commit, dispatch }) {
    axios.defaults.headers.common.Authorization = undefined
    commit('RESET_STATE')
  },

  // 设置登录的用户信息
  setUserInfo({ commit, dispatch }, data) {
    commit('SET_USER', data)
    console.debug('设置登录的用户信息')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
