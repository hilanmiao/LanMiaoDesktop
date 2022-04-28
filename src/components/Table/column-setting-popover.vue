<template>
  <el-popover width="280" placement="bottom-end">
    <el-checkbox-group v-model="checkedList" @change="handleChange">
      <draggable
        :value="value"
        draggable=".s-table-column-setting-item"
        handle=".handle"
        @input="handleSort"
      >
        <div
          v-for="element in value"
          :key="element.label"
          class="s-table-column-setting-item"
        >
          <i class="el-icon-rank handle" />
          <el-checkbox class="checkbox" :label="element.label" />
          <span class="fixed-op">
            <el-tooltip placement="top" content="固定在左侧">
              <i
                class="el-icon-download"
                :class="{ active: element.fixed === 'left' }"
              />
            </el-tooltip>
            <el-tooltip placement="top" content="固定在右侧">
              <i
                class="el-icon-download"
                :class="{ active: element.fixed === 'right' }"
              />
            </el-tooltip>
          </span>
        </div>
      </draggable>
    </el-checkbox-group>
    <i slot="reference" class="el-icon-setting" />
  </el-popover>
</template>

<script>
import draggable from 'vuedraggable'
import { difference, clone, findIndex } from 'lodash'

export default {
  name: 'ColumnSettingPopover',
  components: {
    draggable
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkedList: this.value.map(e => e.label)
    }
  },
  methods: {
    handleSort(newList) {
      this.$emit('input', newList)
    },
    handleChange(checked) {
      const normal = this.value.map(e => e.label)
      // diff出来的是不需要显示的，其余都需要显示
      const diff = difference(normal, checked)
      const newList = clone(this.value)
      for (let i = 0; i < normal.length; i++) {
        const position = findIndex(diff, notCheckdLable => {
          return notCheckdLable === normal[i]
        })
        newList[i].checked = position === -1
      }
      this.$emit('input', newList)
    }
  }
}
</script>

<style lang="scss" scoped>
.s-table-column-setting-item {
  padding: 4px 0;
  margin: 0 0;
  color: #000000;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;

  i {
    font-size: 16px;
    cursor: move;
    margin-right: 10px;
  }

  .fixed-op {
    i {
      cursor: pointer;

      &:first-child {
        transform: rotate(90deg);
      }

      &:last-child {
        transform: rotate(-90deg);
      }
    }

    .active {
      color: #409eff;
    }
  }

  .checkbox {
    flex: 1;
  }
}
</style>

<style lang="scss">
.s-table-column-setting-item {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
</style>
