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
                            label="Search remark"
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
                                <td>{{ props.item.assetsName }}</td>
                                <td>{{ props.item.categoryName }}</td>
                                <td>{{ props.item.type ==='i' ? 'Income' : 'Expenditure' }}</td>
                                <td>{{ props.item.remark }}</td>
                                <td width="130">{{ props.item.createdAt }}</td>
                                <td>{{props.item.type === 'e' ? '-':''}} ${{ props.item.amountOfMoney }}</td>
                                <td class="text-xs-right" width="180">
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
                                    <v-select
                                            :items="assetsList"
                                            item-text="text"
                                            item-value="value"
                                            label="Assets*"
                                            :rules="[rules.required]"
                                            v-model="editedItem.assetsId"
                                    ></v-select>
                                </v-flex>
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
                                    <v-autocomplete
                                            v-model="editedItem.categoryId"
                                            :items="categoryList"
                                            label="Category*"
                                            :rules="[rules.required]"
                                            persistent-hint
                                    >
                                    </v-autocomplete>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="AmountOfMoney*"
                                                  prefix="$"
                                                  type="number"
                                                  step="0.1"
                                                  min="0"
                                                  :rules="[rules.required]"
                                                  v-model="editedItem.amountOfMoney"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-menu
                                            v-model="menuTime"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="editedItem.createdAt"
                                                    label="Time*"
                                                    :rules="[rules.required]"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editedItem.createdAt"
                                                       @input="menuTime = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Remark"
                                                  v-model="editedItem.remark"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <el-upload
                                            class="upload-demo"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove"
                                            :before-remove="beforeRemove"
                                            multiple
                                            :on-exceed="handleExceed"
                                            :file-list="fileList">
                                        <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                        <v-btn color="blue darken-1">Upload</v-btn>
                                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
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

<script type="text/ecmascript-6">
    import {
        getModelPagination,
        postModel,
        putModelById,
        deleteModelById,
        deleteModelByIds
    } from '../../../api/incomeAndExpenditure'

    import {getModelAll as getCategoryAll} from '../../../api/category'
    import {getModelAll as getAssetsAll} from '../../../api/assets'

    export default {
        data() {
            return {
                fileList: [{
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }],
                // 表格相关
                loading: true,
                showNoData: false,
                totalDesserts: 0,
                desserts: [],
                headers: [
                    {text: 'Assets', value: 'assetsId', align: 'left', sortable: true},
                    {text: 'Category', value: 'categoryId', align: 'left', sortable: true},
                    {text: 'Type', value: 'type', align: 'left', sortable: true},
                    {text: 'Remark', value: 'remark', align: 'left', sortable: false},
                    {text: 'Time', value: 'createdAt', align: 'left', sortable: true},
                    {text: 'AmountOfMoney', value: 'amountOfMoney', align: 'left', sortable: true},
                    {text: 'Actions', value: 'id', align: 'right', sortable: false}
                ],
                noDataMessage: '',
                search: '',
                pagination: {
                    sortBy: 'createdAt'
                },
                selected: [],
                dialogDeleteBatch: false,
                // 表单相关
                menuTime: false,
                dialogDelete: false,
                dialogEdit: false,
                valid: true,
                submitResult: false,
                editedIndex: -1,
                editedItem: {
                    categoryId: '',
                    type: '',
                    assetsId: '',
                    remark: '',
                    createdAt: '',
                    amountOfMoney: '',
                },
                defaultItem: {
                    categoryId: '',
                    type: '',
                    assetsId: '',
                    remark: '',
                    createdAt: '',
                    amountOfMoney: '',
                },
                rules: {
                    required: value => !!value || 'Required.',
                },
                assetsList: [],
                categoryList: [],
                typeList: [{text: 'Income', value: 'i'}, {text: 'Expenditure', value: 'e'}],
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
            Promise.all([this._getCategoryAll(), this._getAssetsAll()]).then(result => {
                this.initialize()
            })
        },
        methods: {

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {

            },
            beforeRemove(file, fileList) {

            },

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
                const whereAttrs = {remark: this.search}
                const filterFun = (o => {
                    // 模糊查询
                    return o.remark.match(whereAttrs.remark)
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
                    // 格式化
                    this.editedItem.amountOfMoney = parseFloat(this.editedItem.amountOfMoney)
                    if (this.editedIndex > -1) {
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
                }
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
        left: 15px;
        position: relative;
        align-items: center;
        justify-content: center;
        display: flex;
    }
</style>
