<template>
  <el-dialog
    :title="title"
    width="50%"
    :close-on-click-modal="false"
    :append-to-body="true"
    :center="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
    @closed="closed"
  >
    <el-form ref="form" label-position="right" :model="form" :rules="rules">
      <el-form-item label="账本" :label-width="labelWidth" prop="accountBookId">
        <el-select
          v-model="form.accountBookId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in accountBookList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收支分类" :label-width="labelWidth" prop="accountInOutCategoryId">
        <el-select
          v-model="form.accountInOutCategoryId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in accountInOutCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收支" :label-width="labelWidth" prop="type">
        <el-radio v-model="form.type" label="out">支</el-radio>
        <el-radio v-model="form.type" label="in">收</el-radio>
      </el-form-item>
      <el-form-item label="金额" :label-width="labelWidth" prop="amount">
        <el-input v-model="form.amount" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="备注" :label-width="labelWidth" prop="remark">
        <el-input v-model="form.remark" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" :loading="saving" @click="submit">确 定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import { accountBookService, accountInOutCategoryService, accountInOutService } from '@/services'

export default {
  components: {

  },
  model: {
    prop: 'dialogVisible',
    event: 'close'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    formId: {
      type: String,
      default: '-1'
    }
  },
  data() {
    return {
      // 通用属性
      labelWidth: '100px',
      defaultForm: null,
      form: {
        id: '',
        accountInOutCategoryId: '',
        accountBookId: '',
        type: 'out',
        amount: 0,
        remark: ''
      },
      rules: {
        accountBookId: [{ required: true, message: '必选', trigger: 'change' }],
        accountInOutCategoryId: [{ required: true, message: '必选', trigger: 'change' }],
        amount: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      loading: false,
      saving: false,
      // 业务属性
      accountBookList: [],
      accountInOutCategoryList: []
    }
  },
  computed: {
    visible: {
      get() {
        // 父组件向下传递dialogVisible的值时通过计算属性赋值到visible
        return this.dialogVisible
      },
      set() {
        // 当dialog关闭时，会触发this.visible = false，从而来到这个方法，我们在这里将关闭事件同步给父组件
        this.$emit('close', false)
      }
    },
    title() {
      return this.form.id === '-1' ? '添加收支明细' : '编辑收支明细'
    }
  },
  created() {
    // 拷贝form默认值
    this.defaultForm = _.cloneDeep(this.form)
  },
  destroyed() {
    this.defaultForm = null
  },
  methods: {
    // 打开回调
    async open() {
      await this.init()
      // 添加
      if (this.form.id === '-1') return
      // 编辑
      await this.setData()
    },
    // 初始化数据事件等
    async init() {
      try {
        this.form.id = this.formId
        const response = await accountBookService.getAccountBookList()
        const { data: accountBookList } = response.data
        this.accountBookList = accountBookList

        const responseCategory = await accountInOutCategoryService.getAccountInOutCategoryList()
        const { data: accountInOutCategoryList } = responseCategory.data
        this.accountInOutCategoryList = accountInOutCategoryList
      } catch (e) {
        console.error('accountInOut.getAccountBookList-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 设置数据
    async setData() {
      try {
        const response = await accountInOutService.getAccountInOut({ id: this.form.id })
        const { data: accountInOut } = response.data
        const { accountBookId, accountInOutCategoryId, type, amount, remark } = accountInOut
        this.form.accountBookId = accountBookId
        this.form.accountInOutCategoryId = accountInOutCategoryId
        this.form.type = type
        this.form.amount = amount
        this.form.remark = remark
      } catch (e) {
        console.error('accountInOut.getAccountInOut-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 关闭回调
    close() {
      this.visible = false
      this.saving = false
      this.loading = false
      this.clearValidate()
    },
    // 关闭回调
    closed() {
      // 重置form
      this.form = _.cloneDeep(this.defaultForm)
    },
    // 完成
    done() {
      this.saving = false
    },
    // 检验表单
    validate(callback) {
      if (this.$refs.form) {
        this.$refs.form.validate(callback)
      }
    },
    // 重置表单
    resetFields() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    // 移除表单校验
    clearValidate(props) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate(props)
      }
    },
    // 提交
    submit() {
      // 提交前处理

      // 提交通用处理
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saving = true
          const formData = _.cloneDeep(this.form)
          let response = null
          try {
            if (formData.id === '-1') {
              response = await accountInOutService.createAccountInOut(formData)
            } else {
              response = await accountInOutService.updateAccountInOut(formData)
            }
            const { data } = response.data
            console.log(data)
            this.$emit('save-success')
            this.close()
          } catch (e) {
            console.error('accountInOut.submitAccountInOut-error:', e)
            this.done()
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
