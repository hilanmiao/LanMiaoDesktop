<template>
    <v-container text-xs-center>
        <v-layout row wrap>
            <v-flex xs4>
                <v-badge color="red" v-model="hasNewVersion">
                    <span slot="badge">!</span>
                    <h2>当前版本：0.0.2</h2>
                </v-badge>
                <div>
                    <v-btn color="info" v-show="hasNewVersion" >下载更新</v-btn>
                </div>
                <div>
                    版本特性：
                    1.叭叭叭叭叭
                    2.叭叭叭吧吧
                </div>
            </v-flex>
            <v-flex xs7 pl-4 text-xs-left>
                <h2>更新日志：</h2>
                <v-flex pl-4>
                    <h3>0.1.1</h3>
                    <v-flex pl-4>
                        <span>1.使用vuetify cli项目初次构建</span><br>
                        <span>2.样式布局确认</span>
                    </v-flex>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script type="text/ecmascript-6">
    export default {
        data: () => ({
            hasNewVersion: true
        })
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .container {
        padding-top: 75px;
    }
</style>
