<template>
  <el-card style="margin-bottom:20px;">
    <div class="user-profile">
      <div class="avatar">
        <el-upload
          class="avatar-uploader"
          action="#"
          accept=".jpg,.png,.gif,.jpeg,.JPG,.JPEG,.GIF"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress"
          :http-request="upload"
        >
          <img v-if="user.avatar" :src="VUE_APP_BASE_API + user.avatar" alt="" draggable="false">
          <img v-else src="@/assets/images/logo.png">
          <div class="update-avatar">
            <span>更换头像</span>
          </div>
        </el-upload>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
        <div class="user-role text-center text-muted">
          <i v-if="user.sex === '2'" class="el-icon-male" style="color: deeppink;" />
          <i v-else class="el-icon-female" style="color: deepskyblue;" />
          {{ user.displayName }}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>个性签名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.introduction }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <!--        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>账号管理</span></div>-->
        <div class="user-bio-section-body">
          <el-menu
            default-active="account"
            class=""
          >
            <el-menu-item index="account" @click="activeMenu = 'account'">
              <svg-icon icon-class="link" />
              <strong slot="title">账号绑定</strong>
            </el-menu-item>
            <el-menu-item index="profile" @click="activeMenu = 'profile'">
              <svg-icon icon-class="profile" />
              <strong slot="title">个人信息</strong>
            </el-menu-item>
            <el-menu-item index="operationLog" @click="activeMenu = 'operationLog'">
              <svg-icon icon-class="history" />
              <strong slot="title">操作记录</strong>
            </el-menu-item>
            <el-menu-item index="authenticate" @click="activeMenu = 'authenticate'">
              <svg-icon icon-class="safety-certificate" />
              <strong slot="title">实名认证</strong>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { userService, fileService } from '@/services'

export default {
  components: { },
  props: {},
  data() {
    return {
      activeMenu: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    activeMenu: {
      handler: function(val, oldVal) {
        this.$emit('update:activeMenu', val)
      }
    }
  },
  created() {
    console.log(this.user)
  },
  methods: {
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 10

      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      return true
    },
    upload(content) {
      const checkUpload = this.beforeUpload(content.file)
      if (!checkUpload) {
        return
      }
      console.log(content)
      fileService.uploadAvatar(content.file.name, content.file, {
      // fileObsService.uploadImage(content.file.name, content.file, {
        // axios 上传进度事件
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          console.log(percentCompleted)
          // 更新element upload progress
          content.onProgress({ percent: percentCompleted })
          this.photoProgressPercent = percentCompleted
        }
      }).then(response => {
        content.onSuccess(response.data)
        setTimeout(() => {
          this.photoProgressPercent = 0
        }, 1000)
      }).catch(error => {
        content.onError(error)
      })
    },
    async handleUploadSuccess(response, file) {
      console.log(response)

      // 更新用户头像
      const payload = { avatar: response.data.url }

      try {
        const responseProfile = await userService.updateCurrentUserProfile(payload)
        const { data } = responseProfile.data
        console.log(data)
        // 更新用户信息
        this.$store.commit('auth/SET_USER', data)
      } catch (e) {
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
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
@import "~@/styles/variables.scss";

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    border: 4px solid #d9dde1;
    overflow: hidden;
    height: 100px;
    width: 100px;
    ::v-deep .el-upload {
      display: flex;
      align-items: center;
    }
    img {
      height: 92px;
      width: 92px;
      min-height: 92px;
      min-width: 92px;
      /* 相邻兄弟 */
      &:hover +.update-avatar {
        bottom: 0;
      }
    }
    .update-avatar {
      font-size: 12px;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: -30px;
      transition: bottom .3s;
      text-align: center;
      background: rgba(0,0,0,.6);
      color: #fff;
      line-height: 30px;
      pointer-events: none; /* 阻止鼠标事件 */
    }
  }

  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}

.el-menu {
  border:none;
  .el-menu-item {
    border-radius: 8px 0 0 8px;
    font-size: 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: transparent;
    }
    &:after {
      display: block;
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 28px solid #fff;
      border-bottom: 28px solid #fff;
      border-left: 15px solid transparent;
    }
    &.is-active {
      color: #fff;
      background: $menuActiveBg;
    }

    .svg-icon {
      margin-right: 8px;
    }
  }
}
</style>
