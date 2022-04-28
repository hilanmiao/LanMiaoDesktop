<template>
  <div class="header-notification" @click="click">
    <template v-if="unreadCount > 0">
      <!--      <el-tooltip :content="`有${unreadCount}条未读消息`" effect="dark" placement="bottom">-->
      <el-badge :value="unreadCount" :max="99" type="primary">
        <svg-icon icon-class="notification" />
      </el-badge>
      <!--      </el-tooltip>-->
    </template>
    <template v-else>
      <svg-icon icon-class="notification" />
    </template>
  </div>
</template>

<script>

export default {
  name: 'Notification',
  props: {
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    click() {
      this.$router.push({ path: '/profile/notification' })
    }
  }
}
</script>

<style lang="scss">
  //.header-notification {
  //  .el-badge__content.is-fixed.is-dot {
  //    right: 8px;
  //    top: 14px;
  //  }
  //}
</style>
<style lang="scss" scoped>
::v-deep .el-badge {
  &:after {
    content:'';
    clear:both;
    overflow:hidden;
    height:0px;
  }
  .el-badge__content {
    top: 12px;
  }
}
</style>
