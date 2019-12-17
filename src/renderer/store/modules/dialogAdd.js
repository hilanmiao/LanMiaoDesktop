const state = {
    dialogAddShow: false
}

const mutations = {
    show(state, show) {
        state.dialogAddShow = show
    }
}

const actions = {
    updateDialog({commit}, show) {
        commit('show', show)
    }
}

export default {
    state,
    mutations,
    actions
}
