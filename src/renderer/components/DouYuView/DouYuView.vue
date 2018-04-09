<template>
    <v-container fluid grid-list-md px-4 py-4>
        <v-layout row wrap>
            <v-flex xs2>
                <v-layout row wrap>
                    <v-chip label outline color="red" @click="cate_id = ''">全部</v-chip>
                    <v-chip label outline color="red" @click="cate_id = item.cate_id"
                            :selected="cate_id === item.cate_id ? true : false"
                            v-for="item in cateList" :key="item.cate_id">
                        <v-avatar tile>
                            <img :src="item.game_icon" alt="trevor">
                        </v-avatar>
                        {{item.game_name}}
                    </v-chip>
                </v-layout>
            </v-flex>
            <v-flex xs10>
                <v-layout row wrap>
                    <v-flex xs3 v-for="(item,index) in list" :key="index">
                        <v-card>
                            <v-card-media :src="item.room_src" height="200px" @click="openRoom(item)">
                                <v-container fill-height fluid>
                                    <v-layout fill-height>
                                        <v-flex xs12 align-end flexbox>
                                            <span class="headline white--text" v-text="item.room_name"></span>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-media>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-icon>visibility</v-icon>
                                <div class="caption grey--text" v-text="item.hn"></div>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout justify-center py-4>
                    <div>
                        <v-flex xs12>
                            <v-pagination ref="pagination" :length="total" :total-visible="7"
                                          v-model="page"></v-pagination>
                        </v-flex>
                    </div>
                    <v-dialog v-model="showDialog" max-width="1440px">
                        <v-card>
                            <v-card-title class="grey lighten-4 py-4 title">
                                <div class="text-xs-center">
                                    <v-chip>
                                        <v-avatar>
                                            <img src="https://apic.douyucdn.cn/upload/avatar/default/01_big.jpg"
                                                 alt="trevor">
                                        </v-avatar>
                                        {{detailRoom.room_name}}
                                    </v-chip>
                                    <v-chip label color="pink" outline>
                                        <v-icon left>label</v-icon>
                                        {{detailRoom.cate_name}}
                                    </v-chip>
                                    <v-chip label color="pink" outline>
                                        <v-icon left>visibility</v-icon>
                                        {{detailRoom.hn}}
                                    </v-chip>
                                </div>
                            </v-card-title>
                            <v-layout>
                                <v-flex xs12 align-center justify-space-between>
                                    <div style="text-align: center;" class="pa-4" v-show="!showWebView">
                                        <v-progress-circular indeterminate :size="70" :width="7"
                                                             color="purple"></v-progress-circular>
                                    </div>
                                    <!--<webview v-show="showWebView" style="width: 100%;height: 600px;" nodeintegration plugins allowpopups disablewebsecurity></webview>-->
                                    <webview id="webview" :class="{hide: !showWebView}"
                                             style="width: 100%;height: 600px;" plugins></webview>
                                </v-flex>
                            </v-layout>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="showDialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-snackbar color="error" v-model="showError">
            api调用出现错误
            <v-btn dark flat @click.native="showError = false">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script type="text/ecmascript-6">
    import {getRoomDetail, getRoomList, getRoomListAll} from '@/api/douyu'

    export default {
        data: () => ({
            cate_id: '',
            showDialog: false,
            page: 1,
            total: 0,
            limit: 16,
            offset: 0,
            list: [],
            cateList: [],
            detailRoom: {},
            webviewSrc: '',
            showWebView: false,
            showError: false
        }),
        watch: {
            showDialog: function (newVal) {
                const webview = document.getElementById('webview')
                if (newVal) {
                    // if (parseInt(Math.random() * 10) % 2 === 0) {
                    //     this.webviewSrc = 'http://www.baidu.com'
                    // } else {
                    //     this.webviewSrc = 'http://www.bilibili.com'
                    // }
                    this.showWebView = true
                    setTimeout(() => {
                        webview.src = this.webviewSrc
                        // webview.loadURL(this.webviewSrc)
                    }, 400)
                } else {
                    // webview.src = ''
                    webview.stop()
                }
            },
            page: function (newVal) {
                // 拼装查询用的offset
                if (newVal > 1) {
                    this.offset = (newVal - 1) * this.limit
                } else {
                    this.offset = 0
                }
                this._getRoomTotal()
                this._getRoomList()
            },
            cate_id: function () {
                if (this.page === 1) {
                    // page=1时，切换分页不会触发watch，所以手动触发
                    this._getRoomTotal()
                    this._getRoomList()
                } else {
                    this.page = 1
                }
            }
        },
        created() {
            this._getCateList()
            this._getRoomTotal()
            this._getRoomList()
        },
        mounted() {
            const webview = document.getElementById('webview')
            // 设置允许使用_blank打开链接
            webview.addEventListener('new-window', (e) => {
                const protocol = require('url').parse(e.url).protocol
                if (protocol === 'http:' || protocol === 'https:') {
                    // shell.openExternal(e.url)
                    window.open(e.url)
                }
            })
        },
        methods: {
            openRoom: function (item) {
                this.webviewSrc = item.url
                this.showDialog = true
                this._getDetailRoom(item.room_id)
            },
            _getCateList() {
                // getCateList().then(response => {
                //     if (response.error === 0) {
                //         this.cateList = response.data
                //     }
                // })
                this.cateList = [
                    {
                        'cate_id': 19,
                        'game_name': '主机游戏',
                        'short_name': 'TVgame',
                        'game_url': 'http://www.douyu.com/directory/game/TVgame',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/5ab9135cb67ea8ad63cd33edb871d903.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/602c38f19a4fe9af40fdb64a00ce9ed5.jpg'
                    },
                    {
                        'cate_id': 203,
                        'game_name': '热门网游',
                        'short_name': 'rmwy',
                        'game_url': 'http://www.douyu.com/directory/game/rmwy',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/725fbaec18cf45d6abbd4038511446a8.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/801b8750f0a509fd0b0c43139c7ab20b.jpg'
                    },
                    {
                        'cate_id': 26,
                        'game_name': '怀旧游戏',
                        'short_name': 'classic',
                        'game_url': 'http://www.douyu.com/directory/game/classic',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/1572191247cc4b08ff6ffdd4bee808d7.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/568029e11adb524c778da572b578f2e3.jpg'
                    },
                    {
                        'cate_id': 47,
                        'game_name': '竞速游戏',
                        'short_name': 'jingsu',
                        'game_url': 'http://www.douyu.com/directory/game/jingsu',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/d1e30ea9f50261a9b1012716a50e8fa5.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/203e1ef12050f34f35bb1e3283648eab.jpg'
                    },
                    {
                        'cate_id': 201,
                        'game_name': '颜值',
                        'short_name': 'yz',
                        'game_url': 'http://www.douyu.com/directory/game/yz',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/0ec0627e8e52a0e391506bd6b633c1f5.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/d1546cfd3f7f985719f894496f2a7b2e.png'
                    },
                    {
                        'cate_id': 30,
                        'game_name': '综合手游',
                        'short_name': 'phone',
                        'game_url': 'http://www.douyu.com/directory/game/phone',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/5847250eba86dad9a3ad41492027146a.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/fecada4ba3e0b4997d6892f8094eb2e7.jpg'
                    },
                    {
                        'cate_id': 287,
                        'game_name': '星娱',
                        'short_name': 'xingyu',
                        'game_url': 'http://www.douyu.com/directory/game/xingyu',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/e0a141d2b106154302dd346e39e48804.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/433ec78ffc1214f641b81132612ae50a.png'
                    },
                    {
                        'cate_id': 174,
                        'game_name': '二次元',
                        'short_name': 'ecy',
                        'game_url': 'http://www.douyu.com/directory/game/ecy',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/ae59f668fa93a3755464f632126fc786.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/e6aa94fa2d6c5498bd72f11422710f3e.png'
                    },
                    {
                        'cate_id': 113,
                        'game_name': '棋牌娱乐',
                        'short_name': 'qipai',
                        'game_url': 'http://www.douyu.com/directory/game/qipai',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/d4345c32ba73714c4e3fb3fc872a41e9.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/1ba73805803186ac8bcbf1c044b53fd1.jpg'
                    },
                    {
                        'cate_id': 124,
                        'game_name': '户外',
                        'short_name': 'HW',
                        'game_url': 'http://www.douyu.com/directory/game/HW',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/b639e0126ab342b30680c45aa04f8f16.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/b24b716b2a13bc0b758632e5b20e0835.png'
                    },
                    {
                        'cate_id': 255,
                        'game_name': '军事游戏',
                        'short_name': 'jsyx',
                        'game_url': 'http://www.douyu.com/directory/game/jsyx',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/0c5fd22b4f8403e235823dcb6919e36f.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/328faca66d7fe31d9c9ce38f99290ffe.jpg'
                    },
                    {
                        'cate_id': 194,
                        'game_name': '美食',
                        'short_name': 'ms',
                        'game_url': 'http://www.douyu.com/directory/game/ms',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/1556ea966e9327eb424ea3241f794c8e.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/6f7316ab336a8b1a7fdd021bd8e07093.png'
                    },
                    {
                        'cate_id': 283,
                        'game_name': '设计师',
                        'short_name': 'BLOVES',
                        'game_url': 'http://www.douyu.com/directory/game/BLOVES',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/9f37996aaf939f0c845f3b346cc83d79.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/d699282488c675ca8192e0e62395f577.jpg'
                    },
                    {
                        'cate_id': 175,
                        'game_name': '音乐',
                        'short_name': 'music',
                        'game_url': 'http://www.douyu.com/directory/game/music',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/d585248ffbd27ee3d386f587e64e82f7.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/fe21193c72537bad3cd9917d67e4b02c.png'
                    },
                    {
                        'cate_id': 134,
                        'game_name': '数码科技',
                        'short_name': 'smkj',
                        'game_url': 'http://www.douyu.com/directory/game/smkj',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/e1487b7ae1c54f90a5f70c07a772267e.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/7d14c2a7e7e8c8f773d9d25c18f40ae9.jpg'
                    },
                    {
                        'cate_id': 235,
                        'game_name': '脱口秀',
                        'short_name': 'tkx',
                        'game_url': 'http://www.douyu.com/directory/game/tkx',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/3501ed589e4c9e56fb75fdba1177b7a2.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/9a0fc0ca26061274b929993092f8e54b.jpg'
                    },
                    {
                        'cate_id': 136,
                        'game_name': '汽车',
                        'short_name': 'car',
                        'game_url': 'http://www.douyu.com/directory/game/car',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/f4a5922bba2ead559e888cb8a6def9b8.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/b78528a4925fe48077c88ed433deeaf8.jpg'
                    },
                    {
                        'cate_id': 250,
                        'game_name': '正能量',
                        'short_name': 'znl',
                        'game_url': 'http://www.douyu.com/directory/game/znl',
                        'game_src': 'https://cs-op.douyucdn.cn/dycatr/game_cate/6159579ed8d8792ddf3fd30a97a91795.jpg',
                        'game_icon': 'https://cs-op.douyucdn.cn/dycatr/game_cate/a5439515177f030622ddc83c86aba7d8.jpg'
                    }
                ]
            },
            _getRoomTotal() {
                getRoomListAll().then(response => {
                    if (response.error === 0) {
                        const length = response.data.length
                        // this.total = (response.data.length + this.limit - 1) / this.limit
                        this.total = length % this.limit === 0 ? length / this.limit : Math.ceil(length / this.limit)
                    } else {
                        this.showError = true
                    }
                })
            },
            _getRoomList() {
                const query = {
                    limit: this.limit,
                    offset: this.offset
                }
                getRoomList(query, this.cate_id).then(response => {
                    if (response.error === 0) {
                        this.list = response.data
                    } else {
                        this.showError = true
                    }
                })
            },
            _getDetailRoom(roomid) {
                getRoomDetail(roomid).then(response => {
                    if (response.error === 0) {
                        this.detailRoom = response.data
                    } else {
                        this.showError = true
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    webview.hide {
        visibility: hidden;
    }
</style>
