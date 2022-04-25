<template>
  <div class="box-list">
    <div class="item" v-for="i in 6" :key="i">
      <div class="left">
        {{ i }}
      </div>
      <div class="content">
        餐饮美食
      </div>
      <div class="right">
        ¥999.99
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
    font-weight: bold;
    &:first-child {
      padding-top: 0;
    }
    &:nth-child(-n+3) {
      .left {
        background-color: orangered;
        color: #fff;
      }
    }
    .left {
      width: 30px;
      height: 30px;
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
      border-radius: 4px;
    }
    .content {
      font-size: 18px;
      padding-left: 20px;
      flex: 1;
    }
    .right {
      color: #909399;
    }
  }
}
</style>
