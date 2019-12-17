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
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search category"
                            single-line
                            hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="success" dark class="mb-2" @click="initialize">Search</v-btn>
                    <v-btn color="primary" dark class="mb-2" @click="dialogEdit = true">New Item</v-btn>
                    <v-btn color="error" dark class="mb-2" @click="dialogDeleteBatch = true">Batch Delete</v-btn>
                </v-card-title>
                <v-card-text class="pt-0 title font-weight-bold">
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="desserts"
                            :total-items="totalDesserts"
                            :pagination.sync="pagination"
                            :loading="loading"
                            select-all
                            item-key="id"
                            class="elevation-1"
                    >
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox
                                            :input-value="props.all"
                                            :indeterminate="props.indeterminate"
                                            primary
                                            hide-details
                                            @click.stop="toggleAll"
                                    ></v-checkbox>
                                </th>
                                <th
                                        v-for="(header, index) in props.headers"
                                        :key="header.text"
                                        :class="['column sortable',
                                            pagination.descending ? 'desc' : 'asc',
                                            header.value === pagination.sortBy ? 'active' : '',
                                            index === props.headers.length -1 ? 'text-xs-right' : 'text-xs-left'
                                            ]"
                                        @click="header.sortable && changeSort(header.value)"
                                >
                                    <v-icon small v-if="header.sortable">arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr :active="props.selected" @click="props.selected = !props.selected">
                                <td width="50">
                                    <v-checkbox
                                            :input-value="props.selected"
                                            primary
                                            hide-details
                                    ></v-checkbox>
                                </td>
                                <td>{{ props.item.category }}</td>
                                <td>{{ props.item.remark}}</td>
                                <td class="text-xs-right">
                                    <v-btn fab small color="success" @click="editItem(props.item)">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <v-btn fab small color="error" @click="deleteItem(props.item)">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
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
                                    <v-text-field label="Category*"
                                                  :rules="[rules.required]"
                                                  v-model="editedItem.category"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Remark"
                                                  v-model="editedItem.remark"></v-text-field>
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
        <v-dialog v-model="dialogDeleteBatch" max-width="290">
            <v-card>
                <v-card-title class="headline">batch delete immediately?</v-card-title>
                <v-card-text>Are you sure you want to delete these items?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="closeDialogDeleteBatch">Disagree</v-btn>
                    <v-btn color="blue darken-1" flat @click="saveDeleteBatch">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
                v-model="snackbar"
                right
                top
                :color="submitResult ? 'success' : 'error'"
        >
            {{ snackbarMsg}}
            <v-btn
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import {
        getModelWhere,
        getModelPagination,
        postModel,
        putModelById,
        deleteModelById,
        deleteModelByIds
    } from '../../../api/category'

    export default {
        data() {
            return {
                // 表格相关
                loading: true,
                showNoData: false,
                totalDesserts: 0,
                desserts: [],
                headers: [
                    {text: 'Category', value: 'category', align: 'left', sortable: true},
                    {text: 'Remark', value: 'remark', align: 'left', sortable: true},
                    {text: 'Actions', value: 'id', align: 'right', sortable: false}
                ],
                noDataMessage: '',
                search: '',
                pagination: {
                    sortBy: 'category'
                },
                selected: [],
                dialogDeleteBatch: false,
                // 表单相关
                dialogDelete: false,
                dialogEdit: false,
                valid: true,
                submitResult: false,
                editedIndex: -1,
                editedItem: {
                    category: '',
                    remark: ''
                },
                defaultItem: {
                    category: '',
                    remark: ''
                },
                rules: {
                    required: value => !!value || 'Required.',
                },
                // 操作提示
                snackbar: false,
                snackbarMsg: ''
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            pagination: {
                handler() {
                    this.initialize()
                },
                deep: true
            },
            // dialogEdit: {
            //     handler(val) {
            //         val || this.closeDialogEdit()
            //     }
            // },
            submitResult: {
                handler(val) {
                    if (val) {
                        this.snackbarMsg = this.snackbarMsg ? this.snackbarMsg : 'Operation succeeded'
                    } else {
                        this.snackbarMsg = this.snackbarMsg ? this.snackbarMsg : 'Operation failed'
                    }
                }
            },
            snackbar: {
                handler(val) {
                    if (!val) {
                        // 重置结果显示相关
                        this.submitResult = false
                        this.snackbarMsg = ''
                    }
                }
            }
        },
        mounted() {
            this.initialize()
        },
        methods: {
            toggleAll() {
                if (this.selected.length) this.selected = []
                else this.selected = this.desserts.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            initialize() {
                this.showNoData = false
                this.loading = true

                // 排序是可以没有的，如果想强制至少一列总是被排序的，
                // 而不是在升序（sorted ascending）/降序（sorted descending）/不排序（unsorted）的状态之间切换请添加 must-sort = true
                const {sortBy, descending, page, rowsPerPage} = this.pagination
                let whereAttrs = {category: this.search}
                const filterFun = (o => {
                    // 模糊查询
                    return o.category.match(whereAttrs.category)
                })

                getModelPagination(this.pagination, whereAttrs, filterFun).then(result => {
                    if (result.code === 200) {
                        const items = result.data.list
                        const total = result.data.total

                        // setTimeout(() => {
                        this.loading = false
                        this.desserts = items
                        this.totalDesserts = total
                        // }, 1000)
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

            closeDialogDeleteBatch() {
                this.dialogDeleteBatch = false
            },

            saveDelete() {
                deleteModelById(this.editedItem.id).then(result => {
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

            saveDeleteBatch() {
                const ids = this.selected.map(item => item.id)
                deleteModelByIds(ids).then(result => {
                    if (result.code === 200) {
                        this.submitResult = true
                    } else {
                        this.submitResult = false
                    }
                    this.closeDialogDeleteBatch()
                    // 显示结果
                    this.snackbar = true
                    // 每次操作成功后，重新获取数据
                    this.initialize()
                }).catch(err => {
                    this.closeDialogDeleteBatch()
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
                        // 业务需求：判断是否已经存在一模一样的
                        getModelWhere({category: this.editedItem.category, remark: this.editedItem.remark}).then(result => {
                            if (result.code === 200 && result.data.length) {
                                this.submitResult = false
                                this.snackbar = true
                                this.snackbarMsg = 'this category already exists'
                            } else {
                                putModelById(this.editedItem.id, this.editedItem).then(result => {
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
                                    this.snackbarMsg = err.message
                                    // 每次操作成功后，重新获取数据
                                    this.initialize()
                                })
                            }
                        }).catch(err => {
                            this.submitResult = false
                            this.snackbar = true
                            this.snackbarMsg = err.message
                        })
                    } else {
                        // 业务需求：判断是否已经存在
                        getModelWhere({category: this.editedItem.category}).then(result => {
                            if (result.code === 200 && result.data.length) {
                                this.submitResult = false
                                this.snackbar = true
                                this.snackbarMsg = 'this category already exists'
                            } else {
                                postModel(this.editedItem).then(result => {
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
                                    this.snackbarMsg = err.message
                                    // 每次操作成功后，重新获取数据
                                    this.initialize()
                                })
                            }
                        }).catch(err => {
                            this.submitResult = false
                            this.snackbar = true
                            this.snackbarMsg = err.message
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
