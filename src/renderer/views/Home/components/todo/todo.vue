<template>
    <v-layout row wrap>
        <v-flex text-xs-center>
            <v-card>
                <v-list class="pa-0">
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-checkbox
                                    :input-value="allChecked"
                                    @change="toggleAll(!allChecked)"
                                    v-if="todos.length > 0"
                            ></v-checkbox>
                            <v-icon
                                    color="primary"
                                    v-else
                            >check
                            </v-icon>
                        </v-list-tile-action>
                        <v-text-field
                                :label="'New todo input'"
                                @keydown.enter="addTodo"
                                autofocus
                                browser-autocomplete="off"
                                clearable
                                flat
                                hide-details
                                maxlength="1023"
                                placeholder="What needs to be done?"
                                solo
                                v-model="newTodo"
                        ></v-text-field>
                    </v-list-tile>
                </v-list>
            </v-card>
            <!-- main -->
            <v-card class="mt-3" v-show="todos.length">
                <v-progress-linear class="my-0" v-model="progressPercentage"/>
                <v-card-actions class="px-3" v-show="todos.length">
          <span>
            {{ remaining }} {{ remaining | pluralize('item') }} left
          </span>
                    <v-spacer></v-spacer>
                    <v-btn-toggle
                            class="elevation-0"
                            mandatory
                            v-model="visibility"
                            v-show="todos.length"
                    >
                        <v-btn
                                :key="key"
                                :to="key"
                                :value="key"
                                class="mx-0"
                                flat
                                small
                                v-for="(val, key) in filters"
                        >
                            {{ key | capitalize }}
                        </v-btn>
                    </v-btn-toggle>
                </v-card-actions>
                <v-list class="pa-0">
                    <template v-for="todo in filteredTodos">
                        <v-divider :key="`${todo.uid}-divider`"></v-divider>
                        <TodoItem
                                :key="todo.uid"
                                :todo="todo"
                        />
                    </template>
                </v-list>
            </v-card>
            <v-btn
                    @click="clearCompleted"
                    block
                    class="mt-3"
                    depressed
                    round
                    color="orange"
                    v-show="todos.length > remaining"
            >
                Clear completed
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    import {mapActions} from 'vuex'

    import TodoItem from './todoItem'

    const filters = {
        all: todos => todos,
        active: todos => todos.filter(todo => !todo.done),
        completed: todos => todos.filter(todo => todo.done)
    }

    export default {
        components: {
            TodoItem
        },
        data: () => ({
            newTodo: '',
            filters: filters,
            visibility: 'all'
        }),
        computed: {
            todos() {
                // return this.$store.state.todos
                return this.$store.state.todo.todos
            },
            allChecked() {
                return this.todos.every(todo => todo.done)
            },
            filteredTodos() {
                return filters[this.visibility](this.todos)
            },
            remaining() {
                return this.todos.filter(todo => !todo.done).length
            },
            progressPercentage() {
                const len = this.todos.length
                return ((len - this.remaining) * 100) / len
            }
        },
        methods: {
            ...mapActions([
                'toggleAll',
                'clearCompleted'
            ]),
            addTodo() {
                const text = this.newTodo.trim()
                if (text) {
                    this.$store.dispatch('addTodo', text)
                }
                this.newTodo = ''
            }
        },
        filters: {
            pluralize: (n, w) => n === 1 ? w : (w + 's'),
            capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
        }
    }
</script>

<style scoped>

</style>
