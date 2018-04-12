<template>
    <v-app id="inspire">
        <v-navigation-drawer
                app
                fixed
                :clipped="$vuetify.breakpoint.lgAndUp"
                v-model="drawer">
            <v-list dense>
                <template v-for="item in items">
                    <v-layout
                            row
                            v-if="item.heading"
                            align-center
                            :key="item.heading">
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">{{item.heading}}</v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a href="#!" class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>
                    <v-list-group
                            v-else-if="item.children"
                            v-model="item.model"
                            :key="item.text"
                            :prepend-icon="item.model? item.icon: item['icon-alt']"
                            append-icon="">
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>{{item.text}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                                @click=""
                                v-for="(child,i) in item.children"
                                :key="i">
                            <v-list-tile-action v-if="child.icon">
                                <v-icon>{{child.icon}}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{child.text}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>
                    <v-list-tile v-else @click="" :key="item.text" :to="item.to">
                        <v-list-tile-action>
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{item.text}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                color="blue darken-3"
                app
                dark
                :clipped-left="$vuetify.breakpoint.lgAndUp"
                fixed>
            <v-toolbar-title style="width:300px" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer= !drawer"></v-toolbar-side-icon>
                <!--<span class="hidden-sm-and-down">懒喵</span>-->
                <span class="hidden-sm-and-down">
                    <img src="~@/assets/logo.png" alt="懒喵" style="height: 50px;vertical-align: middle;">
                </span>
            </v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="hidden-sm-and-down"
            >
            </v-text-field>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>apps</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>notifications</v-icon>
            </v-btn>
            <v-btn icon large>
                <v-avatar size="32px">
                    <img src="https://avatars1.githubusercontent.com/u/27052900?s=460&v=4" alt="懒喵">
                </v-avatar>
            </v-btn>
        </v-toolbar>
        <v-content fluid fill-height>
            <v-slide-y-transition mode="out-in">
                <router-view></router-view>
            </v-slide-y-transition>
        </v-content>
        <v-btn
                fab
                bottom
                right
                color="pink"
                dark
                fixed
                @click.stop="dialog = !dialog"
        >
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" width="800px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">创建待办事项</v-card-title>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 align-center justify-space-between>
                            <v-layout align-center>
                                <v-avatar size="40px" class="mr-3">
                                    <img
                                            src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                                            alt=""
                                    >
                                </v-avatar>
                                <v-text-field
                                        placeholder="Name"
                                ></v-text-field>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    prepend-icon="business"
                                    placeholder="Company"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    placeholder="Job title"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-btn flat color="primary">More</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
                    <v-btn flat @click="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>
    export default {
        name: 'app',
        data: () => ({
            drawer: null,
            dialog: false,
            items: [
                {icon: 'contacts', text: '待办记事', to: '/todo'},
                {icon: 'contacts', text: '斗鱼直播', to: '/douyu'},
                {
                    icon: 'keyboard_arrow_up',
                    'icon-alt': 'keyboard_arrow_down',
                    text: 'Labels',
                    model: true,
                    children: [
                        {icon: 'add', text: 'Create label'}
                    ]
                },
                {
                    icon: 'keyboard_arrow_up',
                    'icon-alt': 'keyboard_arrow_down',
                    text: 'More',
                    model: false,
                    children: [
                        {text: 'Import'},
                        {text: 'Export'},
                        {text: 'Print'},
                        {text: 'Undo changes'},
                        {text: 'Other contacts'}
                    ]
                },
                {icon: 'settings', text: '设置', to: '/setting'},
                {icon: 'chat_bubble', text: '检查更新', to: '/update'},
                {icon: 'chat_bubble', text: '意见反馈', to: '/inspire'},
                {icon: 'chat_bubble', text: '关于懒喵', to: '/intro'}
            ]
        }),
        mounted() {
        }
    }
</script>

<style>
    /*@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');*/
    /* 由于网站加载的比较慢，所以直接使用link标签，放到了index.ejs里了 */
    /* Global CSS */
</style>
