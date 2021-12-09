<template>
  <div class="x-component x-input-tabs" :style="{width}"  :label="!!(label || $slots.label) + ''">
    <label class="x-form-label" v-if="label || $slots.label" :style="{width: labelWidth}">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <el-tabs v-model="tabIndex" type="border-card" class="flex-1" :addable="!disabled2" @edit="handleTabsEdit" >
      <el-tab-pane v-for="(item, index) in vmodel" :key="item.x_name" :name="item.x_name" :closable="vmodel.length > 1 && !disabled2">
        <span slot="label">
          <slot name="header" :item="item" :index="index"></slot>
        </span>
        <textarea
          class="el-textarea__inner"
          :value="inputModel(item, index)"
          @blur="blur(item, index, $event)"
          @focus="focus"
          @input="input"
          :rows="rows"
          :readonly="readonly"
          :resize="resize"
          :placeholder="placeholder"
          :disabled="disabled2"
        >
        </textarea>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {omit} from 'lodash';
export default {
  name: 'x-input-tabs',
  props: {
    value: [Array],
    placeholder: [String],
    clearable: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    size: [String],
    rows: [Number],
    readonly: [Boolean],
    resize: [String],
    width: [String],
    label: String,
    labelWidth: [String],
    result: Object,
    field: String,
    field2: String,
    focusAutoSize: Boolean
  },
  data() {
    return {
      tabIndex: '0'
    }
  },
  watch: {
  },
  computed: {
    vmodel: {
      get: function () {
        let {value, result, field, field2} = this
        let val = value
        if (result && field) val = result[field]
        if (!val || !val.length) val = [{[field2]: ''}]
        return val.map((m, i) => ({x_name: i + '', ...m}))
      },
      set: function (val) {
        this.setValue(val)
      }
    },
    disabled2 () {
      return this.disabled || this.readonly || this.disabledMap[this.field]
    }
  },
  methods: {
    setValue (val) {
      let {result, field} = this
      val = val.map(m => omit(m, 'x_name'))
      this.$emit('input', val)
      if (result && field) result[field] = val
    },
    inputModel (item, index) {
      let {field2} = this
      if (typeof item === 'string') return item + ''
      if (typeof item === 'object' && field2) return item[field2] + ''
      return ''
    },
    blur (item, index, e) {
      let {field2, vmodel} = this
      let value = e.target.value
      item[field2] = value
      vmodel.splice(index, 1, item)
      this.setValue(this.vmodel)
      this.blurNotice()
    },
    blurNotice () {
      this.$emit('blur')
      this.$emit('blur-change', this.vmodel)
      let v = {}
      let {result, field} = this
      if (result && field) v = {[field]: result[field]}
      this.$emit('save', v, this.result)
    },
    focus () {
      this.$emit('focus')
    },
    change () {
      this.$emit('change')
    },
    input (e) {
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.vmodel.push({
          [this.field2]: '',
        });
        this.tabIndex = this.vmodel.length - 1 + '';
      }
      if (action === 'remove') {
        this.vmodel = this.vmodel.filter(f => f.x_name !== targetName)
        this.tabIndex = this.vmodel[0].x_name
        this.$nextTick(this.blurNotice)
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {}
}
</script>

<style lang="scss">
.x-input-tabs {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
    .el-textarea__inner {
      border-top: 0;
      // margin-top: -2px;
      border-radius: 0;
    }
  }
}
</style>
