<template>
  <el-row :gutter="30" class="panel-group">
    <el-col :lg="6" class="card-panel-col">
      <el-card class="box-card">
        <div class="box-title">
          本月支出
        </div>
        <div class="box-content">
          <div class="box-amount">
            ¥<count-to :start-val="0" :end-val="99999" :duration="2600" />
          </div>
          <div class="box-tag">
            <el-tag type="danger" size="small">+ 99%</el-tag>
          </div>
        </div>
        <div class="box-footer">
          上月支出 ¥99999.99
        </div>
      </el-card>
    </el-col>
    <el-col :lg="6" class="card-panel-col">
      <el-card class="box-card">
        <div class="box-title">
          本月收入
        </div>
        <div class="box-content">
          <div class="box-amount">
            ¥<count-to :start-val="0" :end-val="99999" :duration="2600" />
          </div>
          <div class="box-tag">
            <el-tag type="success" size="small">+ 99%</el-tag>
          </div>
        </div>
        <div class="box-footer">
          上月收入 ¥99999.99
        </div>
      </el-card>
    </el-col>
    <el-col :lg="6" class="card-panel-col">
      <el-card class="box-card">
        <div class="box-title">
          净资产
        </div>
        <div class="box-content">
          <div class="box-amount">
            ¥<count-to :start-val="0" :end-val="99999" :duration="2600" />
          </div>
          <div class="box-tag">
            <el-tag type="success" size="small">+ 99%</el-tag>
          </div>
        </div>
        <div class="box-footer">
          上月结余 ¥99999.99
        </div>
      </el-card>
    </el-col>
    <el-col :lg="6" class="card-panel-col">
      <el-card class="box-card">
        <div class="box-title">
          本月记账笔数
        </div>
        <div class="box-content">
          <div class="box-amount">
            <count-to :start-val="0" :end-val="30" :duration="2600" />
          </div>
          <div class="box-tag">
            <el-tag type="success" size="small">+ 99%</el-tag>
          </div>
        </div>
        <div class="box-footer">
          上月记账笔数 30
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .box-card {
    color: #909399;
    border-radius: 8px;
    .box-title {
      font-weight: bold;
    }
    .box-content {
      display: flex;
      align-items: center;
      margin: 18px 0;
      .box-amount {
        color: #303133;
        font-size: 20px;
        font-weight: bold;
      }
      .box-tag {
        margin-left: 20px;
      }
    }
    .box-footer {
      font-size: 14px;
    }
  }
}
</style>
