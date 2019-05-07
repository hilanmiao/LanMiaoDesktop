<template>
    <v-layout row wrap>
        <v-flex xs4>
            <v-layout column wrap text-xs-center>
                <v-flex v-show="hasNewVersion">
                    <v-btn color="info" @click="downloadAndUpdate">有新版本，请下载更新！</v-btn>
                </v-flex>
                <v-flex v-show="hasNewVersion">
                    <v-progress-circular
                            :size="100"
                            :width="15"
                            :rotate="-90"
                            :value="downloadPercent"
                            color="primary"
                    >
                        {{ downloadPercent }}
                    </v-progress-circular>
                </v-flex>
                <v-flex class="text-xs-left" v-show="showError">
                    <v-alert type="error" v-model="showError" transition="scale-transition">
                        更新出错
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
            hasNewVersion: false,
            downloadPercent: 0,
            showError: false,
            info: '',
            versionInfoList: []
        }),
        destroyed() {
            // 移除事件监听
            ipcRenderer.removeAllListeners('updateMessage')
            ipcRenderer.removeAllListeners('downloadProgress')
        },
        mounted() {
            this.versionInfoList = this.getVersionInfoList()
            this.checkForUpdate()
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
                        array.splice(index,1)
                        return true
                    }
                })
                // 将新的版本信息加入列表中
                versionInfoListOri.push(updateInfo)
                localStorage.setItem('versionInfoList', JSON.stringify(versionInfoListOri))
            },
            downloadAndUpdate() {
                // 开始下载
                ipcRenderer.send('downloadUpdate')
                ipcRenderer.on('downloadProgress', (event, progressObj) => {
                    // console.log(progressObj)
                    this.downloadPercent = progressObj.percent.toFixed(0) || 0
                })
                // ipcRenderer.on('isUpdateNow', () => {
                //     ipcRenderer.send('isUpdateNow')
                // })
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
