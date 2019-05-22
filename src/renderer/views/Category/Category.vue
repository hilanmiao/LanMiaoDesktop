<template>
    <v-layout row>
        <v-flex xs12 d-flex>
            <v-card>
                <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :pagination.sync="pagination"
                        :total-items="totalDesserts"
                        :loading="loading"
                        class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.category }}</td>
                        <td class="text-xs-right">{{ props.item.type }}</td>
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script type="text/ecmascript-6">
    import {getCategoryPagination} from '../../../api/category'

    export default {
        data() {
            return {
                totalDesserts: 0,
                desserts: [],
                loading: true,
                pagination: {},
                headers: [
                    {
                        text: 'Category',
                        align: 'left',
                        sortable: true,
                        value: 'category'
                    },
                    {text: 'type', value: 'type',sortable: true },
                ]
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                },
                deep: true
            }
        },
        mounted() {
            this.getDataFromApi()
            // const newCategory = postCategory({category: '工资', type: 'i'})
            // console.log(newCategory)
            // getCategoryByWhere('工资')
            // getCategoryAll()
            // putCategory({
            //     "category": "工资111",
            //     "type": "i",
            //     "id": "27c46c0a-6318-499e-8c1f-d994880c3e66"
            // })
            // putCategoryWhere({id: newCategory.id})
            // replaceCategoryById('27c46c0a-6318-499e-8c1f-d994880c3e66')
            // deleteCategoryById('1938f0f3-e8e4-4196-ab21-0673f7fac430')
            // deleteCategoryWhere({category: '工资'})
        },
        methods: {
            getDataFromApi() {
                this.loading = true
                // 排序是可以没有的，如果想强制至少一列总是被排序的，
                // 而不是在升序（sorted ascending）/降序（sorted descending）/不排序（unsorted）的状态之间切换请添加 must-sort = true
                const {sortBy, descending, page, rowsPerPage} = this.pagination
                const params = this.pagination

                getCategoryPagination(params).then(result => {
                    if (result) {
                        const items = result.list
                        const total = result.total

                        setTimeout(() => {
                            this.loading = false
                            this.desserts = items
                            this.totalDesserts = total
                        }, 1000)
                    }
                }).catch(err => {

                })

            },
        }
    }
</script>

<style scoped>

</style>
