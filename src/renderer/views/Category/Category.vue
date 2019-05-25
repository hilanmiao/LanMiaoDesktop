<template>
    <v-layout row>
        <v-flex xs12 d-flex>
            <v-card>
                <v-sheet
                        class="v-sheet--offset pa-2"
                        color="orange"
                        elevation="12"
                        width="60"
                        height="60"
                >
                    <v-icon large>assignment</v-icon>
                </v-sheet>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" @click="dialogEdit = true">New Item</v-btn>
                </v-card-title>
                <v-card-text class="pt-0 title font-weight-bold">
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
                            <td>{{ props.item.type ==='i' ? '收入' : '支出' }}</td>
                            <td class="text-xs-right">
                                <v-btn fab small color="success" @click="editItem(props.item)">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <v-btn fab small color="error" @click="deleteItem(props.item)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <v-alert :value="showNoData" color="error" icon="warning">
                                {{noDataMessage ? noDataMessage : 'Sorry, nothing to display here :('}}
                            </v-alert>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-dialog v-model="dialogEdit" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form
                            wrap
                            ref="form"
                            v-model="valid"
                            lazy-validation
                    >
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-select
                                            :items="typeList"
                                            item-text="text"
                                            item-value="value"
                                            label="Type*"
                                            :rules="[rules.required]"
                                            v-model="editedItem.type"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Category*"
                                                  :rules="[rules.required]"
                                                  v-model="editedItem.category"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="closeDialogEdit">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="saveEdit">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="290">
            <v-card>
                <v-card-title class="headline">delete immediately?</v-card-title>
                <v-card-text>Are you sure you want to delete this item?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="closeDialogDelete">Disagree</v-btn>
                    <v-btn color="blue darken-1" flat @click="saveDelete">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
                v-model="snackbar"
                right
                top
                :color="submitResult ? 'success' : 'error'"
        >
            {{ submitResult ? 'Operation succeeded': 'Operation succeeded' }}
            <v-btn
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script type="text/ecmascript-6">
    import {getCategoryPagination, postCategory, putCategoryById, deleteCategoryById} from '../../../api/category'

    export default {
        data() {
            return {
                // 表格相关
                loading: true,
                showNoData: false,
                totalDesserts: 0,
                desserts: [],
                pagination: {},
                headers: [
                    {
                        text: 'Category',
                        align: 'left',
                        sortable: true,
                        value: 'category'
                    },
                    {text: 'type', value: 'type', sortable: true},
                    {text: 'Actions', align: 'right', value: 'id', sortable: false}
                ],
                noDataMessage: '',
                // 表单相关
                dialogDelete: false,
                dialogEdit: false,
                valid: true,
                submitResult: false,
                editedIndex: -1,
                editedItem: {
                    category: '',
                    type: ''
                },
                defaultItem: {
                    category: '',
                    type: ''
                },
                rules: {
                    required: value => !!value || 'Required.',
                },
                typeList: [{text: '收入', value: 'i'}, {text: '支出', value: 'e'}],
                // 操作提示
                snackbar: false,
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.initialize()
                },
                deep: true
            },
            dialogEdit: {
                handler(val) {
                    val || this.closeDialogEdit()
                }
            },
        },
        mounted() {
            this.initialize()
        },
        methods: {
            initialize() {
                this.showNoData = false
                this.loading = true

                // 排序是可以没有的，如果想强制至少一列总是被排序的，
                // 而不是在升序（sorted ascending）/降序（sorted descending）/不排序（unsorted）的状态之间切换请添加 must-sort = true
                const {sortBy, descending, page, rowsPerPage} = this.pagination
                const params = this.pagination

                getCategoryPagination(params).then(result => {
                    if (result.code === 200) {
                        const items = result.data.list
                        const total = result.data.total

                        setTimeout(() => {
                            this.loading = false
                            this.desserts = items
                            this.totalDesserts = total
                        }, 1000)
                    } else {
                        this.loading = false
                        this.showNoData = true
                        this.noDataMessage = result.message
                    }
                }).catch(err => {
                    this.loading = false
                    this.showNoData = true
                    this.noDataMessage = err.message
                })
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogEdit = true
            },
            deleteItem(item) {
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            closeDialogEdit() {
                // 重新设置验证结果
                this.valid = true
                this.dialogEdit = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            closeDialogDelete() {
                this.dialogDelete = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            saveDelete() {
                deleteCategoryById(this.editedItem.id).then(result => {
                    if (result.code === 200) {
                        this.submitResult = true
                    } else {
                        this.submitResult = false
                    }
                    this.closeDialogDelete()
                    // 显示结果
                    this.snackbar = true
                    // 每次操作成功后，重新获取数据
                    this.initialize()
                }).catch(err => {
                    this.closeDialogDelete()
                    this.submitResult = false
                    // 显示结果
                    this.snackbar = true
                    // 每次操作成功后，重新获取数据
                    this.initialize()
                })
            },

            saveEdit() {
                if (this.$refs.form.validate()) {
                    if (this.editedIndex > -1) {
                        putCategoryById(this.editedItem.id, this.editedItem).then(result => {
                            if (result.code === 200) {
                                this.submitResult = true
                            } else {
                                this.submitResult = false
                            }
                            this.closeDialogEdit()
                            // 显示结果
                            this.snackbar = true
                            // 每次操作成功后，重新获取数据
                            this.initialize()
                        }).catch(err => {
                            this.closeDialogEdit()
                            this.submitResult = false
                            // 显示结果
                            this.snackbar = true
                            // 每次操作成功后，重新获取数据
                            this.initialize()
                        })
                    } else {
                        postCategory(this.editedItem).then(result => {
                            if (result.code === 200) {
                                this.submitResult = true
                            } else {
                                this.submitResult = false
                            }
                            this.closeDialogEdit()
                            // 显示结果
                            this.snackbar = true
                            // 每次操作成功后，重新获取数据
                            this.initialize()
                        }).catch(err => {
                            this.closeDialogEdit()
                            this.submitResult = false
                            // 显示结果
                            this.snackbar = true
                            // 每次操作成功后，重新获取数据
                            this.initialize()
                        })
                    }
                }
            },

        }
    }
</script>

<style scoped>
    .v-sheet--offset {
        top: -15px;
        left: 15px;
        position: relative;
        align-items: center;
        justify-content: center;
        display: flex;
    }
</style>
