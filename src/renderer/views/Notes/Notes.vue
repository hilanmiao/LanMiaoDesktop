<!--<template>-->
    <!--<v-container text-xs-center>-->
        <!--<v-layout row wrap>-->
            <!--<v-flex xs4>-->
                <!--<v-badge color="red" v-model="hasNewVersion">-->
                    <!--<span slot="badge">!</span>-->
                    <!--<h1>当前版本：1.0.0</h1>-->
                <!--</v-badge>-->
                <!--<div>-->
                    <!--<v-btn color="info" v-show="hasNewVersion" @click="downloadAndUpdate">下载更新</v-btn>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<v-progress-circular-->
                            <!--v-show="hasNewVersion"-->
                            <!--:size="100"-->
                            <!--:width="15"-->
                            <!--:rotate="-90"-->
                            <!--:value="downloadPercent"-->
                            <!--color="primary"-->
                    <!--&gt;-->
                        <!--{{ downloadPercent }}-->
                    <!--</v-progress-circular>-->
                <!--</div>-->
                <!--<div class="text-xs-left">-->
                    <!--<v-alert type="error" :value="showError" transition="scale-transition">-->
                        <!--更新出错-->
                    <!--</v-alert>-->
                <!--</div>-->
            <!--</v-flex>-->
            <!--<v-flex xs7 pl-4 text-xs-left>-->
                <!--<h1>更新日志：</h1>-->
                <!--<v-flex pl-4>-->
                    <!--<h2>1.0.1<span class="caption">(2018-04-03)</span></h2>-->
                    <!--<v-flex style="padding-left: 40px">-->
                        <!--<ul>-->
                            <!--<li>修复待办日记不能正确取消的问题</li>-->
                            <!--<li>添加在线更新功能</li>-->
                            <!--<li>添加开机启动，桌面快捷方式，最小化到系统托盘等基础功能</li>-->
                        <!--</ul>-->
                    <!--</v-flex>-->
                <!--</v-flex>-->
                <!--<v-flex pl-4>-->
                    <!--<h2>1.0.0-rc1<span class="caption">(2018-04-03)</span></h2>-->
                    <!--<v-flex style="padding-left: 40px">-->
                        <!--<ul>-->
                            <!--<li>哆啦A梦的口袋</li>-->
                            <!--<li>开源免费，长期维护</li>-->
                        <!--</ul>-->
                        <!--<ul>-->
                            <!--<li>正在准备做个用户访谈？请一定不要关注你准备提的问题，要知道，全面的获取用户信息并有效地进行分析，不能只依靠提问。-->

                                <!--研究用户，需要透过用户的语言、行为去了解他们内心深处的需求，排除伪需求，筛选真实需求，也就是透过现象看本质。这都需要产品设计者始终保持一颗同理心与开放的心态，有时用户的「是」与「否」也许是提问方式的不同导致的，是非判断只在一念之间，不具有决策性，关键是要挖掘用户的核心诉求。-->

                                <!--有些产品或功能看似很「简单」，但是越简单的东西设计越难。在「体验设计」逐渐被国内互联网公司和设计师们重视的现在，我们或许更能体会到设计的「本质」。在当今环境下，不能仅仅是提供产品和解决办法，而是要提供用户想要的产品和服务。-->

                                <!--用户研究的方法有很多，如何对这些方法进行选择，应该根据研究目标而定</li>-->
                        <!--</ul>-->
                    <!--</v-flex>-->
                <!--</v-flex>-->
            <!--</v-flex>-->
        <!--</v-layout>-->
    <!--</v-container>-->
<!--</template>-->

<!--<script>-->
    <!--import {ipcRenderer} from 'electron'-->

    <!--export default {-->
        <!--data: () => ({-->
            <!--hasNewVersion: false,-->
            <!--downloadPercent: 0,-->
            <!--showError: false-->
        <!--}),-->
        <!--mounted() {-->
            <!--this.checkForUpdate()-->
        <!--},-->
        <!--methods: {-->
            <!--downloadAndUpdate() {-->
                <!--// 开始下载-->
                <!--ipcRenderer.send('downloadUpdate')-->
                <!--ipcRenderer.on('downloadProgress', (event, progressObj) => {-->
                    <!--// console.log(progressObj)-->
                    <!--this.downloadPercent = progressObj.percent.toFixed(0) || 0-->
                <!--})-->
                <!--ipcRenderer.on('isUpdateNow', () => {-->
                    <!--ipcRenderer.send('isUpdateNow')-->
                <!--})-->
            <!--},-->
            <!--checkForUpdate() {-->
                <!--// 开始检查-->
                <!--ipcRenderer.send('checkForUpdate')-->
                <!--// 添加自动更新事件的监听-->
                <!--ipcRenderer.on('message', (event, text) => {-->
                    <!--if (text === 'updateAva') {-->
                        <!--this.hasNewVersion = true-->
                    <!--} else if (text === 'error') {-->
                        <!--this.showError = true-->
                    <!--} else {-->
                        <!--// console.log(text)-->
                    <!--}-->
                <!--})-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->
    <!--/*@import "../../assets/font/font.css";*/-->

    <!--/*.container {*/-->
        <!--/*font-size: 20px;*/-->
        <!--/*h1 {*/-->
            <!--/*font-family mincho*/-->
        <!--/*}*/-->

        <!--/*li {*/-->
            <!--/*font-family yanqu;*/-->
        <!--/*}*/-->
    <!--/*}*/-->

    <!--/*.container {*/-->
        <!--/*padding-top: 75px;*/-->
    <!--/*}*/-->
<!--</style>-->
