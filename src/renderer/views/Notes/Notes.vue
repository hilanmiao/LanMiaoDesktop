<template>
    <v-layout row wrap>
        <v-flex xs4>
            <v-layout column wrap text-xs-left>
                <v-flex>
                    <v-btn color="info"
                           @click="checkForUpdate()">
                        Check for updates
                        <v-icon right>new_releases</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex class="title" v-show="noNewVersion">
                    <v-icon>thumb_up</v-icon>
                    Already the latest version
                </v-flex>
                <v-flex v-show="hasNewVersion">
                    <v-btn color="info"
                           :loading="downloading"
                           :disabled="downloading"
                           @click="downloadAndUpdate">
                        Download new version
                        <v-icon right>cloud_download</v-icon>
                        <template v-slot:loader>
                            <span>Loading...</span>
                        </template>
                    </v-btn>
                    <v-progress-circular
                            :size="100"
                            :width="15"
                            :rotate="-90"
                            :value="downloadPercent"
                            color="primary"
                    >
                        {{ downloadPercent }}
                    </v-progress-circular>
                    <v-dialog
                            v-model="downloading"
                            persistent
                            width="300"
                    >
                        <v-card
                                color="primary"
                                dark
                        >
                            <v-card-text>
                                Please wait a moment
                                <v-progress-linear
                                        indeterminate
                                        color="white"
                                        class="mb-0"
                                ></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogUpdateNow" persistent max-width="290">
                        <v-card>
                            <v-card-title class="headline">update immediately?</v-card-title>
                            <v-card-text>The installation package has been downloaded. Is it updated immediately?
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="dialogUpdateNow = false">Disagree</v-btn>
                                <v-btn color="blue darken-1" flat @click="updateNow()">Agree</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-flex>
                <v-flex class="text-xs-left" v-show="showError">
                    <v-alert type="error" v-model="showError" transition="scale-transition">
                        error info {{errorInfo}}
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs7 class="pl-5">
            <h1>ReleaseNotes：</h1>
            <v-layout column class="pl-5">
                <v-flex :key="key" v-for="(item, key) in versionInfoList">
                    <h2>v{{item.version}}<span class="caption">({{item.releaseDate.substr(0,10)}})</span></h2>
                    <v-flex class="pl-5" v-html="item.releaseNotes">
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    import {ipcRenderer} from 'electron'

    export default {
        data: () => ({
            dialogUpdateNow: false,
            downloading: false,
            hasNewVersion: false,
            noNewVersion: false,
            downloadPercent: 0,
            showError: false,
            errorInfo: {},
            versionInfoList: []
        }),
        destroyed() {
            // 移除事件监听
            ipcRenderer.removeAllListeners('updateMessage')
            ipcRenderer.removeAllListeners('downloadProgress')
            ipcRenderer.removeAllListeners('isUpdateNow')
        },
        mounted() {
            this.versionInfoList = this.getVersionInfoList()
            if (process.env.NODE_ENV === 'production') {
                this.checkForUpdate()
            }
        },
        methods: {
            getVersionInfoList() {
                return !localStorage.getItem('versionInfoList') ? [] : JSON.parse(localStorage.getItem('versionInfoList'))
            },
            saveVersionInfoList(updateInfo) {
                let versionInfoListOri = this.getVersionInfoList()
                versionInfoListOri.some((item, index, array) => {
                    // 判断是不是已经存在这个版本的信息,如果存在就删除它
                    if (updateInfo.version === item.version) {
                        array.splice(index, 1)
                        return true
                    }
                })
                // 将新的版本信息加入列表中
                versionInfoListOri.push(updateInfo)
                localStorage.setItem('versionInfoList', JSON.stringify(versionInfoListOri))
            },
            downloadAndUpdate() {
                this.downloading = true

                // 开始下载
                ipcRenderer.send('downloadUpdate')
                ipcRenderer.on('downloadProgress', (event, progressObj) => {
                    this.progress = JSON.stringify(progressObj)
                    // console.log(progressObj)
                    this.downloadPercent = progressObj.percent.toFixed(0) || 0
                    // if(this.downloadPercent === 100) { // 这样写为啥不好使呢？
                    if (progressObj.percent === 100) {
                        this.downloading = false
                        // 询问是否立即更新
                        this.dialogUpdateNow = true
                    }
                })
            },
            updateNow() {
                // 立刻退出并更新
                ipcRenderer.send('isUpdateNow')
            },
            checkForUpdate() {
                // 开始检查
                ipcRenderer.send('checkForUpdate')
                // 添加自动更新事件的监听
                ipcRenderer.on('updateMessage', (event, obj) => {
                    if (obj.action === 'updateAva') {
                        this.hasNewVersion = true
                        this.saveVersionInfoList(obj.updateInfo)
                        this.versionInfoList = this.getVersionInfoList()
                    } else if (obj.action === 'error') {
                        this.showError = true
                        this.errorInfo = obj.errorInfo
                    } else if (obj.action === 'updateNotAva') {
                        this.noNewVersion = true
                    } else {
                        // console.log(text)
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
