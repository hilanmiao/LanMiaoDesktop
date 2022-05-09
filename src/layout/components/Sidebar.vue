<template>
  <div class="container-sidebar">
    <div class="sidebar-logo">
      <router-link to="/" class="link">
        <img src="@/assets/images/logo.png">
        <h1 class="sidebar-title">招财猫</h1>
      </router-link>
    </div>
    <div class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="active">
            <svg-icon icon-class="home-fill"></svg-icon>
            首页
          </router-link>
        </li>
        <li>
          <router-link to="/account-manage">
            <svg-icon icon-class="money-collect-fill"></svg-icon>
            记账管理
          </router-link>
        </li>
        <li>
          <router-link to="/account-manage/account-book">
            <svg-icon icon-class="book-fill"></svg-icon>
            账本管理
          </router-link>
        </li>
        <li>
          <router-link to="/">
            <svg-icon icon-class="alert-fill"></svg-icon>
            智能提醒
          </router-link>
        </li>
        <li>
          <router-link to="/bag">
            <svg-icon icon-class="wallet-fill"></svg-icon>
            我的卡包
          </router-link>
        </li>
        <li>
          <router-link to="/">
            <svg-icon icon-class="setting-fill"></svg-icon>
            设置
          </router-link>
        </li>
      </ul>
    </div>
    <div class="join">
      <h1>为兴趣敲代码</h1>
      <p>叫上你的小伙伴一起感受开源的乐趣吧！</p>
      <el-button type="primary" size="small">
        <svg-icon icon-class="github-fill"></svg-icon>
        加入我们
      </el-button>
      <img src="@/assets/images/github-com.png">
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  created() {
  },
}
</script>

<style lang="scss" scoped>
.container-sidebar {
  position: relative;
  height: 100%;
  .sidebar-logo {
    height: 60px;
    border-bottom: 1px solid #dfe6ec;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
  }
  .link {
    padding-left: 24px;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    color: #409EFF;
    text-decoration: none;
    img {
      width: 30px;
      height: 30px;
    }
    h1 {
      margin: 0 0 0 12px;
    }
  }

  .sidebar-nav {
    padding-left: 24px;
    padding-top: 20px;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        a {
          position: relative;
          height: 50px;
          color: #303133;
          line-height: 50px;
          font-size: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: 400;
          text-decoration: none;
          &:hover {
            color: #409EFF;
          }
          &.active {
            color: #409EFF;
            &:before {
              content: '';
              position: absolute;
              left: -24px;
              width: 4px;
              height: 50px;
              background-color: #409EFF;
              border-radius: 0 4px 4px 0;
            }
          }
          .svg-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }

  .join {
    background-color: #f8f9fb;
    border-radius: 8px;
    margin: 20px;
    position: absolute;
    bottom: 20px;
    padding: 50px 14px 20px 14px;
    text-align: center;
    h1 {
      margin: 10px 0;
      font-size: 18px;
      color: #303133;
    }
    p {
      font-size: 14px;
      color: #606266;
    }
    .el-button {
      width: 100%;
    }
    img {
      max-width: 100%;
      margin-top: 20px;
      position: absolute;
      top: -70px;
      left: 0;
    }
  }
}
</style>
