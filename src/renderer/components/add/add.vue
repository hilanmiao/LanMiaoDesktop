<template>
    <v-layout>
        <v-btn
                color="orange"
                fixed
                bottom
                right
                fab
                @click="dialogShow = true"
        >
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialogShow" max-width="600px">
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
    import {mapActions} from 'vuex'
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
        name: "add",
        data: () => ({
            dialogShow: false,
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
        }),
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            '$store.state.dialogAdd.dialogAddShow'(newVal) {
                this.dialogShow = newVal
            },
            dialogShow(newVal) {
                this.updateDialog(newVal)
            },
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
        // computed: {
        //     dialogShow: {
        //         get() {
        //             console.log('computed get ')
        //             return this.$store.getters.dialogAddShow
        //         },
        //         set(value) {
        //             alert('computed set ' + value)
        //             this.updateDialog(value)
        //         }
        //     }
        // },
        mounted() {
            this._getCategoryAll()
            this._getAssetsAll()
        },
        methods: {
            ...mapActions([
                'updateDialog',
            ]),
            closeDialogEdit() {
                // 重新设置验证结果
                this.valid = true
                this.dialogShow = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
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
                        }).catch(err => {
                            this.submitResult = false
                            // 显示结果
                            this.snackbar = true
                            this.snackbarMsg = err.message
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
                        }).catch(err => {
                            this.submitResult = false
                            // 显示结果
                            this.snackbar = true
                            this.snackbarMsg = err.message
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

</style>
