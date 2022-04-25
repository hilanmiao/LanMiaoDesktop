<template>
  <div class="dashboard-container">
    <panel-group />

    <el-row :gutter="30" style="margin-top:30px;">
      <el-col :lg="16">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>近12个月统计</span>
            <div>
<!--              <el-select v-model="value" size="mini" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in options"-->
<!--                  :key="item.value"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value"-->
<!--                />-->
<!--              </el-select>-->
              <el-button size="mini" icon="el-icon-more" circle style="margin-left: 16px;" />
            </div>
          </div>
          <line-chart :chart-data="lineChartData" />
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>类别排名</span>
            <div>
<!--              <el-select v-model="value" size="mini" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in options"-->
<!--                  :key="item.value"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value"-->
<!--                />-->
<!--              </el-select>-->
              <el-button size="mini" icon="el-icon-more" circle style="margin-left: 16px;" />
            </div>
          </div>
          <ranking style="height: 300px;" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="30" style="margin-top:30px;">
      <el-col :lg="16">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>收支记录</span>
            <div>
<!--              <el-select v-model="value" size="mini" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in options"-->
<!--                  :key="item.value"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value"-->
<!--                />-->
<!--              </el-select>-->
              <el-button size="mini" icon="el-icon-more" circle style="margin-left: 16px;" />
            </div>
          </div>
          <transaction-table />
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>智能提醒</span>
            <el-button size="mini" icon="el-icon-more" circle />
          </div>
          <alerts />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TransactionTable from './components/TransactionTable'
import Alerts from './components/Alerts'
import Ranking from './components/Ranking'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105],
    actualData: [120, 82, 91, 154, 162, 140, 145, 120, 82, 91, 154, 162]
  }
}

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    TransactionTable,
    Alerts,
    Ranking
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      options: [{
        value: '1',
        label: '我的账本'
      }],
      value: '1'
    }
  },
  computed: {},
  created() {
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  //padding: 30px;

  .box-card {
    color: #909399;
    border-radius: 8px;

    .box-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
