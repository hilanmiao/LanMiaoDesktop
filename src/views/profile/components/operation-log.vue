<template>
  <div class="">
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录信息" min-width="400px" align="left">
        <template slot-scope="{row}">
          <!--          <pre>{{ JSON.parse(row.content) }}</pre>-->
          <vue-json-pretty
            :deep="0"
            :data="JSON.parse(row.content)"
          />

        </template>
      </el-table-column>
      <el-table-column label="备注" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import VueJsonPretty from 'vue-json-pretty'

// import { loginLogService } from '@/services'

export default {
  components: { Pagination, VueJsonPretty },
  filters: {

  },
  props: {},

  data() {
    return {
      // 列表相关
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      // loginLogService.getMyLog(this.listQuery).then(response => {
      //   this.list = response.data.rows
      //   this.total = response.data.count
      //   this.listLoading = false
      // }).catch(error => {
      //   console.error('loginLog.getList-error:', error)
      //   this.listLoading = false
      //   this.$message({
      //     message: '获取列表失败',
      //     type: 'error'
      //   })
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
