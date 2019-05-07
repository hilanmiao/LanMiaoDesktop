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
                    <v-alert type="error" :value="showError" transition="scale-transition">
                        更新出错
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs7>
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
            versionInfoList: [{
                "version": "0.0.2",
                "files": [
                    {
                        "url": "hilanmiao-setup-0.0.2.exe",
                        "sha512": "4YPiylv4SJS+Clazm93ccpntpy3pbT+dT0/iwsCstk+T4whsRxTRtjsmN7jnU+kAVBmYohS/zwlUtW+5S1HrZw==",
                        "size": 42857006
                    }
                ],
                "path": "hilanmiao-setup-0.0.2.exe",
                "sha512": "4YPiylv4SJS+Clazm93ccpntpy3pbT+dT0/iwsCstk+T4whsRxTRtjsmN7jnU+kAVBmYohS/zwlUtW+5S1HrZw==",
                "releaseDate": "2019-05-05T14:14:24.623Z",
                "releaseName": "0.0.2",
                "releaseNotes": "<h1>Bug fixes</h1>\n<ul>\n<li>修复xxxx</li>\n<li>修复xxxxx</li>\n</ul>"
            }]
        }),
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
                versionInfoListOri.foreach((item, index, array) => {
                    // 判断是不是已经存在这个版本的信息,如果存在就替换它
                    if (updateInfo.version === item.version) {
                        array[index] = updateInfo
                    } else {
                        // 将新的版本信息加入列表中
                        array.push(updateInfo)
                    }
                })
                localStorage.setItem('versionInfoList', JSON.stringify(versionInfoListOri))
            },
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
                ipcRenderer.on('updateMessage', (event, obj) => {
                    if (obj.action === 'updateAva') {
                        this.hasNewVersion = true
                        // this.saveVersionInfoList(obj.updateInfo)
                        // this.versionInfoList = this.getVersionInfoList()
                    } else if (obj.action === 'error') {
                        this.showError = true
                    } else {
                        // console.log(text)
                        this.saveVersionInfoList(obj.updateInfo)
                        this.versionInfoList = this.getVersionInfoList()
                    }
                })
            },
        }
    }
</script>

<style scoped>
    /*@import "../../assets/font/font.css";*/

    /*.container {*/
    /*font-size: 20px;*/
    /*h1 {*/
    /*font-family mincho*/
    /*}*/

    /*li {*/
    /*font-family yanqu;*/
    /*}*/
    /*}*/

    /*.container {*/
    /*padding-top: 75px;*/
    /*}*/
</style>
