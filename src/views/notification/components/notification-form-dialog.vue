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
      <el-form-item label="标题" :label-width="labelWidth" prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="发送类型" :label-width="labelWidth" prop="type">
        <el-radio v-model="form.type" label="1">指定用户</el-radio>
        <el-radio v-model="form.type" label="2">全体用户</el-radio>
      </el-form-item>
      <el-form-item v-show="form.type === '1'" label="接收人" :label-width="labelWidth" prop="recipientIds">
        <el-select
          v-model="form.recipientIds"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入用户名或手机号进行模糊检索"
          :remote-method="remoteMethod"
          :loading="loadingSelect"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="`${item.username}_${item.mobile}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" :label-width="labelWidth" prop="cotent">
        <el-input v-model="form.content" autocomplete="off" type="textarea" />
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
import { userService, notificationService } from '@/services'

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
        title: '',
        type: '2',
        recipientIds: '',
        content: '',
        remark: ''
      },
      rules: {
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        type: [{ required: true, message: '必选', trigger: 'change' }]
      },
      loading: false,
      saving: false,
      // 业务属性
      loadingSelect: false,
      userList: []
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
      return this.form.id === '-1' ? '添加通知' : '编辑通知'
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
        // const response = await userService.getUserList()
        // const { data: userList } = response.data
        // this.userList = userList
      } catch (e) {
        console.error('notification.getUserList-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 设置数据
    async setData() {
      try {
        const response = await notificationService.getNotification({ id: this.form.id })
        const { data: notification } = response.data
        const { title, type, recipientIds, content, remark } = notification
        this.form.title = title
        this.form.type = type
        this.form.recipientIds = recipientIds
        this.form.content = content
        this.form.remark = remark
      } catch (e) {
        console.error('notification.getNotification-error:', e)
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
              response = await notificationService.createNotification(formData)
            } else {
              response = await notificationService.updateNotification(formData)
            }
            const { data } = response.data
            console.log(data)
            this.$emit('save-success')
            this.close()
          } catch (e) {
            console.error('notification.submitNotification-error:', e)
            this.done()
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)
          }
        }
      })
    },
    // 远程搜索
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const response = await userService.getUserList({ keyword: query })
          const { data: userList } = response.data
          this.userList = userList
        } catch (e) {
          console.error('notification.getUserList-error:', e)
          const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
          this.$message.error(errorMessage)
          this.loading = false
        }
      } else {
        this.userList = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
