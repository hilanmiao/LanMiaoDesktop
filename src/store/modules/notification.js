import { notificationService } from '@/services'

const state = {
  unreadNotifications: 0
}

const mutations = {
  SET_UNREAD_NOTIFICATION: (state, count) => {
    state.unreadNotifications = count
  }
}

const actions = {
  setUnreadNotification({ commit }, count) {
    commit('SET_UNREAD_NOTIFICATION', count)
  },
  countMyUnreadNotification({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      notificationService.countMyUnreadNotification()
        .then(response => {
          const { data } = response.data
          const count = data.count
          commit('SET_UNREAD_NOTIFICATION', count)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

