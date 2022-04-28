<template>
  <div class="notification-container">
    <table-layout class="table-layout">
      <template v-slot:headerLeft>
        <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
        <warning-confirm-button
          button-type="danger"
          :content="`确认批量删除 ${tableMultipleSelection.length} 条数据？`"
          :closed="handleRefresh"
          @confirm="(o) => { handleBulkDelete(o) }"
        >批量删除</warning-confirm-button>
      </template>
      <template v-slot:headerRight>
        <el-input v-model="tableSearchParams.title" size="mini" placeholder="请输入标题" class="search-input">
          <el-button slot="append" icon="el-icon-search" type="primary" @click="loadTableData">搜索</el-button>
        </el-input>
        <span class="line">|</span>
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
          <el-table-column prop="title" label="标题" align="center" width="200">
            <!--            <template slot-scope="{row}">-->
            <!--              <span class="link-type" @click="handleEdit(row)">{{ row.title }}</span>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column prop="title" label="接收人" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.type === '1'">{{ row.recipientUser && row.recipientUser.username || '' }}</el-tag>
              <el-tag v-else type="danger">全体用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="managerName" label="已读/未读" align="center">
            <template slot-scope="{row}">
              <template v-if="row.type === '1'">
                <el-tag v-if="!row.readCount" type="info">未读</el-tag>
                <el-tag v-else type="success">已读</el-tag>
              </template>
              <template v-else>
                <el-tag v-if="!row.readCount" type="info">未读</el-tag>
                <el-tag v-else type="success">已读 {{ row.readCount }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="managerName" label="发送人" align="center">
            <template slot-scope="{row}">
              {{ row.managerUser && row.managerUser.username || '' }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
          <!--          <el-table-column prop="updatedAt" label="更新时间" align="center" width="200" />-->
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <!--        最好是不要更新，而是删除并发送新的通知，社会      -->
              <!--              <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>-->
              <el-button size="mini" type="text" @click="handleView(scope.row)">详情</el-button>
              <warning-confirm-button
                :closed="handleRefresh"
                @confirm="(o) => { handleDelete(scope.row, o) }"
              >删除</warning-confirm-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-slot:pagination>
        <pagination v-show="tablePagination.total>0" :total="tablePagination.total" :page.sync="tablePagination.currentPage" :limit.sync="tablePagination.pageSize" @pagination="loadTableData" />
      </template>
    </table-layout>

    <notification-form-dialog ref="formDialog" v-model="dialogVisible" :form-id="formId" @save-success="handleRefresh" />
    <notification-form-dialog-view ref="formDialogView" v-model="dialogVisibleView" :form-id="formId" />
  </div>
</template>

<script>
import _ from 'lodash'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import TableLayout from '@/layout/components/TableLayout'
import Pagination from '@/components/Pagination'
import notificationFormDialog from './components/notification-form-dialog'
import notificationFormDialogView from './components/notification-form-dialog-view'
import { notificationService } from '@/services'

export default {
  name: 'Notification',
  components: {
    TableLayout,
    Pagination,
    WarningConfirmButton,
    notificationFormDialog,
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
        title: ''
      },
      tablePaginationDefault: null,
      tableSearchParamsDefault: null,
      tableMultipleSelection: [],
      // 导出配置
      // 表单相关
      dialogVisible: false,
      dialogVisibleView: false,
      formId: '-1'
    }
  },
  created() {
    // this.sync()
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
      const title = this.tableSearchParams.title
      try {
        const response = await notificationService.getNotificationListByPage({ page, limit, title })
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
    // 新增
    handleAdd() {
      this.formId = '-1'
      this.dialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.formId = row.id
      this.dialogVisible = true
    },
    // 删除
    async handleDelete(row, { done, close }) {
      try {
        await notificationService.deleteNotification({ ids: [row.id] })
        close()
      } catch (e) {
        console.error('notification.deleteNotification-error:', e)
        done()
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 批量删除
    async handleBulkDelete({ done, close }) {
      try {
        const ids = _.map(this.tableMultipleSelection, 'id')
        await notificationService.deleteNotification({ ids })
        close()
      } catch (e) {
        console.error('notification.deleteNotification-error:', e)
        done()
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 详情
    handleView(row) {
      this.formId = row.id
      this.dialogVisibleView = true
    }
    // async sync() {
    //   try {
    //     await notificationService.syncNotification()
    //   } catch (e) {
    //     console.error('notification.deleteNotification-error:', e)
    //     const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
    //     this.$message.error(errorMessage)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/table-layout.scss";

</style>
