<template>
  <div class="login-container">
    <canvas-star-background />
    <div class="box">
      <div class="color-wrap">
        <div class="box-color" />
      </div>
      <div class="box-image">
        <img src="@/assets/images/login-left.png" alt="">
      </div>
      <el-card class="box-card">
        <div class="left" />
        <div class="right">
          <div class="box-title">
            <img src="@/assets/images/logo.png" alt="" class="logo">
            <div class="info">
              <span class="title">Smart Miao</span>
              <span class="sub-title">您的私人理财专家</span>
            </div>
          </div>
          <account-login />
          <div class="box-bottom">
            <div class="social">

            </div>
            <div class="register">
              <span>没有账号？</span>
              <el-button type="text" @click="dialogFormVisible = true">马上注册</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="请填写真实信息" :visible.sync="dialogFormVisible" width="400px">
      <register @reg-result="regResult" />
    </el-dialog>
  </div>
</template>

<script>
import CanvasStarBackground from '@/components/CanvasStarBackground'
import accountLogin from './components/account-login'
import register from './components/register'

export default {
  name: 'Login',
  components: { accountLogin, CanvasStarBackground, register },
  data() {
    return {
      redirect: undefined,
      otherQuery: {},
      dialogFormVisible: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    if (this.$route.query.action === 'register') {
      this.dialogFormVisible = true
    }
  },
  destroyed() {
  },
  methods: {
    go(uri) {
      location.href = uri
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    regResult(result) {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  $loginWidth: 660px;
  $loginHeight: 380px;
  $colorExtraHeight: 40px;
  $imageExtraWidth: 40px;
  $borderRadius: 8px;
  $formPaddingLeft: 30px;

  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    /*background-image: radial-gradient(circle,#99CCCC, #7171B7);*/
    background: url("../../assets/images/login-background.jpg") no-repeat;
    background-size: 100% 100%;

    .box {
      position: relative;
    }

    .color-wrap {
      filter: drop-shadow(-1px 1px 10px #79BBFF );
    }

    .box-color {
      width: calc(#{$loginWidth}/2);
      height: calc(#{$loginHeight} + #{$colorExtraHeight});
      position: absolute;
      background-image: linear-gradient(to bottom , #409EFF , #B3D8FF);
      margin-top: calc(-#{$colorExtraHeight}/2);
      border-radius: $borderRadius;
      clip-path: polygon(0 0,75% 0,95% 100%, 0px 100%)
    }

    .box-image {
      position: absolute;
      height: $loginHeight;
      width: calc(#{$loginWidth}/2 + #{$imageExtraWidth}/2);
      display: flex;
      align-items: center;
      margin-left: -40px;
      img {
        max-width: 100%;
      }
    }

    .box-title {
      display: flex;
      align-items: center;
      padding: 20px 0;
      .logo {
        height: 44px;
        width: 44px;
      }
      .info {
        padding-left: 6px;
        display: flex;
        flex-direction: column;
        .title {
          font-size: 20px;
          color: #303133;
          font-weight: bold;
        }
        .sub-title {
          font-size: 12px;
          padding-top: 2px;
          color: #909399;
        }
      }
    }

    .box-card {
      height: $loginHeight;
      width: $loginWidth;
      border-radius: $borderRadius;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);

      .left {
        flex: 1;
      }

      .right {
        flex: 1;
        padding-left: calc(#{$formPaddingLeft}/2);
        padding-right: calc(#{$formPaddingLeft}/2);
      }
    }

    .box-bottom {
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .register {
        font-size: 14px;
        color: #909399;
      }
    }
  }
</style>

<style lang="scss">
  .login-container {
    .el-card__body {
      width: 100%;
      height: 100%;
      display: flex;
    }

    .component-account-login, .component-note-login {

      .el-input {
        height: 40px;
        line-height: 40px;

        input {
          height: 40px;
          line-height: 40px;
          padding-left: 35px;
        }
      }

      .el-input__prefix {
        width: 30px;
        color: #889aa4;
      }

      .el-input__suffix {
        width: 30px;
        color: #889aa4;
      }
    }
  }
</style>
