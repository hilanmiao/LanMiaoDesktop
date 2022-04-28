<template>
  <div class="">
    <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px" width="460">
      <el-form-item label="昵称">
        <el-input v-model="form.displayName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.mobile" placeholder="请输入" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入" disabled />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.introduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.sex" label="1">男</el-radio>
        <el-radio v-model="form.sex" label="2">女</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { userService } from '@/services'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  filters: {

  },
  props: {},

  data() {
    return {
      form: {
        displayName: '',
        sex: '',
        introduction: ''
      },
      rules: {

      },
      saving: false
    }
  },

  computed: {
    ...mapGetters([
      'user'
    ])
  },

  watch: {
    // user: {
    //   handler: (val, oldVal) => {
    //     this.form.display_name = val.display_name
    //     this.form.mobile = val.mobile
    //     this.form.introduction = val.introduction
    //     this.form.sex = val.sex
    //   },
    //   deep: true
    // }
  },

  created() {
    this.form.displayName = this.user.display_name
    this.form.mobile = this.user.mobile
    this.form.email = this.user.email
    this.form.introduction = this.user.introduction
    this.form.sex = this.user.sex
  },

  methods: {
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
            response = await userService.updateCurrentUserProfile(formData)
            const { data } = response.data
            console.log(data)
            // 更新用户信息
            this.$store.commit('auth/SET_USER', data)
            this.saving = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } catch (e) {
            console.error('profile.submitRole-error:', e)
            this.saving = false
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .page-user {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
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
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width {
    .el-button--mini {
      padding: 7px 10px;
      width: auto;
    }
  }
</style>
