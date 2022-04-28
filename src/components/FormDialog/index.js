import FormDialog from './FormDialog'

function install(Vue) {
  if (Vue.prototype.$openFormDialog) {
    return
  }

  const component = Vue.component('form-dialog', FormDialog)

  const FormDialogConstructor = Vue.extend(component)

  const instance = new FormDialogConstructor({
    el: document.createElement('div')
  })

  Vue.prototype.$openFormDialog = instance.open
}

FormDialog.install = install

export default FormDialog
