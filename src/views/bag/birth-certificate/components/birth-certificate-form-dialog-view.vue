<template>
  <el-dialog
    :title="title"
    width="60%"
    :close-on-click-modal="true"
    :append-to-body="true"
    :center="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
    @closed="closed"
  >
    <el-descriptions class="margin-top" :column="3" border>
      <el-descriptions-item :span="2">
        <template slot="label">
          姓名
        </template>
        {{ form.content.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          出生时间
        </template>
        {{ form.content.birthTime }}
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template slot="label">
          出生证照片
        </template>
        <el-image :src="VUE_APP_BASE_API + form.content.birthCertificatePhoto1" />
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
import { bagService } from '@/services'
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
      form: {
        content: {}
      }
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
      return '查看出生证'
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
        console.error('bag.getUserList-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 设置数据
    async setData() {
      try {
        const response = await bagService.getBag({ id: this.form.id })
        const { data: bag } = response.data
        this.form = bag
      } catch (e) {
        console.error('bag.getBag-error:', e)
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
  .el-image {
    width: 300px;
    height: 160px;
  }
</style>
