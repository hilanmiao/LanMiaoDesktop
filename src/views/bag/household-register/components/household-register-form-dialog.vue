<template>
  <el-dialog
    :title="title"
    width="50%"
    :close-on-click-modal="true"
    :append-to-body="true"
    :center="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
    @closed="closed"
  >
    <el-form ref="form" label-position="right" :model="form" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" :label-width="labelWidth" prop="content.name">
            <el-input v-model="form.content.name" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="户别" :label-width="labelWidth" prop="content.typeOfHousehold">
            <el-radio v-model="form.content.typeOfHousehold" label="家庭户口">家庭户口</el-radio>
            <el-radio v-model="form.content.typeOfHousehold" label="集体户口">集体户口</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="户号" :label-width="labelWidth" prop="content.householdNo">
            <el-input v-model="form.content.householdNo" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="户口本照片" :label-width="labelWidth" prop="content.householdRegisterPhotoList">
            <el-upload
              class="avatar-uploader"
              action="#"
              accept="image/png, image/jpeg"
              :on-success="(response, file, fileList) => handleUploadSuccess(response, file, fileList, 'householdRegisterPhotoList')"
              :on-error="handleUploadError"
              :on-progress="handleUploadProgress"
              :http-request="(content) => upload(content, 'householdRegisterPhotoList' )"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.content.householdRegisterPhotoList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2Mb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
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
import { bagService, fileService } from '@/services'

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
        type: 'householdRegister',
        content: {
          name: '',
          householdNo: '',
          typeOfHousehold: '家庭户口',
          householdRegisterPhotoList: []
        }
      },
      rules: {
        'content.name': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.householdNo': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.typeOfHousehold': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.householdRegisterPhotoList': [{ required: true, message: '必填', trigger: 'change' }]
      },
      loading: false,
      saving: false,
      // 图片上传
      uploadProgressPercenthouseholdRegisterPhotoList: 0,
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
      return this.form.id === '-1' ? '添加户口本' : '编辑户口本'
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
        const { type, content } = bag
        this.form.type = type
        this.form.content = content
        // 设置显示地址为绝对路径
        this.form.content.householdRegisterPhotoList = this.form.content.householdRegisterPhotoList.map(item => {
          return {
            ...item,
            url: this.VUE_APP_BASE_API + item.url
          }
        })
      } catch (e) {
        console.error('bag.getBag-error:', e)
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
          // 不能传递绝对路径
          formData.content.householdRegisterPhotoList = formData.content.householdRegisterPhotoList.map(item => {
            return {
              ...item,
              url: item.url.replace(this.VUE_APP_BASE_API, '')
            }
          })
          let response = null
          try {
            if (formData.id === '-1') {
              response = await bagService.createBag(formData)
            } else {
              response = await bagService.updateBag(formData)
            }
            const { data } = response.data
            console.log(data)
            this.$emit('save-success')
            this.close()
          } catch (e) {
            console.error('bag.submitBag-error:', e)
            this.done()
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)
          }
        }
      })
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 100

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        return false
      }
      return true
    },
    upload(content, customParam) {
      const checkUpload = this.beforeUpload(content.file)
      if (!checkUpload) {
        return
      }
      console.log(content)
      fileService.upload(content.file.name, content.file, {
        // axios 上传进度事件
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
          // 更新element upload progress
          content.onProgress({ percent: percentCompleted })
          // this.uploadProgressPercent = percentCompleted
          this['uploadProgressPercent' + customParam] = percentCompleted
        }
      }).then(response => {
        content.onSuccess(response)
        setTimeout(() => {
          // this.uploadProgressPercent = 0
          this['uploadProgressPercent' + customParam] = 0
        }, 1000)
      }).catch(error => {
        content.onError(error)
      })
    },
    handleUploadSuccess(response, file, fileList, customParam) {
      file.url = this.VUE_APP_BASE_API + response.data.data.url
      // this.form.householdRegisterPhotoList = response.data.data.url
      this.form.content[customParam] = fileList
      // 移除表单上传组件的校验
      this.clearValidate('content.' + customParam)
    },
    handleUploadError(err) {
      console.log(err)
      this.$message({
        message: '上传失败',
        type: 'error'
      })
    },
    handleUploadProgress(event, file, fileList) {
      console.log(event, file)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>
<style lang="scss" scoped>
//::v-deep .avatar-uploader {
//  .el-upload {
//    border: 1px dashed #d9d9d9;
//    border-radius: 6px;
//    cursor: pointer;
//    position: relative;
//    overflow: hidden;
//    display: inline-flex;
//    align-items: center;
//    justify-content: center;
//    &:hover {
//      border-color: #409EFF;
//    }
//  }
//
//  .avatar-uploader-icon {
//    font-size: 28px;
//    color: #8c939d;
//    width: 178px;
//    height: 178px;
//    line-height: 178px;
//    text-align: center;
//  }
//
//  .avatar {
//    width: 178px;
//    height: 178px;
//    display: block;
//  }
//
//  .progress-wrapper {
//    width: 100%;
//    position: absolute;
//    height: 100%;
//    background: #fff;
//    display: flex;
//    align-items: center;
//    justify-content: center;
//  }
//
//  .el-progress {
//    position: absolute;
//  }
//}
</style>
