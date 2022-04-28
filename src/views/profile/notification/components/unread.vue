<template>
  <div class="notification-container-unread">
    <table-layout class="table-layout">
      <template v-slot:headerLeft>
        <el-button size="mini" type="primary" @click="handleBulkRead">批量已读</el-button>
      </template>
      <template v-slot:headerRight>
        <el-button size="mini" icon="el-icon-refresh" @click="handleRefresh" />
        <el-button size="mini" icon="el-icon-download" />
      </template>
      <template>
        <el-table
          v-loading="tableLoading"
          class="has-checkbox"
          :data="tableData"
          size="small"
          :header-cell-style="{ backgroundColor: '#ebeef4' }"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="30" fixed="left" />
          <el-table-column type="selection" align="center" width="30" fixed="left" />
          <el-table-column prop="title" label="标题" align="center">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleView(row)">{{ row.notification.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="managerName" label="发送人" align="center" width="100">
            <template slot-scope="{row}">
              {{ row.notification.managerUser.username }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" width="200">
            <template slot-scope="{row}">
              {{ row.notification.remark }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleView(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-slot:pagination>
        <pagination v-show="tablePagination.total>0" :total="tablePagination.total" :page.sync="tablePagination.currentPage" :limit.sync="tablePagination.pageSize" @pagination="loadTableData" />
      </template>
    </table-layout>

    <notification-form-dialog-view ref="formDialogView" v-model="dialogVisibleView" :form-id="formId" @save-success="handleRefresh" />
  </div>
</template>

<script>
import _ from 'lodash'
import TableLayout from '@/layout/components/TableLayout'
import Pagination from '@/components/Pagination'
import notificationFormDialogView from '@/views/notification/components/notification-form-dialog-view'
import { notificationService } from '@/services'

export default {
  name: 'Notification',
  components: {
    TableLayout,
    Pagination,
    notificationFormDialogView
  },
  data() {
    return {
      // 列表相关
      tableData: [],
      tableLoading: false,
      tablePagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableSearchParams: {
        isRead: '0'
      },
      tablePaginationDefault: null,
      tableSearchParamsDefault: null,
      tableMultipleSelection: [],
      // 导出配置
      // 表单相关
      dialogVisibleView: false,
      formId: '-1'
    }
  },
  created() {
    this.loadTableData()
    // 拷贝默认值
    this.tablePaginationDefault = _.cloneDeep(this.tablePagination)
    this.tableSearchParamsDefault = _.cloneDeep(this.tableSearchParams)
  },
  destroyed() {
    this.tablePaginationDefault = null
    this.tableSearchParamsDefault = null
  },
  methods: {
    // 加载表格数据
    async loadTableData() {
      this.tableLoading = true
      const page = this.tablePagination.currentPage
      const limit = this.tablePagination.pageSize
      const isRead = this.tableSearchParams.isRead
      try {
        const response = await notificationService.getNotificationListByPageMine({ page, limit, isRead })
        const { data } = response.data
        this.tableData = data.list
        this.tablePagination.total = data.pagination.total
        this.tableLoading = false
      } catch (e) {
        console.error('notification.getNotificationListByPage-error:', e)
        this.tableLoading = false
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 多选框选择事件
    handleSelectionChange(selection) {
      this.tableMultipleSelection = selection
    },
    // 刷新表格数据
    handleRefresh() {
      // 重置
      this.tablePagination = _.cloneDeep(this.tablePaginationDefault)
      this.tableSearchParams = _.cloneDeep(this.tableSearchParamsDefault)

      this.loadTableData()
    },
    // 批量已读
    async handleBulkRead() {
      try {
        const ids = _.map(this.tableMultipleSelection, 'id')
        await notificationService.readNotification({ ids })
        this.handleRefresh()
      } catch (e) {
        console.error('notification.readNotification-error:', e)
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 详情
    handleView(row) {
      this.formId = row.notification.id
      this.dialogVisibleView = true
      // 设置为已读
      try {
        notificationService.readNotification({ ids: [row.id] }).then(() => {
          // 重新获取未读消息统计
          this.$store.dispatch('notification/countMyUnreadNotification')
        })
      } catch (e) {
        console.error('notification.readNotification-error:', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/table-layout.scss";

</style>
