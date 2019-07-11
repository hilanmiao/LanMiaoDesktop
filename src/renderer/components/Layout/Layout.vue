<template>
    <v-app dark>
        <v-navigation-drawer
                fixed
                app
                dark
                :mini-variant="mini"
        >
            <v-container fluid display-1 font-weight-black text-uppercase
                         style="-webkit-user-select: none;-webkit-app-region: drag"
            v-show="!mini"
            >
                <v-layout>
                    <v-flex layout justify-center align-center>
                        <!--<v-icon>credit_card</v-icon>-->
                        <div>{{title}}</div>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-list>
                <template v-for="(item, i) in items">
                    <v-layout
                            row
                            v-if="item.heading"
                            align-center
                            :key="i"
                    >
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-right" v-if="item.heading === 'Home'" v-show="!mini">
                            <v-btn small flat color="orange" @click="updateDialog(true)">Add</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-divider
                            dark
                            v-else-if="item.divider"
                            class="my-3"
                            :key="i"
                    >
                    </v-divider>
                    <v-list-tile
                            :to="item.to"
                            :key="i"
                            v-else-if="item.isSingle"
                            @click=""
                            active-class="orange"
                    >
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-group
                            v-else-if="item.isGroup"
                            :prepend-icon="item.icon"
                            no-action
                            @click="mini = false"
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                                v-for="subItem in item.items"
                                :key="subItem.text"
                                @click=""
                        >
                            <v-list-tile-content>
                                <v-list-tile-title>{{ subItem.text }}</v-list-tile-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-group>
                </template>
                <v-list-tile
                        class="nav-item-logout"
                        @click="logout"
                        active-class="orange"
                >
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Logout
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed dense>
            <v-toolbar-side-icon @click.stop="mini = !mini" style="-webkit-app-region: no-drag"></v-toolbar-side-icon>
            <v-toolbar-title class="red--text" style="-webkit-user-select: none;-webkit-app-region: drag">
                Balance: $10000.50
            </v-toolbar-title>
            <v-spacer style="height:90%;-webkit-app-region: drag"></v-spacer>
            <v-btn style="-webkit-app-region: no-drag"
                   icon
                   @click.native.stop="winControl('minimize')"
            >
                <v-icon>remove</v-icon>
            </v-btn>
            <v-btn style="-webkit-app-region: no-drag"
                   icon
                   @click.native.stop="winControl('maximize')"
                   v-show="isMaximized"
            >
                <v-icon style="font-size: 20px;">filter_none</v-icon>
            </v-btn>
            <v-btn style="-webkit-app-region: no-drag"
                   icon
                   @click.native.stop="winControl('maximize')"
                   v-show="!isMaximized"
            >
                <v-icon>crop_square</v-icon>
            </v-btn>
            <v-btn style="-webkit-app-region: no-drag"
                   icon
                   @click.native.stop="winControl('close')"
            >
                <v-icon color="red">close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height grid-list-md>
                <router-view></router-view>
            </v-container>
            <Add></Add>
        </v-content>
        <v-footer app fixed inset>
            <span>&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    const electron = require('electron');
    const remote = electron.remote;

    import {mapActions} from 'vuex'
    import {ipcRenderer} from 'electron'
    import Add from '../add/add'

    export default {
        components: {
            Add
        },
        data: () => ({
            title: 'PocketBook',
            drawer: null,
            items: [
                {heading: 'Home'},
                {isSingle: true, icon: 'home', text: 'Dashboard', to: '/home'},
                {heading: 'Manager'},
                // {
                //     isGroup: true,
                //     icon: 'list',
                //     text: 'Task Manager',
                //     items: [
                //         {icon: '', text: 'Week Statistics'},
                //         {icon: '', text: 'Month Statistics'},
                //         {icon: '', text: 'Year Statistics'},
                //         {icon: '', text: 'File Manager'}
                //     ]
                // },
                {isSingle: true, icon: 'import_export', text: 'IncomeAndExpenditure', to: '/incomeAndExpenditure'},
                {isSingle: true, icon: 'category', text: 'Category', to: '/category'},
                {isSingle: true, icon: 'account_balance_wallet', text: 'Assets', to: '/assets'},
                {divider: true},
                {heading: 'System'},
                {isSingle: true, icon: 'settings', text: 'Settings', to: '/settings'},
                {isSingle: true, icon: 'visibility_off', text: 'Password', to: '/password'},
                {isSingle: true, icon: 'lightbulb_outline', text: 'Notes', to: '/notes'},
                {isSingle: true, icon: 'help', text: 'Help', to: '/help'},
            ],
            mini: false,
            right: null,
            // 是最大化
            isMaximized: false,
        }),
        // computed: {
        //     dialogAdd: {
        //         get() {
        //             return this.$store.getters.dialogAddShow
        //         },
        //         set(value) {
        //             alert('layout set ' + value)
        //             this.updateDialog(value)
        //         }
        //     }
        // },
        methods: {
            ...mapActions([
                'updateDialog',
            ]),
            winControl(action) {
                const browserWindow = remote.getCurrentWindow()
                switch (action) {
                    case 'minimize':
                        browserWindow.minimize()
                        break;
                    case 'maximize':
                        // if (this.isMaximized) {
                        if (browserWindow.isMaximized()) {
                            browserWindow.unmaximize()
                        } else {
                            if (this.isMaximized) {
                                browserWindow.unmaximize()
                            } else {
                                browserWindow.maximize()
                            }
                        }
                        // this.isMaximized = browserWindow.isMaximized()
                        this.isMaximized = !this.isMaximized

                        break;
                    case 'close':
                        browserWindow.close()
                        break;
                    default:
                        break;
                }
            },
            logout() {
                ipcRenderer.send('openLoginWindow')
            }
        }
    }
</script>

<style scoped lang="scss">

    .primary--text {
        color: orange !important;
        caret-color: orange !important;
    }

    .nav-item-logout {
        position: fixed;
        bottom: 0;
        width:100%
    }
</style>
