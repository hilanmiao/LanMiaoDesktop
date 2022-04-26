<template>
  <div class="component-account-register">
    <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="60px">
      <el-form-item label="手机" prop="mobile">
        <el-input ref="mobile" v-model="form.mobile" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model="form.real_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model="form.company" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="form.position" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">立即注册</el-button>
        <el-button @click="$emit('reg-result', false)">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { userService } from '@/services'
import { validMobile } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      form: {
        mobile: '',
        real_name: '',
        company: '',
        position: '',
        email: ''
      },
      rules: {
        mobile: [{ required: true, message: '', trigger: 'blur', validator: validateMobile }],
        real_name: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() { },
  mounted() {
    if (this.form.mobile === '') {
      this.$refs.mobile.focus()
    }
  },
  destroyed() { },
  methods: {
    handleRegister() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          userService.postRegister(this.form).then(() => {
            this.$emit('reg-result', true)
            this.$message({
              message: '注册成功，初始密码已通过手机短信发送',
              type: 'success'
            })
          }).catch(error => {
            console.error('user.postRegister-error:', error)
            this.$message({
              message: error.data.message,
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
