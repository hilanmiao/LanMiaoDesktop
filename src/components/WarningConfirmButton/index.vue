<template>
  <el-button
    :size="size"
    :type="buttonType"
    :disabled="disabled"
    @click.stop="_handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'WarningConfirmButton',
  props: {
    content: {
      type: String,
      default: '此操作无法恢复，是否继续？'
    },
    title: {
      type: String,
      default: '警告'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    iconType: {
      type: String,
      default: 'warning',
      validator: function(v) {
        return ['success', 'info', 'warning', 'error'].indexOf(v) !== -1
      }
    },
    size: {
      type: String,
      default: 'mini'
    },
    buttonType: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closed: {
      type: Function,
      default: function() {
        return () => {}
      }
    },
    cancel: {
      type: Function,
      default: function() {
        return () => {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    _handleClick() {
      this.$confirm(this.content, this.title, {
        confirmButtonText: this.confirmButtonText,
        cancelButtonText: this.cancelButtonText,
        type: this.iconType,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$emit('confirm', {
              close: () => {
                instance.confirmButtonLoading = false
                done()
              },
              done: () => {
                console.log(111)
                instance.confirmButtonLoading = false
              }
            })
          } else {
            // 取消时手动自动关闭加载
            instance.confirmButtonLoading = false
            done()
          }
        }
      })
        .then(act => {
          console.log(222)
          this.closed()
        })
        .catch(e => {
          this.cancel()
        })
    }
  }
}
</script>
