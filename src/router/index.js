import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const routes = [
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true,
        meta: {title: '登录'}
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard'),
            meta: {title: '工作台', icon: 'dashboard'}
        }]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [{
            path: 'index',
            name: 'index',
            component: () => import('@/views/profile/index'),
            meta: {title: '个人设置'}
        }, {
            path: 'notification',
            name: 'notification',
            component: () => import('@/views/profile/notification/index'),
            meta: {title: '我的消息'}
        }]
    },
    {
        path: '/account-manage',
        component: Layout,
        redirect: '/account-manage/account-in-out',
        hidden: true,
        children: [
            {
                path: 'account-in-out',
                name: 'account-in-out',
                component: () => import('@/views/account-manage/account-in-out'),
                meta: {title: '收支明细'}
            },
            {
                path: 'account-book',
                name: 'account-book',
                component: () => import('@/views/account-manage/account-book'),
                meta: {title: '账本管理'}
            },
        ]
    },
    {
        path: '/bag',
        component: Layout,
        redirect: '/bag/index',
        hidden: true,
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/bag'),
                meta: {title: '卡证照管理'}
            },
        ]
    },
]

const router = new Router({
    routes
})


export default router
