<template>
  <div class="component-account-login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <svg-icon slot="prefix" icon-class="user" class="icon" />
        </el-input>
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="账号"
            :type="passwordType"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="lock" class="icon" />
            <svg-icon
              slot="suffix"
              class="icon password"
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-invisible'"
              @click="showPwd"
            />
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="verifyCode" class="captcha">
        <el-input
          :key="passwordType"
          ref="verifyCode"
          v-model="loginForm.verifyCode"
          placeholder="验证码"
          name="verifyCode"
          tabindex="3"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="safety-certificate" class="icon" />
          <img
            slot="suffix"
            :src="captchaImageBase64"
            @click="handleRefreshCaptcha"
          >
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        登&nbsp;&nbsp;&nbsp;录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { authService, commonService } from '@/services'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名只能包含数字和字母'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    const validatecaptchaCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入合法的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        verifyCode: '',
        captchaId: ''
      },
      captchaImageBase64: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validatecaptchaCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  created() {
    this.handleRefreshCaptcha()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {

  },
  methods: {
    go(uri) {
      location.href = uri
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.loading) {
        return
      }
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            await authService.login(this.loginForm)
            // this.loading = false
            this.$router.push({ path: this.redirect || '/' }).catch(() => {
            })
          } catch (e) {
            console.error('login.login-error:', e)
            this.loading = false
            const { code } = e.data
            // 验证码不正确
            if (code && code === 20106) {
              await this.handleRefreshCaptcha()
            }
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)
          }
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    async handleRefreshCaptcha() {
      try {
        const response = await commonService.getImageCaptcha({ width: 100, height: 50 })
        const { data } = response.data
        this.loginForm.captchaId = data.id
        this.captchaImageBase64 = data.img
      } catch (e) {
        console.error('login.getImageCaptcha-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.icon.password {
  cursor: pointer;
}

.captcha {
  ::v-deep .el-input__suffix {
    width: auto !important;
    .el-input__suffix-inner {
      img {
        height: 90%;
        cursor: pointer;
      }
    }
  }
}

</style>
