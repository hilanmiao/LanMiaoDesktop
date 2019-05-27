<template>
    <v-layout row>
        <v-flex xs12 d-flex>
            <v-card>
                <!--<v-list three-line subheader>-->
                    <!--<v-subheader>-->
                        <!--User Controls-->
                    <!--</v-subheader>-->
                    <!--<v-list-tile>-->
                        <!--<v-list-tile-content>-->
                            <!--<v-list-tile-title>Content filtering</v-list-tile-title>-->
                            <!--<v-list-tile-sub-title>-->
                                <!--Set the content filtering level to restrict appts that can be download-->
                            <!--</v-list-tile-sub-title>-->
                        <!--</v-list-tile-content>-->
                    <!--</v-list-tile>-->
                    <!--<v-list-tile>-->
                        <!--<v-list-tile-content>-->
                            <!--<v-list-tile-title>Password</v-list-tile-title>-->
                            <!--<v-list-tile-sub-title>-->
                                <!--Require password for purchase or use password to restrict purchase-->
                            <!--</v-list-tile-sub-title>-->
                        <!--</v-list-tile-content>-->
                    <!--</v-list-tile>-->
                <!--</v-list>-->
                <!--<v-divider></v-divider>-->
                <v-list three-line subheader>
                    <v-subheader>
                        UserData
                    </v-subheader>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Show User data path</v-list-tile-title>
                            <v-list-tile-sub-title>
                                <a href="javascript:;" @click="openFile(userDataPath)">{{userDataPath}}</a>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                    <v-subheader>General</v-subheader>
                    <v-list-tile href="javascript:;">
                        <v-list-tile-action>
                            <v-checkbox v-model="notifications" readonly></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content @click="notifications = !notifications">
                            <v-list-tile-title>Notifications</v-list-tile-title>
                            <v-list-tile-sub-title>Notify me about updates to apps or games that i downloaded
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile href="javascript:;">
                        <v-list-tile-action>
                            <v-checkbox v-model="autoStart"></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Auto Start</v-list-tile-title>
                            <v-list-tile-sub-title>Boot automatically</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-btn class="error" large @click="logout">logout</v-btn>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script type="text/ecmascript-6">
    import {ipcRenderer, app, remote, shell} from 'electron'

    export default {
        data: () => ({
            autoStart: false,
            notifications: true,
            showErrorSetting: false,
            userDataPath: ''
        }),
        destroyed() {
            // 移除事件监听
            ipcRenderer.removeAllListeners('getAutoStartValue')
        },
        mounted() {
            this.getUserDataPath()
            if (process.env.NODE_ENV === 'production') {
                this.getAutoStartValue()
            }
        },
        methods: {
            getUserDataPath() {
                const APP = process.type === 'renderer' ? remote.app : app
                this.userDataPath = APP.getPath('userData')
            },
            openFile(path) {
                // 在文件管理器中显示给定的文件,如果可以,'选中'该文件
                shell.showItemInFolder(path)
                // 播放哔哔的声音
                shell.beep()
                // 以桌面的默认方式打开给定的文件
                // shell.openItem(path)
            },
            changeAutoStart() {
                if (this.autoStart) {
                    this.enableAutoStart()
                } else {
                    this.disableAutoStart()
                }
            },
            getAutoStartValue() {
                // 检查是否自动启动
                ipcRenderer.send('getAutoStartValue')
                ipcRenderer.on('getAutoStartValue', (event, result) => {
                    this.autoStart = result
                    // 首次不watch对象
                    this.$watch('autoStart', this.changeAutoStart)
                })
            },
            enableAutoStart() {
                // 设置自动启动
                ipcRenderer.send('enableAutoStart')
            },
            disableAutoStart() {
                // 取消自动启动
                ipcRenderer.send('disableAutoStart')
            },
            logout() {
                // this.$store.dispatch('FedLogOut')
                // ipcRenderer.send('loggedOut')
                ipcRenderer.send('openLoginWindow')
            }
        }
    }
</script>

<style scoped>

</style>
