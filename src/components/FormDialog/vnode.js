import { isFunction, isObject, cloneDeep, isString } from 'lodash'

export function renderVNode(vnode, { scope, $scopedSlots, prop }) {
  // get h
  const h = this.$createElement

  if (!vnode) {
    return null
  }
  // 插槽
  if (isString(vnode) && vnode.startsWith('slot-')) {
    // template
    const s = $scopedSlots[vnode]
    if (s) {
      return s({ scope })
    } else {
      throw new Error(`can not find this slot：${vnode}`)
    }
  }

  // render函数
  if (isFunction(vnode)) {
    return vnode(h, { scope })
  }

  // createElement 参数对象
  if (isObject(vnode)) {
    if (vnode.context) {
      return vnode
    }

    if (vnode.name) {
      const data = cloneDeep(vnode)

      // https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象
      const keys = [
        'class',
        'style',
        'props',
        'attrs',
        'domProps',
        'on',
        'nativeOn',
        'directives',
        'scopedSlots',
        'slot',
        'key',
        'ref',
        'refInFor'
      ]

      for (const key in data) {
        if (!keys.includes(key)) {
          delete data[key]
        }
      }

      if (scope) {
        if (!data.props) {
          data.props = {}
        }

        if (!data.on) {
          data.on = {}
        }

        // bind domProps value
        data.props.value = scope[prop]

        const onInput = data.on.input

        data.on.input = (val) => {
          // watch
          this.$set(scope, prop, val)

          if (onInput) {
            onInput(val)
          }
        }
      }

      return h(vnode.name, data)
    } else {
      throw new Error('component name can not be empty')
    }
  }
}
