<template>
    <v-container text-xs-center>
        <v-layout row wrap>
            <v-flex xs4>
                <v-badge color="red" v-model="hasNewVersion">
                    <span slot="badge">!</span>
                    <h1>当前版本：1.0.0</h1>
                </v-badge>
                <div>
                    <v-btn color="info" v-show="hasNewVersion" @click="downloadAndUpdate">下载更新</v-btn>
                </div>
                <div>
                    <v-progress-circular
                            v-show="hasNewVersion"
                            :size="100"
                            :width="15"
                            :rotate="-90"
                            :value="downloadPercent"
                            color="primary"
                    >
                        {{ downloadPercent }}
                    </v-progress-circular>
                </div>
                <div class="text-xs-left">
                    <v-alert type="error" :value="showError" transition="scale-transition">
                        更新出错
                    </v-alert>
                </div>
            </v-flex>
            <v-flex xs7 pl-4 text-xs-left>
                <h1>更新日志：</h1>
                <v-flex pl-4>
                    <h2>1.0.1<span class="caption">(2018-04-03)</span></h2>
                    <v-flex style="padding-left: 40px">
                        <ul>
                            <li>修复待办日记不能正确取消的问题</li>
                            <li>添加在线更新功能</li>
                            <li>添加开机启动，桌面快捷方式，最小化到系统托盘等基础功能</li>
                        </ul>
                    </v-flex>
                </v-flex>
                <v-flex pl-4>
                    <h2>1.0.0-rc1<span class="caption">(2018-04-03)</span></h2>
                    <v-flex style="padding-left: 40px">
                        <ul>
                            <li>哆啦A梦的口袋</li>
                            <li>开源免费，长期维护</li>
                        </ul>
                    </v-flex>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script type="text/ecmascript-6">
    import {ipcRenderer} from 'electron'

    export default {
        data: () => ({
            hasNewVersion: false,
            downloadPercent: 0,
            showError: false
        }),
        mounted() {
            this.checkForUpdate()
        },
        methods: {
            downloadAndUpdate() {
                // 开始下载
                ipcRenderer.send('downloadUpdate')
                ipcRenderer.on('downloadProgress', (event, progressObj) => {
                    // console.log(progressObj)
                    this.downloadPercent = progressObj.percent.toFixed(0) || 0
                })
                ipcRenderer.on('isUpdateNow', () => {
                    ipcRenderer.send('isUpdateNow')
                })
            },
            checkForUpdate() {
                // 开始检查
                ipcRenderer.send('checkForUpdate')
                // 添加自动更新事件的监听
                ipcRenderer.on('message', (event, text) => {
                    if (text === 'updateAva') {
                        this.hasNewVersion = true
                    } else if (text === 'error') {
                        this.showError = true
                    } else {
                        // console.log(text)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .container {
        padding-top: 75px;
    }
</style>
