<template>
  <div class="box-list">
    <div class="item" v-for="i in 10" :key="i">
      <div class="left">
        12:00
      </div>
      <div class="right">
        <div class="title">
          结婚纪念日
        </div>
        <div class="date">
          2022-01-01
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.list = [

    ]
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.box-list {
  height: 250px;
  overflow: auto;
  .item {
    border-bottom: 1px solid #dfe6ec;
    display: flex;
    align-items: center;
    color: #303133;
    padding: 8px;
    &:first-child {
      padding-top: 0;
    }
    .left {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right {
      padding-left: 20px;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .date {
        font-size: 14px;
        color: #909399;
        padding-top: 6px;
      }
    }
  }
}
</style>
