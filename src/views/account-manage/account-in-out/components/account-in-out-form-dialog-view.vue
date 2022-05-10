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
    <el-descriptions class="margin-top" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          账本
        </template>
        {{ form.accountBook && form.accountBook.name || '' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          收支分类
        </template>
        {{ form.accountInOutCategory && form.accountInOutCategory.name || '' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          金额
        </template>
        {{ form.type === 'out' ? '-' : '+' }}{{ form.amount }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          创建时间
        </template>
        {{ form.createdAt }}
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          备注
        </template>
        {{ form.remark }}
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
import { accountInOutService } from '@/services'
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
      return '查看收支明细'
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
        console.error('accountInOut.getUserList-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 设置数据
    async setData() {
      try {
        const response = await accountInOutService.getAccountInOut({ id: this.form.id })
        const { data: accountInOut } = response.data
        this.form = accountInOut
      } catch (e) {
        console.error('accountInOut.getAccountInOut-error:', e)
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
