import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'todo',
            component: require('@/components/ToDoView/ToDoView').default
        },
        {
            path: '/douyu',
            name: 'douyu',
            component: require('@/components/DouYuView/DouYuView').default
        },
        {
            path: '/setting',
            name: 'setting',
            component: require('@/components/SettingView/SettingView').default
        },
        {
            path: '/update',
            name: 'update',
            component: require('@/components/UpdateView/UpdateView').default
        },
        {
            path: '/intro',
            name: 'intro',
            component: require('@/components/IntroView/IntroView').default
        },
        {
            path: '/welcome',
            name: 'welcome-view',
            component: require('@/components/WelcomeView').default
        },
        {
            path: '/inspire',
            name: 'inspire',
            component: require('@/components/InspireView').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
