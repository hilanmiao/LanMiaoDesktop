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
        <el-col :span="12">
          <el-form-item label="号牌号码" :label-width="labelWidth" prop="content.plateNo">
            <el-input v-model="form.content.plateNo" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="准驾车型" :label-width="labelWidth" prop="content.vehicleType">
            <el-input v-model="form.content.vehicleType" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌型号" :label-width="labelWidth" prop="content.model">
            <el-input v-model="form.content.model" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆识别代码" label-width="120px" prop="content.vin">
            <el-input v-model="form.content.vin" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号码" :label-width="labelWidth" prop="content.engineNo">
            <el-input v-model="form.content.engineNo" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="labelWidth" prop="content.name">
            <el-input v-model="form.content.name" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册日期" :label-width="labelWidth" prop="content.registerDate">
            <el-date-picker
              v-model="form.content.registerDate"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发证日期" :label-width="labelWidth" prop="content.issueDate">
            <el-date-picker
              v-model="form.content.issueDate"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检验记录" :label-width="labelWidth" prop="content.testRecord">
            <el-input v-model="form.content.testRecord" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行驶证页照片" label-width="auto" prop="content.vehicleLicensePhoto1">
            <el-upload
              class="avatar-uploader"
              action="#"
              accept="image/png, image/jpeg"
              :show-file-list="false"
              :on-success="(response, file, fileList) => handleUploadSuccess(response, file, fileList, 'vehicleLicensePhoto1')"
              :on-error="handleUploadError"
              :on-progress="handleUploadProgress"
              :http-request="(content) => upload(content, 'vehicleLicensePhoto1' )"
            >
              <img v-if="form.content.vehicleLicensePhoto1" :src="VUE_APP_BASE_API + form.content.vehicleLicensePhoto1" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-show="uploadProgressPercentVehicleLicensePhoto1 !== 0" class="progress-wrapper">
                <el-progress type="circle" :percentage="uploadProgressPercentVehicleLicensePhoto1" />
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶证副页照片" label-width="auto" prop="content.vehicleLicensePhoto2">
            <el-upload
              class="avatar-uploader"
              action="#"
              accept="image/png, image/jpeg"
              :show-file-list="false"
              :on-success="(response, file, fileList) => handleUploadSuccess(response, file, fileList, 'vehicleLicensePhoto2')"
              :on-error="handleUploadError"
              :on-progress="handleUploadProgress"
              :http-request="(content) => upload(content, 'vehicleLicensePhoto2' )"
            >
              <img v-if="form.content.vehicleLicensePhoto2" :src="VUE_APP_BASE_API + form.content.vehicleLicensePhoto2" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <div v-show="uploadProgressPercentVehicleLicensePhoto2 !== 0" class="progress-wrapper">
                <el-progress type="circle" :percentage="uploadProgressPercentVehicleLicensePhoto2" />
              </div>
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
        type: 'vehicleLicense',
        content: {
          plateNo: '',
          vehicleType: '',
          model: '',
          vin: '',
          engineNo: '',
          name: '',
          registerDate: '',
          issueDate: '',
          testRecord: '',
          vehicleLicensePhoto1: '',
          vehicleLicensePhoto2: ''
        }
      },
      rules: {
        'content.plateNo': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.vehicleType': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.model': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.vin': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.engineNo': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.name': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.registerDate': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.issueDate': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.testRecord': [{ required: true, message: '必填', trigger: 'blur' }],
        'content.vehicleLicensePhoto1': [{ required: true, message: '必填', trigger: 'change' }],
        'content.vehicleLicensePhoto2': [{ required: true, message: '必填', trigger: 'change' }]
      },
      loading: false,
      saving: false,
      // 图片上传
      uploadProgressPercentVehicleLicensePhoto1: 0,
      uploadProgressPercentVehicleLicensePhoto2: 0,
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
      return this.form.id === '-1' ? '添加行驶证' : '编辑行驶证'
    },
    classUpperCase: {
      get() {
        return this.form.content.class
      },
      set(val) {
        this.form.content.class = val.replace(/[\W]/g, '').toUpperCase()
      }
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
      // this.form.vehicleLicensePhoto1 = response.data.data.url
      this.form.content[customParam] = response.data.data.url
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
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:hover {
      border-color: #409EFF;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .progress-wrapper {
    width: 100%;
    position: absolute;
    height: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-progress {
    position: absolute;
  }
}
</style>
