<template>
  <div class="business-license-container">
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
        <el-input v-model="tableSearchParams.name" size="mini" placeholder="请输入名称" class="search-input">
          <el-button slot="append" icon="el-icon-search" type="primary" @click="loadTableData">搜索</el-button>
        </el-input>
        <span class="line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="handleRefresh" />
        <el-button size="mini" icon="el-icon-download" />
      </template>
      <template>
        <el-table
          ref="table"
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
          <el-table-column prop="content" label="名称" align="center">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleEdit(row)">{{ row.content.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="营业期限" align="center" width="180">
            <template slot-scope="{row}">
              {{ row.content.businessTerm && row.content.businessTerm[0] || '' }} ~ {{ row.content.businessTerm && row.content.businessTerm[1] || '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
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

    <business-license-form-dialog ref="formDialog" v-model="dialogVisible" :form-id="formId" @save-success="handleRefresh" />
    <business-license-form-dialog-view ref="formDialogView" v-model="dialogVisibleView" :form-id="formId" />
  </div>
</template>

<script>
import _ from 'lodash'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import TableLayout from '@/layout/components/TableLayout'
import Pagination from '@/components/Pagination'
import businessLicenseFormDialog from './components/business-license-form-dialog'
import businessLicenseFormDialogView from './components/business-license-form-dialog-view'
import { bagService } from '@/services'

export default {
  name: 'Bag',
  components: {
    TableLayout,
    Pagination,
    WarningConfirmButton,
    businessLicenseFormDialog,
    businessLicenseFormDialogView
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
        type: 'businessLicense',
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
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        // 对 Table 进行重新布局
        // https://element.eleme.cn/#/zh-CN/component/table#table-methods
        this.$refs.table.doLayout()
      },
      immediate: true
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
      const type = this.tableSearchParams.type
      const name = this.tableSearchParams.name
      try {
        const response = await bagService.getBagListByPage({ page, limit, type, name })
        const { data } = response.data
        this.tableData = data.list
        this.tablePagination.total = data.pagination.total
        this.tableLoading = false
      } catch (e) {
        console.error('bag.getBagListByPage-error:', e)
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
        await bagService.deleteBag({ ids: [row.id] })
        close()
      } catch (e) {
        console.error('bag.deleteBag-error:', e)
        done()
        const errorMessage = e && e.data.message || '发生了一些未知的错误，请重试！'
        this.$message.error(errorMessage)
      }
    },
    // 批量删除
    async handleBulkDelete({ done, close }) {
      try {
        const ids = _.map(this.tableMultipleSelection, 'id')
        await bagService.deleteBag({ ids })
        close()
      } catch (e) {
        console.error('bag.deleteBag-error:', e)
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
