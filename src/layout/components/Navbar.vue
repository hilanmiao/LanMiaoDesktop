<template>
  <div class="container-navbar">
    <div class="wrapper-left">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">
          <svg-icon icon-class="home-fill"></svg-icon>
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrapper-center">
      <el-input
          size="medium"
          placeholder="请输入内容"
          prefix-icon="el-icon-search">
      </el-input>
    </div>
    <div class="wrapper-right">
      <div class="container-icon">
        <el-badge is-dot class="item">
          <el-button circle>
            <svg-icon icon-class="notification"/>
          </el-button>
        </el-badge>
      </div>
      <div class="container-avatar">
        <el-dropdown class="" trigger="click">
          <div class="box-avatar">
            <img src="@/assets/images/logo.png" class="user-avatar">
            <span>张国栋</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/profile">
              <el-dropdown-item>
                个人中心
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services'

export default {
  components: {},
  computed: {},
  created() {
  },
  methods: {
    async logout() {
      authService.logout()
          .then(response => {
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
          .catch(e => {
            console.error('MainHeader.logout-error:', e)
            const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
            this.$message.error(errorMessage)

            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-navbar {
  height: 100%;
  display: flex;

  .wrapper-left {
    display: flex;
    align-items: center;
  }

  .wrapper-center {
    padding-left: 60px;
    display: flex;
    align-items: center;
    ::v-deep .el-input__inner {
      background-color: #f8f9fb;
      border-radius: 8px;
      border: none;
    }
  }

  .wrapper-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .container-icon {
      padding-right: 20px;
    }

    .container-avatar {
      padding-left: 20px;
      border-left: 1px solid #dfe6ec;
      height: 100%;
      display: flex;
      align-items: center;
      color: #606266;
      font-weight: bold;

      .box-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #dbcfbd;
          border: 2px solid #ede1d3;
        }

        span {
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
