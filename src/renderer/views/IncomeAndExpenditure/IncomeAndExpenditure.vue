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
                    <v-menu
                            single-line
                            v-model="menuTimeStart"
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
                                    style="width: 50px;margin-left: 15px;"
                                    v-model="search.dateStart"
                                    label="Date start"
                                    single-line
                                    hide-details
                                    readonly
                                    v-on="on"
                                    clearable
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                v-model="search.dateStart"
                                @input="menuTimeStart = false"></v-date-picker>
                    </v-menu>
                    <v-menu
                            v-model="menuTimeEnd"
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
                                    style="width: 50px;margin-left: 15px;"
                                    v-model="search.dateEnd"
                                    label="Date End"
                                    single-line
                                    hide-details
                                    readonly
                                    v-on="on"
                                    clearable
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                v-model="search.dateEnd"
                                @input="menuTimeEnd = false"></v-date-picker>
                    </v-menu>
                    <v-spacer></v-spacer>
                    <v-btn color="success" dark class="mb-2" @click="initialize">Search</v-btn>
                    <v-btn color="primary" dark class="mb-2" @click="dialogEdit = true">New Item</v-btn>
                    <v-btn color="error" dark class="mb-2" @click="dialogDeleteBatch = true">Batch Delete</v-btn>
                    <v-btn :loading="exporting" :disabled="exporting" color="purple" @click="exportLocalFile">export
                    </v-btn>
                    <v-btn :loading="importing" :disabled="importing" color="error" @click="importLocalFile">import
                    </v-btn>
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

<script>
    import {
        getModelPagination,
        getModelExport,
        postModel,
        putModelById,
        deleteModelById,
        deleteModelByIds
    } from '../../../api/incomeAndExpenditure'

    import {
        getModelAll as getCategoryAll,
        getModelWhere as getCategoryWhere,
        postModel as postCategory
    } from '../../../api/category'
    import {getModelAll as getAssetsAll} from '../../../api/assets'
    import Excel from 'exceljs'
    import {app, remote, shell} from 'electron'
    import moment from 'moment'
    import fs from 'fs-extra'
    import db from '../../../datastore'

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
                search: {
                    dateStart: '',
                    dateEnd: ''
                },
                pagination: {
                    sortBy: 'createdAt'
                },
                selected: [],
                dialogDeleteBatch: false,
                exporting: false,
                importing: false,
                menuTimeStart: false,
                menuTimeEnd: false,
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
                snackbarMsg: '',
                // 导出路径
                userDataPath: '',
                exportPath: '',
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
            this.getUserDataPath()
            Promise.all([this._getCategoryAll(), this._getAssetsAll()]).then(result => {
                this.initialize()
            })
        },
        methods: {
            getUserDataPath() {
                const APP = process.type === 'renderer' ? remote.app : app
                this.userDataPath = APP.getPath('userData')
                this.exportPath = this.userDataPath + '/export'
            },

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
                // 日期范围判断
                if (this.search.dateStart && this.search.dateEnd) {
                    if (moment(this.search.dateStart).isAfter(moment(this.search.dateEnd))) {
                        this.snackbar = true
                        this.snackbarMsg = 'Please select the correct date range'
                        return
                    }
                }

                this.showNoData = false
                this.loading = true

                // 排序是可以没有的，如果想强制至少一列总是被排序的，
                // 而不是在升序（sorted ascending）/降序（sorted descending）/不排序（unsorted）的状态之间切换请添加 must-sort = true
                const {sortBy, descending, page, rowsPerPage} = this.pagination

                let whereAttrs = {
                    dateStart: this.search.dateStart,
                    dateEnd: this.search.dateEnd
                }
                const filterFun = (o => {
                    let check1, check2 = false

                    if (whereAttrs.dateStart) {
                        if (new Date(o.createdAt) >= new Date(whereAttrs.dateStart)) {
                            check1 = true
                        }
                    } else {
                        check1 = true
                    }

                    if (whereAttrs.dateEnd) {
                        if (new Date(o.createdAt) <= new Date(whereAttrs.dateEnd)) {
                            check2 = true
                        }
                    } else {
                        check2 = true
                    }

                    // 模糊查询
                    return check1 && check2
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

            exportLocalFile() {
                // 日期范围判断
                if (this.search.dateStart && this.search.dateEnd) {
                    if (moment(this.search.dateStart).isAfter(moment(this.search.dateEnd))) {
                        this.snackbar = true
                        this.snackbarMsg = 'Please select the correct date range'
                        return
                    }
                }

                this.exporting = true

                // 创建一个文件
                const workbook = new Excel.Workbook()
                workbook.creator = 'Me'
                workbook.lastModifiedBy = 'Her'
                workbook.created = new Date()
                workbook.modified = new Date()

                // 创建一个工作组
                let sheet = workbook.addWorksheet('Export Data Sheet')

                // 设置默认行高
                sheet.properties.defaultRowHeight = 20;

                // 创建列
                sheet.getRow(1).values = ['Detail', , 'AssetsName', 'CategoryName', 'CreatedAt', 'Remark']
                sheet.getRow(2).values = ['Type', 'AmountOfMoney', 'AssetsName', 'CategoryName', 'CreatedAt', 'Remark']

                // 设置表头样式
                const colorHeader = 'FFDB8B89'
                const rowHeader1 = sheet.getRow(2)
                rowHeader1.eachCell((cell, rowNumber) => {
                    sheet.getColumn(rowNumber).alignment = {vertical: 'middle', horizontal: 'center'}
                    sheet.getColumn(rowNumber).font = {size: 12, family: 2, bold: true}
                    sheet.getColumn(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: colorHeader}
                    }
                    sheet.getColumn(rowNumber).border = {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    }
                })

                // 冻结行
                sheet.views = [{
                    state: 'frozen', ySplit: 2, activeCell: 'A1'
                }]

                // 合并单元格
                sheet.mergeCells('A1:B1')
                sheet.mergeCells('C1:C2')
                sheet.mergeCells('D1:D2')
                sheet.mergeCells('E1:E2')
                sheet.mergeCells('F1:F2')

                // 添加数据项定义
                sheet.columns = [
                    {key: 'type', width: 30},
                    {key: 'amountOfMoney', width: 30},
                    {key: 'assetsName', width: 30},
                    {key: 'categoryName', width: 30},
                    {key: 'createdAt', width: 30},
                    {key: 'remark', width: 60},
                ]

                // 获取数据
                this._getModelExport().then(result => {
                    console.log(result)
                    // 创建行
                    sheet.addRows(result.data)

                    // 创建文件及文件夹
                    const dir = this.exportPath
                    const fileName = moment(new Date()).format('YYYYMMDDHHMMSS') + 'Export.xlsx'
                    const fullPath = dir + '/' + fileName

                    // 如果没有目录则创建
                    fs.ensureDir(dir).then(() => {
                        // 写文件
                        workbook.xlsx.writeFile(fullPath).then(() => {
                            this.exporting = false

                            // 在文件管理器中显示给定的文件,如果可以,'选中'该文件
                            shell.showItemInFolder(dir)
                            // 播放哔哔的声音
                            shell.beep()

                            // 打开文件
                            shell.openItem(fullPath)
                        })
                    }).catch(err => {
                        this.snackbar = true
                        this.snackbarMsg = 'Failed to create folder'
                    })
                }).catch(err => {
                    this.snackbar = true
                    this.snackbarMsg = err.message
                })
            },

            importLocalFile() {
                this.importing = true

                // 弹出文件选择框
                remote.dialog.showOpenDialog({
                    // title: '请选择需要导入的文件',
                    defaultPath: this.exportPath,
                    // buttonLabel: '确认',
                    // 过滤
                    filters: [
                        {name: 'xlsx', extensions: ['xlsx']}
                    ],
                    // 包含功能
                    properties: ['openFile']
                }, (filepaths, bookmarks) => {

                    if (filepaths) {
                        // 读取文件
                        const workbook = new Excel.Workbook()
                        workbook.xlsx.readFile(filepaths[0]).then(() => {
                            // 重新结构化数据
                            let data = []

                            // 获取工作表
                            const worksheet = workbook.getWorksheet(1)
                            // 迭代工作表中具有值的所有行
                            worksheet.eachRow(function (row, rowNumber) {
                                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))
                                // 去掉两行表头
                                if (rowNumber > 2) {
                                    // 重新组织数据，excel无论单元格还是行都是从1开始的
                                    const model = {
                                        type: row.values[1] === 'Income' ? 'i' :'e',
                                        amountOfMoney: row.values[2],
                                        assetsName: row.values[3],
                                        categoryName: row.values[4],
                                        createdAt: moment(row.values[5]).format('YYYY-MM-DD'),
                                        remark: row.values[6],
                                    }

                                    data.push(model)
                                }
                            })
                            // 业务处理
                            // console.log(data)
                            this._importData(data).then(result => {
                                if (result.code === 200) {
                                    this.submitResult = true
                                    this.importing = false
                                    this.snackbar = true
                                    this.snackbarMsg = 'Successfully imported'

                                    // 刷新所有列表
                                    Promise.all([this._getCategoryAll(), this._getAssetsAll()]).then(result => {
                                        this.initialize()
                                    })
                                }
                            }).catch(err => {
                                this.submitResult = false
                                this.importing = false
                                this.snackbar = true
                                this.snackbarMsg = err.message
                            })
                        })
                    } else {
                        this.importing = false
                    }
                })
            },

            _importData(data) {
                return new Promise((resolve, reject) => {
                    try {
                        // TODO:由于没有事物，这里写的乱七八糟，而且直接操作db会比使用自己封装的API方便很多，但不专业

                        data.forEach(item => {
                            const collectionCategory = db.get('category')
                            const collectionAssets = db.get('assets')
                            const collectionIncomeAndExpenditure = db.get('incomeAndExpenditure')
                            const listCategory = collectionCategory.filter({category: item.categoryName}).value()
                            const listAssets = collectionAssets.filter({assetsName: item.assetsName}).value()
                            let categoryId,assetsId
                            if(!listCategory.length) {
                                // 如果没有分类则新建
                                categoryId = collectionCategory.insert({category: item.categoryName, remark:''}).write().id
                            } else  {
                                categoryId = listCategory[0].id
                            }
                            if(!listAssets.length) {
                                // 如果没有资产表则新建
                                assetsId = collectionAssets.insert({assetsName: item.assetsName, assetsDetailed:'', assetsAmountOfMoney: 0}).write().id
                            } else  {
                                assetsId = listAssets[0].id
                            }

                            const model = {
                                categoryId: categoryId,
                                type: item.type,
                                assetsId: assetsId,
                                remark: item.remark,
                                createdAt: item.createdAt,
                                amountOfMoney: item.amountOfMoney,
                            }
                            // 插入主表
                            collectionIncomeAndExpenditure.insert(model).write()

                            // 更新资产表
                            let assetsAmountOfMoney = 0
                            collectionIncomeAndExpenditure.filter({assetsId: model.assetsId}).value().forEach(item => {
                                assetsAmountOfMoney += item.type ==='e' ? -item.amountOfMoney : item.amountOfMoney
                            })
                            collectionAssets.updateById(model.assetsId, {assetsAmountOfMoney: assetsAmountOfMoney}).write()
                        })

                        resolve({
                            code: 200
                        })
                    } catch (err) {
                        return reject({
                            code: 400,
                            message: err.message
                        })
                    }
                })
            },

            _getModelExport() {
                return new Promise((resolve, reject) => {
                    try {
                        let whereAttrs = {
                            dateStart: this.search.dateStart,
                            dateEnd: this.search.dateEnd
                        }
                        const filterFun = (o => {
                            let check1, check2 = false

                            if (whereAttrs.dateStart) {
                                if (new Date(o.createdAt) >= new Date(whereAttrs.dateStart)) {
                                    check1 = true
                                }
                            } else {
                                check1 = true
                            }

                            if (whereAttrs.dateEnd) {
                                if (new Date(o.createdAt) <= new Date(whereAttrs.dateEnd)) {
                                    check2 = true
                                }
                            } else {
                                check2 = true
                            }

                            // 模糊查询
                            return check1 && check2
                        })

                        getModelExport(filterFun).then(result => {
                            // if (result.code === 200 && result.data.length) {
                            // 可以导出空的
                            if (result.code === 200) {
                                let items = result.data

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

                                        if (item.type === 'i') {
                                            item.type = 'Income'
                                        } else {
                                            item.type = 'Expenditure'
                                        }
                                    })
                                }

                                resolve({
                                    code: 200,
                                    data: items
                                })
                            }
                        }).catch(err => {
                            return reject({
                                code: 400,
                                message: err.message
                            })
                        })
                    } catch (err) {
                        return reject({
                            code: 400,
                            message: err.message
                        })
                    }
                })
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
