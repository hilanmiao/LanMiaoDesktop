<template>
  <div>
    <div class="title">
      账号绑定
      <span class="tips">
        完成
        <b class="danger">3/4</b>
      </span>
    </div>
    <el-divider />
    <div class="item-box">
      <div class="left">
        <svg-icon icon-class="mail" />
      </div>
      <div class="center">
        <p class="subtitle">
          <strong>邮箱</strong> {{ user.email }}
          <span v-if="user.email">已设置</span>
          <span v-else class="unbound">未设置</span>
        </p>
        <p class="content">可用邮箱加密码登录，可用邮箱找回密码</p>
      </div>
      <div class="right">
        <el-button v-if="user.email" round>更改</el-button>
        <el-button v-else round type="primary">绑定</el-button>
      </div>
    </div>
    <el-divider />
    <div class="item-box">
      <div class="left">
        <svg-icon icon-class="mobile" />
      </div>
      <div class="center">
        <p class="subtitle">
          <strong>手机</strong>
          <span>{{ user.mobile }}</span>
          <span>已设置</span>
        </p>
        <p class="content">可用手机号加密码登录，可通过手机号找回密码</p>
      </div>
      <div class="right">
        <el-button v-if="user.mobile" round>更改</el-button>
        <el-button v-else round type="primary">绑定</el-button>
      </div>
    </div>
    <el-divider />
    <div class="item-box">
      <div class="left">
        <svg-icon icon-class="lock" />
      </div>
      <div class="center">
        <p class="subtitle">
          <strong>密码</strong>
          <span>已设置</span>
        </p>
        <p class="content">用于保护账号信息和登录安全</p>
      </div>
      <div class="right">
        <el-button round @click="passwordDialogFormVisible = true">更改</el-button>
      </div>
    </div>
    <el-divider />
    <div class="item-box">
      <div class="left">
        <svg-icon icon-class="link" />
      </div>
      <div class="center">
        <p class="subtitle"><strong>社交账号</strong></p>
        <p class="content">绑定第三方账号，可以直接登录，还可以将内容同步到以下平台，与更多好友分享</p>
      </div>
    </div>
    <div class="social">
      <div class="item">
        <div class="left">
          <svg-icon class="github" icon-class="github" />
        </div>
        <div class="right">
          <p class="brand"><strong>Github</strong></p>
          <p class="info unbound">未绑定</p>
          <el-button size="mini" type="primary">添加绑定</el-button>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <svg-icon class="wechat" icon-class="wechat" />
        </div>
        <div class="right">
          <p class="brand"><strong>微信</strong></p>
          <p class="info">已绑定 毛毛虫</p>
          <el-button size="mini">解除绑定</el-button>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <svg-icon class="dingtalk" icon-class="dingtalk" />
        </div>
        <div class="right">
          <p class="brand"><strong>钉钉</strong></p>
          <p class="info">已绑定 毛毛虫</p>
          <el-button size="mini">解除绑定</el-button>
        </div>
      </div>
    </div>

    <password :password-dialog-form-visible.sync="passwordDialogFormVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import password from '../dialog/password'

export default {
  components: { password },
  props: {

  },
  data() {
    return {
      passwordDialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  $unbound-color: #f01414;

  .title {
    font-size: 16px;
    font-weight: 700;

    .tips {
      font-size: 12px;
      color: #93999f;
      margin-left: 18px;
      font-weight: 400;
      b {
        color: #EF1300!important;
        font-weight: bold;
      }
    }
  }

  .item-box {
    display: flex;
    height: 50px;
    align-items: center;
    > .left {
      display: flex;
      align-items: center;
      padding: 0 30px;
      width: 100px;
      justify-content: center;
      .svg-icon {
        color: #C0C4CC;
        width: 3em;
        height: 3em;
      }
    }
    .center {
      flex: 1;
      p {
        margin: 0;
      }
      .subtitle {
        color: #2b333b;
        font-size: 14px;
        padding-bottom: 6px;
        strong {
          font-size: 16px;
        }
        span {
          padding-left: 4px;
          &.unbound {
            color: $unbound-color;
          }
        }
      }
      .content {
        color: #93999f;
        font-size: 14px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      padding: 0 30px;
    }
  }

  .social {
    padding-left: 100px;
    padding-top: 30px;
    padding-bottom: 30px;
    display: flex;
    .item {
      display: flex;
      padding-right: 60px;
      .left {
        color: #c8cdd2;
        display: flex;
        align-items: center;
        padding-right: 14px;
        justify-content: center;
        .svg-icon {
          &.github {
            color: #303133;
          }
          &.wechat {
            color: #1BB723;
          }
          &.dingtalk {
            color: #4494F0;
          }
        }
      }
      .right {
        p {
          margin: 0;
        }
        .brand {
          font-size: 16px;
        }
        .info {
          font-size: 12px;
          color: #71777d;
          padding-top: 6px;
          padding-bottom: 6px;
          &.unbound {
            color: $unbound-color;
          }
        }
      }
    }
  }
</style>
