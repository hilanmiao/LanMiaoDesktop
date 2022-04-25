<template>
  <el-table :data="list" size="mini" max-height="250">
    <el-table-column label="分类" width="150">
      <template slot-scope="scope">
        <el-avatar size="small">
          <svg-icon icon-class="car" />
        </el-avatar>
        {{ scope.row.category }}
      </template>
    </el-table-column>
    <el-table-column label="时间" width="100" align="left">
      <template slot-scope="scope">
        {{ scope.row.date }}
      </template>
    </el-table-column>
    <el-table-column label="备注" align="left">
      <template slot-scope="scope">
        ¥{{ scope.row.remark }}
      </template>
    </el-table-column>
    <el-table-column label="金额" width="100" align="left">
      <template slot-scope="{row}">
        <el-tag type="danger" size="mini">
         -{{ row.amount }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.list = [
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
      {
        category: '餐饮美食',
        date: '2022-04-21',
        remark: '谷德十三太保套餐',
        amount: '99.99'
      },
    ]
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  ::v-deep .cell {
    display: flex;
    align-items: center;
    .el-avatar {
      margin-right: 8px;
    }
  }
}
</style>
