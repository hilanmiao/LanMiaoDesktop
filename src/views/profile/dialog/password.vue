<template>
  <div class="content">

    <el-dialog
      title="修改密码"
      width="500px"
      :visible.sync="dialogFormVisible"
      @close="dialogClose"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        :rules="rules"
        :model="temp"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="temp.oldPassword"
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="temp.newPassword"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="temp.confirmPassword"
            placeholder="确认密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userService } from '@/services'

export default {
  props: {
    passwordDialogFormVisible: {
      default: false,
      type: Boolean,
      required: true
    }
  },
  data() {
    const validatePassConfirm = (rule, value, callback) => {
      if (value !== this.temp.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      temp: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePassConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    passwordDialogFormVisible: {
      handler: function(val, oldVal) {
        this.dialogFormVisible = val
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:passwordDialogFormVisible', false)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const payload = { password: this.temp.oldPassword, passwordNew: this.temp.newPassword }
          userService.putMyPassword(payload).then(() => {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
            // 登出
            this.$store.dispatch('auth/clearAuth')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          }).catch(error => {
            console.error('user.putMyPassword-error:', error)
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
<style lang='scss' scoped>

</style>
