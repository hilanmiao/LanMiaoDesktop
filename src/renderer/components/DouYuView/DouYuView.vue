<template>
    <v-container fluid grid-list-md px-4 py-4>
        <v-layout row wrap>
            <v-flex xs3 v-for="item in list">
                <v-card>
                    <v-card-media :src="item.src" height="200px" @click="dialog=true">
                        <v-container fill-height fluid>
                            <v-layout fill-height>
                                <v-flex xs12 align-end flexbox>
                                    <span class="headline white--text" v-text="item.title"></span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-media>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-icon>visibility</v-icon>
                        <div class="caption grey--text">2432040</div>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout justify-center py-4>
            <div>
                <v-flex xs12>
                    <v-pagination :length="total" :total-visible="7" v-model="page"></v-pagination>
                </v-flex>
            </div>
            <v-dialog v-model="dialog" max-width="1440px">
                <v-card>
                    <v-card-title class="grey lighten-4 py-4 title">
                        <div class="text-xs-center">
                            <v-chip>
                                <v-avatar>
                                    <img src="https://apic.douyucdn.cn/upload/avatar/default/01_big.jpg" alt="trevor">
                                </v-avatar>
                                英雄联盟官方赛事
                            </v-chip>
                            <v-chip label color="pink" outline>
                                <v-icon left>label</v-icon>
                                英雄联盟
                            </v-chip>
                            <v-chip label color="pink" outline>
                                <v-icon left>visibility</v-icon>
                                2432040
                            </v-chip>
                        </div>
                    </v-card-title>
                    <v-layout>
                        <v-flex xs12 align-center justify-space-between>
                            <div>
                                <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
                            </div>
                            <div style="width: 100%;height: 600px;">
                                <webview id="foo"
                                         style="width: 100%;height: 600px;"></webview>
                            </div>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="dialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script type="text/ecmascript-6">
    export default {
        data: () => ({
            dialog: false,
            page: 1,
            total: 105,
            list: [
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'LPL春季赛 WEvsOMG', src: 'https://rpic.douyucdn.cn/amrpic-180408/288016_1610.jpg', flex: 12},
                {title: 'Favorite road trips', src: 'https://vuetifyjs.com/static/doc-images/cards/road.jpg', flex: 6},
                {title: 'Best airlines', src: 'https://vuetifyjs.com/static/doc-images/cards/plane.jpg', flex: 6}
            ]
        }),
        watch: {
            dialog: function (newVal) {
                if (newVal) {
                    setTimeout(() => {
                        const webview = document.querySelector('webview')
                        webview.src = 'https://www.douyu.com/288016'
                    }, 1000)
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
