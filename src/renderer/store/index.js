import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'
import todoPlugin from './plugins/todo'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    modules,
    plugins: [
        todoPlugin,
        // createPersistedState(), // 需要统一，上面的todoPlugin没有括号，所以用变量
        createPersistedState,
        createSharedMutations
    ],
    strict: process.env.NODE_ENV !== 'production'
})
