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
<!--        <el-badge is-dot class="item">-->
<!--          <el-button circle>-->
<!--            <svg-icon icon-class="notification"/>-->
<!--          </el-button>-->
<!--        </el-badge>-->

        <onlineUsers class="right-menu-item hover-effect badge-container" />

        <notification class="right-menu-item hover-effect" :unread-count="unreadNotifications" />
      </div>
      <div class="container-avatar">
        <el-dropdown class="" trigger="click">
          <div class="box-avatar">
            <img v-if="user.avatar" :src="VUE_APP_BASE_API + user.avatar" class="user-avatar">
            <img v-else src="@/assets/images/logo.png" class="user-avatar">
            <span>{{ user.displayName }}</span>
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
import { mapGetters } from 'vuex'
import OnlineUsers from '@/components/OnlineUsers'
import Notification from '@/components/Notification'

import { authService } from '@/services'

export default {
  components: {
    Notification,
    OnlineUsers
  },
  computed: {
    ...mapGetters([
      'user',
      'unreadNotifications'
    ])
  },
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
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    ::v-deep .el-breadcrumb {
      -webkit-app-region: no-drag;
    }
  }

  .wrapper-center {
    -webkit-app-region: drag;
    padding-left: 60px;
    display: flex;
    align-items: center;
    ::v-deep .el-input {
      -webkit-app-region: no-drag;
      .el-input__inner {
        background-color: #f8f9fb;
        border-radius: 8px;
        border: none;
      }
    }
  }

  .wrapper-right {
    -webkit-app-region: drag;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .container-icon {
      padding-right: 20px;
      display: flex;
      align-items: center;
      height: 100%;
      .right-menu-item {
        height: 100%;
        padding-right: 20px;
        ::v-deep .el-badge {
          -webkit-app-region: no-drag;
          height: 100%;
          display: flex;
          align-items: center;
          .el-badge__content {
            top: 16px;
          }
        }
      }
    }

    .container-avatar {
      padding-left: 20px;
      border-left: 1px solid #dfe6ec;
      height: 100%;
      display: flex;
      align-items: center;
      color: #606266;
      font-weight: bold;
      ::v-deep .el-dropdown {
        -webkit-app-region: no-drag;
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
}
</style>
