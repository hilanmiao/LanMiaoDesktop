# FormDialog自定义表单弹窗组件说明

## 封装说明

> 提供了更方便的方式来操作表单类型的`el-dialog`。

例子：

``` vue
<template>
	<div>
    <el-button @click="open">打开表单</el-button>
    <form-dialog ref="formDialog">
      <template #slot-type="{ scope }">
        <el-radio-group v-model="scope.type">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">权限</el-radio>
        </el-radio-group>
      </template>
  </form-dialog>
  </div>
</template>

<script>
export default {
  name: 'xxx',
  methods: {
    open() {
      this.$refs.formDialog.open({
        title: '表单标题',
        on: {
          open: (form, { showLoading, hideLoading, $refs, close, rebind }) => {
            // 表单打开时open事件处理
          },
          submit: (form, { close, done, $refs }) => {
            // 点击确定按钮时且表单校验通过的submit事件处理
          }
        },
        // 需要渲染的表单项
        items: [
          {
            label: '菜单类型',
            prop: 'type',
            value: 0,
            rules: {
              required: true,
              message: '请选择菜单类型',
              trigger: 'blur'
            },
            component: 'slot-type'
          },
          {
            label: '名称',
            prop: 'name',
            value: '',
            span: 12,
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入角色名称'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入角色名称'
              }
            }
          },
        ]
      })
    }
  }
}
</script>
```

> 更多案例请查看内置的源代码，所有的表单弹窗功能实现都是使用该组件实现的

## 内置方法

组件内置的一些方法

| 属性           | 说明                              | 参数            | 类型         |
| -------------- | --------------------------------- | --------------- | ------------ |
| open           | 打开表单                          | options         | Object       |
| setFormData    | 响应式设置内置表单form的值        | property, value | String, Any  |
| getFormData    | 获取form表单对应属性的值          | property?       | String, Null |
| rebindFormData | 重新绑定表单的值                  | data            | Object       |
| close          | 关闭表单弹窗                      |                 |              |
| done           | 关闭提交表单确定按钮的loading状态 |                 |              |
| showLoading    | 显示Form表单的loading状态         |                 |              |
| hideLoading    | 关闭Form表单的loading状态         |                 |              |
| validateField  | 等同`el-form`的validateField方法  |                 |              |
| validate       | 等同`el-form`的validateField方法  |                 |              |
| resetFields     | 等同`el-form`的validateField方法  |                 |              |
| clearValidate  | 等同`el-form`的validateField方法  |                 |              |

## open方法参数

| 参数        | 说明                   | 类型            | 可选值 | 默认值     |
| ----------- | ---------------------- | --------------- | ------ | ---------- |
| title       | 表单标题               | String          |        | FormDialog |
| width       | `el-dialog`的宽度      | String          |        | 50%        |
| formProps   | 等同`el-form`的props   | Object          |        |            |
| on          | 表单弹窗事件           | Object          |        |            |
| dialogProps | 等同`el-dialog`的props | Object          |        |            |
| op          | 底部按钮的文本提示     | Object          |        | 保存、取消 |
| items       | `form-item`列表        | `Array<Object>` |        | []         |
| form        | 预制表单项的值         | Object          |        |            |

### on表单事件

| 参数   | 说明               | 类型                                                       | 可选值 | 默认值 |
| ------ | ------------------ | ---------------------------------------------------------- | ------ | ------ |
| open   | 当表单打开时       | function(form, { showLoading, hideLoading, $refs, close }) |        |        |
| close  | 关闭窗口时触发     | function({ close })                                        |        |        |
| submit | 表单校验通过后触发 | function(data, { done, close, $refs })                     |        |        |

### op底部按钮配置参数

| 参数             | 说明         | 类型   | 可选值 | 默认值 |
| ---------------- | ------------ | ------ | ------ | ------ |
| saveButtonText   | 提交表单按钮 | String |        | 保存   |
| cancelButtonText | 取消按钮     | String |        | 取消   |

### items表单项配置

| 参数      | 说明                                               | 类型              | 可选值 | 默认值 |
| --------- | -------------------------------------------------- | ----------------- | ------ | ------ |
| prop      | 对应form字段                                       | String            |        |        |
| value     | 表单默认值，可对应组件 `component` 的 `v-model`    | Any               |        |        |
| label     | `el-form-item`中的label                            | String            |        |        |
| rules     | 单项表单校验规则                                   | Object            |        |        |
| span      | 等同于`el-col`的span参数                           | Number            | [0-24] | 24     |
| hidden    | 是否需要隐藏该表单项，隐藏时提交时无法获取该项的值 | Boolean, Function |        |        |
| component | 组件渲染，支持插槽，函数、或createElement参数      | String, Object    |        |        |

### hidden隐藏项配置

可传入`Boolean`或`Function`值。当为`true`时则该项会隐藏。

如果传入的是一个函数，那么函数会或者一个`{ scope }`参数，返回值需返回成一个布尔值，否则无意义，`scope`值为当前表单的值，例如一项配置：

``` javascript
{
  label: '结束日期',
  prop: 'endTime',
  value: '',
  hidden: ({ scope }) => {
    return scope.type === 1
  },
  component: {
    name: 'el-date-picker',
    props: {
      type: 'datetime'
    },
    style: {
      width: '100%'
    },
    attrs: {
      placeholder: '请选择结束日期'
    }
  }
}
```

### component组件渲染方式

> 请先了解createElement 参数，具体查看 [vue 文档](https://cn.vuejs.org/v2/guide/render-function.html)

#### 全局注册的组件

``` js
{
	// 组件标签名
	name: 'el-input',
	// 与 `v-bind:class` 的 API 相同，
	// 接受一个字符串、对象或字符串和对象组成的数组
	'class': {
		foo: true,
		bar: false
	},
	// 与 `v-bind:style` 的 API 相同，
	// 接受一个字符串、对象，或对象组成的数组
	style: {
		color: 'red',
		fontSize: '14px'
	},
	// 普通的 HTML attribute
	attrs: {
		id: 'foo'
	},
	// 组件 prop
	props: {
		myProp: 'bar'
	},
	// DOM property
	domProps: {
		innerHTML: 'baz'
	},
	// 事件监听器在 `on` 内，
	// 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
	// 需要在处理函数中手动检查 keyCode。
	on: {
		click: this.clickHandler
	},
	// 仅用于组件，用于监听原生事件，而不是组件内部使用
	// `vm.$emit` 触发的事件。
	nativeOn: {
		click: this.nativeClickHandler
	},
	// 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
	// 赋值，因为 Vue 已经自动为你进行了同步。
	directives: [
		{
		name: 'my-custom-directive',
		value: '2',
		expression: '1 + 1',
		arg: 'foo',
		modifiers: {
			bar: true
		}
		}
	],
	// 作用域插槽的格式为
	// { name: props => VNode | Array<VNode> }
	scopedSlots: {
		default: props => createElement('span', props.text)
	},
	// 如果组件是其它组件的子组件，需为插槽指定名称
	slot: 'name-of-slot',
	// 其它特殊顶层 property
	key: 'myKey',
	ref: 'myRef',
	// 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
	// 那么 `$refs.myRef` 会变成一个数组。
	refInFor: true
}
```

> 只需要加多个name值的属性，其余等同createElement的参数

#### 作用域插槽方式

`name` 必须以 `slot-` 开头, 如 slot-name。插槽名称必须与 `name` 一致，`scope`为对应的内置表单数据对象

``` html
<form-dialog ref="formDialog">
	<template #slot-type="{ scope }">
		<el-radio-group v-model="scope.type">
		<el-radio :label="0">目录</el-radio>
		<el-radio :label="1">菜单</el-radio>
    <el-radio :label="2">权限</el-radio>
   </el-radio-group>
  </template>
</form-dialog>
```

``` js
{
	label: '昵称',
	prop: 'name',
  value: '',
	component: 'slot-type'
}
```

> 请注意，使用插槽方式，如子组件定义了ref属性，open方法及submit方法中的$refs是无法获取到插槽下的ref属性。如需获取ref请不要使用插槽方式

#### 函数式

- `h` 为 createElement
- `scope` 作为表单数据或者行数据

``` js
{
	label: '菜单权限',
	prop: 'menus',
	span: 12,
	value: { data: [] },
	component: function(h, { scope }) {
	return h('el-tree', {
				class: { 'role-form-dialog-tree-container': true },
				props: {
					data: scope.menus.data,
					'show-checkbox': true,
					'node-key': 'id',
					'highlight-current': true,
					props: {
						children: 'children',
						label: 'label'
					}
				},
				ref: 'menuTree'
			})
	}
}
```



