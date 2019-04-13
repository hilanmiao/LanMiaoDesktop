const STORAGE_KEY = 'vuetify-todos'

export default store => {
    store.subscribe((mutation, state) => {
        console.log(mutation, state)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todo.todos))
    })
}
