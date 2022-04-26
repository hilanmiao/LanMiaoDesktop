const state = {
  loading: false
}

const mutations = {
  SET_LOADING: (state, loading) => {
    state.loading = loading
  }
}

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
