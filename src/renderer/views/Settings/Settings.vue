<template>
    <v-layout row>
        <v-flex xs12 d-flex>
            <v-card>
                <v-list three-line subheader>
                    <v-subheader>
                        User Controls
                    </v-subheader>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Content filtering</v-list-tile-title>
                            <v-list-tile-sub-title>
                                Set the content filtering level to restrict appts that can be download
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Password</v-list-tile-title>
                            <v-list-tile-sub-title>
                                Require password for purchase or use password to restrict purchase
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
    import {ipcRenderer} from 'electron'

    export default {
        data: () => ({
            autoStart: false,
            notifications: true,
            showErrorSetting: false
        }),
        mounted() {
            this.getAutoStartValue()
        },
        methods: {
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
                this.$store.dispatch('FedLogOut')
                ipcRenderer.send('loggedOut')
            }
        }
    }
</script>

<style scoped>

</style>
