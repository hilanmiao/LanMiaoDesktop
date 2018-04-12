<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
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
                            <v-list-tile-content @click="autoStart = !autoStart">
                                <v-list-tile-title>开机启动</v-list-tile-title>
                                <v-list-tile-sub-title>Notify me about updates to apps or games that i
                                    downloaded
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script type="text/ecmascript-6">
    import {ipcRenderer} from 'electron'

    export default {
        data: () => ({
            autoStart: false,
            notifications: true,
            result: '',
            showErrorSetting: false
        }),
        watch: {
            autoStart: function (newVal) {
                if (newVal) {
                    this.enableAutoStart()
                } else {
                    this.disableAutoStart()
                }
            }
        },
        mounted() {

        },
        methods: {
            getAutoStartValue() {
                // 检查是否自动启动
                ipcRenderer.send('getAutoStartValue')
                ipcRenderer.on('getAutoStartValue', (event, result) => {
                    this.result = result
                })
            },
            enableAutoStart() {
                // 设置自动启动
                ipcRenderer.send('enableAutoStart')
                this.getAutoStartValue()
            },
            disableAutoStart() {
                // 取消自动启动
                ipcRenderer.send('disableAutoStart')
                this.getAutoStartValue()
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
