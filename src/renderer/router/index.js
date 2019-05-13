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
            path: '/lock',
            name: 'lock',
            redirect: '/lock/lock',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'lock',
                component: require('@/views/Lock/Lock').default
            }]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
