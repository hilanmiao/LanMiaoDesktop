<template>
  <div class="account-book-container">
    <table-layout class="table-layout">
      <template v-slot:headerLeft>
        <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
        <warning-confirm-button
          button-type="danger"
          :content="`删除账本时所有的收支明细也会一起删除！此操作无法恢复，确认批量删除 ${tableMultipleSelection.length} 条数据？`"
          :closed="handleRefresh"
          @confirm="(o) => { handleBulkDelete(o) }"
        >批量删除</warning-confirm-button>
      </template>
      <template v-slot:headerRight>
        <el-input v-model="tableSearchParams.name" size="mini" placeholder="请输入名称" class="search-input">
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
          <el-table-column prop="name" label="名称" align="center" width="200">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleEdit(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" align="center" width="160" />
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
          <el-table-column prop="updatedAt" label="更新时间" align="center" width="200" />
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <warning-confirm-button
                :closed="handleRefresh"
                content="删除账本时所有的收支明细也会一起删除！此操作无法恢复，是否继续？"
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

    <account-book-form-dialog ref="formDialog" v-model="dialogVisible" :form-id="formId" @save-success="handleRefresh" />
  </div>
</template>

<script>
import _ from 'lodash'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import TableLayout from '@/layout/components/TableLayout'
import Pagination from '@/components/Pagination'
import accountBookFormDialog from './components/account-book-form-dialog'
import { accountBookService } from '@/services'

export default {
  name: 'AccountBook',
  components: {
    TableLayout,
    Pagination,
    WarningConfirmButton,
    accountBookFormDialog
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
        name: ''
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
      const name = this.tableSearchParams.name
      try {
        const response = await accountBookService.getAccountBookListByPage({ page, limit, name })
        const { data } = response.data
        this.tableData = data.list
        this.tablePagination.total = data.pagination.total
        this.tableLoading = false
      } catch (e) {
        console.error('accountBook.getAccountBookListByPage-error:', e)
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
        await accountBookService.deleteAccountBook({ ids: [row.id] })
        close()
      } catch (e) {
        console.error('accountBook.deleteAccountBook-error:', e)
        done()
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 批量删除
    async handleBulkDelete({ done, close }) {
      try {
        const ids = _.map(this.tableMultipleSelection, 'id')
        await accountBookService.deleteAccountBook({ ids })
        close()
      } catch (e) {
        console.error('accountBook.deleteAccountBook-error:', e)
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
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/table-layout.scss";

</style>
