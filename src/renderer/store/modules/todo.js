const STORAGE_KEY = 'vuetify-todos'

const state = {
    todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}

const mutations = {
    addTodo (state, todo) {
        state.todos.push(todo)
    },
    removeTodo (state, todo) {
        state.todos.splice(state.todos.indexOf(todo), 1)
    },
    editTodo (state, { todo, text = todo.text, done = todo.done }) {
        todo.text = text
        todo.done = done
    }
}

const actions = {
    addTodo ({ commit }, text) {
        commit('addTodo', {
            uid: Date.now(),
            text,
            done: false
        })
    },
    removeTodo ({ commit }, todo) {
        commit('removeTodo', todo)
    },
    toggleTodo ({ commit }, todo) {
        commit('editTodo', { todo, done: !todo.done })
    },
    editTodo ({ commit }, { todo, value }) {
        commit('editTodo', { todo, text: value })
    },
    toggleAll ({ state, commit }, done) {
        state.todos.forEach((todo) => {
            commit('editTodo', { todo, done })
        })
    },
    clearCompleted ({ state, commit }) {
        state.todos.filter(todo => todo.done)
            .forEach(todo => {
                commit('removeTodo', todo)
            })
    }
}

export default {
    state,
    mutations,
    actions
}
