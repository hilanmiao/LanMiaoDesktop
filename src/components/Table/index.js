import styles from './index.module.scss'
import { Table as T } from 'element-ui'
import ColumnSettingPopover from './column-setting-popover'
import { findIndex, isEmpty } from 'lodash'
import { export_json_to_excel } from '@/vendor/Export2Excel'

/**
 * Common Table
 */
export default {
  components: {
    ColumnSettingPopover
  },
  data() {
    return {
      // force re draw table
      tableKey: 1,
      localLoading: false,
      localPagination: Object.assign({}, {
        background: true,
        layout: 'total, sizes, prev, pager, next',
        total: 0,
        pageSizes: this.pageSizes,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }),
      localDataSource: [],
      // record sort
      theaderItems: []
    }
  },
  props: Object.assign({}, T.props, {
    dataRequest: {
      type: Function,
      required: true
    },
    // 分页配置
    showPagination: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 50, 100]
      }
    },
    // excel导出配置
    exportFileName: {
      type: String,
      default: '导出数据'
    },
    exportBookType: {
      type: String,
      default: 'xlsx'
    },
    exportAutoWidth: {
      type: Boolean,
      default: true
    },
    exportFormatter: {
      type: Function,
      default: null
    }
  }),
  created() {
    // init
    this.theaderItems = this.getTotalTheaderItem().map(e => ({ ...e, checked: true }))
    // 加载数据
    this.loadData()
  },
  watch: {
    'localPagination.pageSize': function(s) {
      this.loadData()
    },
    'localPagination.currentPage': function(p) {
      this.loadData()
    }
  },
  methods: {
    /**
     * 手动刷新数据
     */
    refresh(init = false) {
      if (init) {
        // 重置当前页面
        this.localPagination.currentPage = 1
      }
      this.loadData()
    },
    /**
     * 获取表格绑定的数据
     */
    getData() {
      return this.localDataSource
    },
    /**
     * 获取真正的Table示例
     */
    getTable() {
      return this.$refs.table
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     */
    loadData() {
      this.localLoading = true
      const params = this.showPagination ? { page: this.localPagination.currentPage, limit: this.localPagination.pageSize } : null
      const result = this.dataRequest(params)
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(res => {
          // props中的dataRequest必须返回一个Promise，且返回的数据结构需要满足 { list, pagination: { total } }
          this.localDataSource = res.list

          if (this.showPagination) {
            this.localPagination.total = res.pagination.total
          }

          this.localLoading = false
        }).catch(e => {
          // 抛出异常时也需要关闭loading
          this.localLoading = false
        })
      }
    },
    // pageSize 改变时会触发
    onSizeChange(size) {
      this.localPagination.pageSize = size
    },
    // currentPage 改变时会触发
    onCurrentChange(current) {
      this.localPagination.currentPage = current
    },
    // init header sort pane
    getTotalTheaderItem() {
      if (this.$slots['default']) {
        return this.$slots['default']
          .filter(
            vnode =>
              vnode &&
              vnode.componentOptions &&
              vnode.componentOptions.tag === 'el-table-column' &&
              vnode.componentOptions.propsData &&
              vnode.componentOptions.propsData.type !== 'selection'
          )
          .map(vnode => ({
            prop: vnode.componentOptions.propsData.prop,
            label: vnode.componentOptions.propsData.label,
            fixed: isEmpty(vnode.componentOptions.propsData.fixed)
              ? ''
              : vnode.componentOptions.propsData.fixed === true ||
                vnode.componentOptions.propsData.fixed === 'left'
                ? 'left'
                : 'right'
          }))
      } else {
        return []
      }
    },
    exportDataToExcel() {
      if (this.exportFormatter) {
        const { header, data } = this.exportFormatter(this.theaderItems, this.localDataSource)
        if (isEmpty(header) || isEmpty(data)) {
          return
        } else {
          export_json_to_excel({
            header,
            data,
            filename: this.exportFileName,
            bookType: this.exportBookType,
            autoWidth: this.exportAutoWidth
          })
        }
      } else {
        const theaders = this.theaderItems.filter((e) => {
          // 过滤没有prop的数据
          if (isEmpty(e.prop)) {
            return false
          }
          return e.checked
        })
        export_json_to_excel({
          header: theaders.map(e => e.label),
          data: this.localDataSource.map(v => theaders.map(header => {
            return v[header.prop]
          })),
          filename: this.exportFileName,
          bookType: this.exportBookType,
          autoWidth: this.exportAutoWidth
        })
      }
    },
    getColumnVnodeIndex(vnode) {
      const index = findIndex(this.theaderItems, (e) => { return e.label === vnode.componentOptions.propsData.label })
      // if (vnode.componentOptions.propsData.fixed || vnode.componentOptions.propsData.fixed === 'left') {
      //   return -100 + index
      // } else if (vnode.componentOptions.propsData.fixed === 'right') {
      //   return 100 + index
      // }
      return index
    },
    // reader sort
    renderHeaderSelectionIcon() {
      return (
        <column-setting-popover {...{ props: { value: this.theaderItems }, on: {
          'input': (val) => {
            this.theaderItems = val
            this.tableKey += 1
          }
        }}} />
      )
    }
  },
  render() {
    // table props 遍历
    let tableProps = {}
    Object.keys(T.props).forEach(k => {
      (this[k] !== undefined && this[k] !== null) && (tableProps[k] = this[k])
      return tableProps[k]
    })

    // 合并默认配置，统一样式，页面也可单独定制
    tableProps = Object.assign({
      size: 'small',
      headerCellStyle: {
        backgroundColor: '#ebeef4'
      }
    }, tableProps, { data: this.localDataSource })

    // table slot
    const tableColumns = (this.$slots['default'] || []).filter((vnode) => {
      const label = vnode.componentOptions.propsData.label
      const index = findIndex(this.theaderItems, (e) => { return e.label === label })
      // has type always true
      if (isEmpty(vnode.componentOptions.propsData.type)) {
        return this.theaderItems[index].checked
      } else {
        return true
      }
    }).sort((preVnode, nextVnode) => {
      const preIndex = this.getColumnVnodeIndex(preVnode)
      const nextIndex = this.getColumnVnodeIndex(nextVnode)
      return preIndex - nextIndex
    })
    const tableAppend = this.$slots['append'] || ''

    return (
      <div class={styles['sf-table-wrapper']}>
        {/* header */}
        <div {...{ props: { type: 'flex' }}} class={styles['sf-table-header']}>
          <div class={styles['prepend-box']}>
            {this.$slots['prepend'] || ''}
          </div>
          <div class={styles['tb-option-box']}>
            {/* 刷新按钮 */}
            <el-tooltip {...{ props: { placement: 'top', content: '刷新' }}}>
              <i class='el-icon-refresh-right' { ...{ on: { click: this.refresh }} } />
            </el-tooltip>
            {/* 导出表格 */}
            <el-tooltip {...{ props: { placement: 'top', content: '导出表格数据' }}}>
              <i class='el-icon-upload2' { ...{ on: { click: this.exportDataToExcel }} } />
            </el-tooltip>
            {/* header选择排序栏 */}
            <el-tooltip {...{ props: { placement: 'top', content: '列设置' }}}>
              {this.renderHeaderSelectionIcon()}
            </el-tooltip>
          </div>
        </div>
        {/* table */}
        <div class={styles['sf-table-content']}>
          <el-table {...{ key: this.tableKey, props: { ...tableProps }, on: {
            'row-click': (row, column, event) => { this.$emit('row-click', row, column, event) },
            'selection-change': (selection) => { this.$emit('selection-change', selection) },
            'row-contextmenu': (row, column, event) => { this.$emit('row-contextmenu', row, column, event) }
          },
          ref: 'table',
          directives: [{ name: 'loading', value: this.localLoading }] }}>
            {/* {Object.keys(this.$slots).map(name => (this.$slots[name]))} */}
            {tableColumns}
            {tableAppend}
          </el-table>
        </div>
        {/* pagination */}
        { this.showPagination ? (<div class={styles['sf-table-pagination']}>
          <el-pagination {...{
            props: { ...this.localPagination },
            on: {
              'size-change': this.onSizeChange,
              'current-change': this.onCurrentChange
            }
          }} />
        </div>) : '' }
      </div>
    )
  }
}
