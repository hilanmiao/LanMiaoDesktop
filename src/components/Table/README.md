# Table 重封装组件说明

## 封装说明

> 基础的使用方式与 API 与 官方基本一致，在其基础上，封装了加载数据的方法。
>
> 你无需在你是用表格的页面进行分页逻辑处理，仅需向 Table 组件传递绑定 `:data-request="Promise"` 对象即可。
>
> 自带刷新，导出表格数据到excel，以及列排序显示隐藏

例子：

``` vue
<template>
  <s-table
    ref="table"
    :data-request="getList"
    :show-pagination="true"
    stripe
  >
    <el-table-column prop="nickName" label="呢称" width="160" align="center" />
    <el-table-column prop="email" label="邮箱" align="center" width="300" />
    <el-table-column prop="phone" label="手机" align="center" width="300" />
    <el-table-column prop="remark" label="备注" align="center" width="300" />
    <el-table-column prop="status" label="状态" align="center" width="100">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === 1 ? 'success' : 'danger'"
          effect="dark"
          size="small"
          >{{ scope.row.status === 1 ? "启用" : "禁用" }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" align="center" width="120">
      <template slot-scope="scope">
        <el-button
          type="text"
          size="small"
          @click.stop="handleEdit(scope.row)"
          >操作</el-button
        >
    </el-table-column>
  </s-table>
</template>

<script>
export default {
  components: {
    STable,
  },
  methods: {
    async getList({ page, limit }) {
      const { data } = await apiGet({ page, limit })
      return { list: data.list, pagination: { total: data.pagination.total }}
    }
  }
}
</script>
```

## 内置方法

| 属性        | 说明                       | 参数    | 类型   |
| ----------- | -------------------------- | ------- | ------ |
| refresh     | 刷新当前表格 | init | Boolean |
| getData | 获取原始数据 |         |        |
| getTable | 获取真正的`el-table`实例对象 |         |        |

> 注意：要调用 `refresh(bool)` 需要给表格组件设定 `ref` 值
>
> `refresh()` 方法可以传一个 `bool` 值，当有传值 或值为 `true` 时，则刷新时会强制刷新到第一页（常用户页面 搜索 按钮进行搜索时，结果从第一页开始分页）

## 内置属性

除去`el-table`自带属性外，还而外提供了一些额外属性属性

| 属性            | 说明                                            | 类型     | 默认值            |
| :-------------- | :---------------------------------------------- | -------- | ----------------- |
| dataRequest     | 加载数据方法 必须为 `Promise` 对象 **必须绑定** | Promise  | -                 |
| showPagination  | 显示分页选择器                                  | boolean  | false             |
| currentPage     | 同el-pagination属性                             | number   | 1                 |
| pageSize        | 同el-pagination属性                             | number   | 10                |
| pageSizes       | 同el-pagination属性                             | array    | [10, 20, 50, 100] |
| exportFileName  | 导出的文件名                                    | string   | 导出数据          |
| exportBookType  | xlsx的booktype                                  | string   | xlsx              |
| exportAutoWidth | 自动宽度                                        | boolean  | true              |
| exportFormatter | 自定义数据导出格式                              | function |                   |

##额外的插槽

使用`prepend`插槽可以在表格顶部增加一些内容，例如放一些操作的按钮

```vue
<template v-slot:prepend>
 <el-button size="mini" type="primary" :disabled="!$auth('sysMenu.add')" @click="handleAdd">新增</el-button>
</template>
```

## 注意事项

`dataRequest`中返回的值必须遵循该格式，如

``` json
{
    list: [],
    pagination: {
        total: 10
    }
}
```

如果需要修改可自行修改源码来更改