<template>
  <el-card :style="{ border: 'none', margin: '20px' }">
    <el-container :class="{ 'fixed-height': !wrap }">
      <el-aside v-if="$slots.asside" :width="assideWidth">
        <slot name="asside" />
      </el-aside>
      <el-container>
        <el-main>
          <div class="table-container">
            <div class="table-layout-header">
              <div class="left">
                <slot name="headerLeft" />
              </div>
              <div class="right">
                <slot name="headerRight" />
              </div>
            </div>
            <div
              class="table-layout-content"
              :class="{ 'fixed-table-height': !wrap }"
            >
              <slot />
            </div>
            <div v-if="$slots.pagination" class="table-layout-pagination">
              <slot name="pagination" />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
export default {
  name: 'TableLayout',
  props: {
    assideWidth: {
      type: String,
      default: '200px'
    },
    wrap: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
// 重置main padding
// overflow：auto 可解决flex-direction: row 子宽度超出问题
.el-main {
  padding: 0;
}

.table-container {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .table-layout-content {
    box-sizing: border-box;
  }

  .fixed-table-height {
    flex: 1;
    overflow: auto;
  }

  .table-layout-header {
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      align-items: center;
    }
  }

  .table-layout-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}

.fixed-height {
  /* padding top + bottom = 40px + NavBar 50px + el-card padding = 40px */
  height: calc(100vh - 40px - 50px - 40px - 34px);

  .el-container {
    height: 100%;

    .table-container {
      height: 100%;
    }
  }
}
</style>
