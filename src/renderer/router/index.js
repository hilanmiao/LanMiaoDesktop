import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: require('@/views/Login/Login').default
        },
        {
            path: '/',
            name: 'home',
            redirect: '/home',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'home',
                component: require('@/views/Home/Home').default
            }]
        },
        {
            path: '/incomeAndExpenditure',
            name: 'incomeAndExpenditure',
            redirect: '/incomeAndExpenditure/incomeAndExpenditure',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'incomeAndExpenditure',
                component: require('@/views/IncomeAndExpenditure/IncomeAndExpenditure').default
            }]
        },
        {
            path: '/category',
            name: 'category',
            redirect: '/category/category',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'category',
                component: require('@/views/Category/Category').default
            }]
        },
        {
            path: '/assets',
            name: 'assets',
            redirect: '/assets/assets',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'assets',
                component: require('@/views/Assets/Assets').default
            }]
        },
        {
            path: '/settings',
            name: 'settings',
            redirect: '/settings/settings',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'settings',
                component: require('@/views/Settings/Settings').default
            }]
        },
        {
            path: '/notes',
            name: 'notes',
            redirect: '/notes/notes',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'notes',
                component: require('@/views/Notes/Notes').default
            }]
        },
        {
            path: '/help',
            name: 'help',
            redirect: '/help/help',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'help',
                component: require('@/views/Help/Help').default
            }]
        },
        {
            path: '/password',
            name: 'password',
            redirect: '/password/password',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'password',
                component: require('@/views/Password/Password').default
            }]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
