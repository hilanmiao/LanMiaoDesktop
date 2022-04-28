<template>
  <div class="icon-body">
    <div class="icon-list">
      <div v-for="(item,index) in svgIcons" :key="index" @click="handleSelectChange(item)">
        <svg-icon :icon-class="item" style="height:30px;width:16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// load svg icon name
const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()
const re = /\.\/(.*)\.svg/
const svgIcons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default {
  name: 'IconSelector',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      svgIcons
    }
  },
  methods: {
    handleSelectChange(v) {
      this.$emit('selected', v)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-body {
  //width: 750px;
  padding: 10px;

  .icon-list {
    overflow: scroll;

    div {
      display: inline-flex;
      width: 25%;
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
    }

    span {
      display: inline-block;
      margin-left: 10px;
      line-height: 30px;
      fill: currentColor;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
