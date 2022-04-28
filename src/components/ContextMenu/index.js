import ContextMenu from './ContextMenu'

function install(Vue) {
  if (Vue.prototype.$openContextMenu) {
    return
  }

  const component = Vue.component('s-context-menu', ContextMenu)

  const ContextMenuConstructor = Vue.extend(component)

  const instance = new ContextMenuConstructor({
    el: document.createElement('div')
  })

  Vue.prototype.$openContextMenu = instance.show
}

ContextMenu.install = install

export default ContextMenu
