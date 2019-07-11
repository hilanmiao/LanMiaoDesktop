<template>
    <v-layout class="mt-3">
        <v-flex d-flex class="pa-0">
            <v-card
            >
                <v-sheet
                        class="v-sheet--offset mx-auto pa-2"
                        color="orange"
                        elevation="12"
                        max-width="calc(100% - 32px)"
                >
                    <h1>History</h1>
                    <span>Here is every pay</span>
                </v-sheet>
                <v-card-text class="pt-0 title font-weight-bold">
                    <v-data-table
                            hide-actions
                            :headers="headers"
                            :items="desserts"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.createdAt }}</td>
                            <td>{{ props.item.assetsName }}</td>
                            <td>{{ props.item.categoryName }}</td>
                            <td>{{props.item.type === 'e'? '-':''}} {{ props.item.amountOfMoney }}</td>
                        </template>
                    </v-data-table>
                    <v-btn
                            block
                            class="mt-3"
                            depressed
                            round
                            @click="loadMore"
                            :disabled="noMoreData"
                    >
                        load more
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import {getModelPagination} from '../../../../../api/incomeAndExpenditure'
    import {getModelAll as getCategoryAll} from '../../../../../api/category'
    import {getModelAll as getAssetsAll} from '../../../../../api/assets'

    export default {
        name: "list",
        data() {
            return {
                headers: [
                    {
                        text: 'Time', align: 'left', sortable: false, value: 'createdAt'
                    },
                    {text: 'Assets', sortable: false, value: 'assetsName'},
                    {text: 'Category', sortable: false, value: 'categoryName'},
                    {text: 'Money', sortable: false, value: 'amountOfMoney'},
                ],
                pagination: {
                    sortBy: 'createdAt',
                    descending: true,
                    page: 1,
                    rowsPerPage: 10
                },
                desserts: [],
                assetsList: [],
                categoryList: [],
                totalDesserts: 0,
                noMoreData: false
            }
        },
        mounted() {
            Promise.all([this._getCategoryAll(), this._getAssetsAll()]).then(result => {
                this.initialize()
            })
        },
        methods: {
            initialize() {
                const whereAttrs = {remark: this.search}
                const filterFun = (o => {
                    return true
                })

                getModelPagination(this.pagination, whereAttrs, filterFun).then(result => {
                    if (result.code === 200) {
                        let items = result.data.list
                        const total = result.data.total

                        // 表关联
                        if (items) {
                            items.forEach(item => {
                                this.categoryList.some(itemCategory => {
                                    if (item.categoryId === itemCategory.value) {
                                        item.categoryName = itemCategory.text
                                        return true
                                    }
                                })

                                this.assetsList.some(itemAssets => {
                                    if (item.assetsId === itemAssets.value) {
                                        item.assetsName = itemAssets.text
                                        return true
                                    }
                                })
                            })
                        }

                        this.totalDesserts = total
                        if(this.pagination.page  > Math.ceil(this.totalDesserts / this.pagination.rowsPerPage)) {
                            this.noMoreData = true
                        } else {
                            if(this.pagination.page > 1) {
                                this.desserts = this.desserts.concat(items)
                            } else {
                                this.desserts = items
                            }
                        }
                    }
                })
            },

            loadMore() {
                this.pagination.page += 1
                this.initialize()
            },

            _getCategoryAll() {
                getCategoryAll().then(result => {
                    if (result.code === 200) {
                        this.categoryList = result.data.map(item => {
                            return {text: item.category, value: item.id}
                        })
                    }
                })
            },

            _getAssetsAll() {
                getAssetsAll().then(result => {
                    if (result.code === 200) {
                        this.assetsList = result.data.map(item => {
                            return {text: item.assetsName, value: item.id}
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .v-sheet--offset {
        top: -15px;
        position: relative;
    }
</style>
