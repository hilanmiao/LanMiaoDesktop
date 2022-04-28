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
    <el-descriptions class="margin-top" :column="3" border>
      <el-descriptions-item :span="3">
        <template slot="label">
          标题
        </template>
        {{ form.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          接收人
        </template>
        {{ form.recipientUser && form.recipientUser.username || '' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          发送人
        </template>
        {{ form.managerUser && form.managerUser.username || '' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          发送时间
        </template>
        {{ form.createdAt }}
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template slot="label">
          备注
        </template>
        {{ form.remark }}
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template slot="label">
          内容
        </template>
        {{ form.content }}
      </el-descriptions-item>
    </el-descriptions>
    <div slot="footer" class="dialog-footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="close">关 闭</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { notificationService } from '@/services'
import _ from 'lodash'

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
      form: {}
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
      return '查看通知'
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
      // 编辑
      await this.setData()
    },
    // 初始化数据事件等
    async init() {
      try {
        this.form.id = this.formId
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
        this.form = notification
      } catch (e) {
        console.error('notification.getNotification-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 关闭回调
    close() {
      this.$emit('save-success')
      this.visible = false
    },
    // 关闭回调
    closed() {
      // 重置form
      this.form = _.cloneDeep(this.defaultForm)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
