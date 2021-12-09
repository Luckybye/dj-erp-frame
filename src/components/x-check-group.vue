<template>
  <div class="x-component x-check-group">
    <label class="x-form-label" v-if="label || $slots.label" :style="{width: labelWidth}">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <!-- <el-checkbox-group v-model="vmodel">
      <el-checkbox v-for="check in source" :label="check.key" :key="check.key" class="mr10">{{check.text}}</el-checkbox>
    </el-checkbox-group> -->
    <div class="flex-1">
      <div class="select-all" v-if="selectAll">
        <el-checkbox :indeterminate="vmodel.length > 0 && vmodel.length < this.source.length" :value="vmodel.length === source.length" @change="handleCheckAllChange">{{$t('select_all')}}</el-checkbox>
      </div>
      <div class="flex wrap">
        <x-check v-for="check in source" :checked="vmodel.includes(getValue(check))" :expect="getValue(check)" :key="getValue(check)" :type="type" :display="getDisplay(check)" @change="onChange(check)" :width="checkWidth" :class="{'mr0': checkWidth}">{{getValue(check, 'label')}}</x-check>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  watch: {
  },
  computed: {
    vmodel: {
      get: function () {
        let {value, result, field} = this
        let val = value
        if (result && field) val = result[field]
        return val
      },
      set: function (val) {
        let {result, field} = this
        this.$emit('input', val)
        if (result && field) {
          result[field] = val || []
          this.$emit('save', {[field]: val})
          this.$emit('change', val)
        }
      }
    },
  },
  props: {
    result: {
      type: Object,
    },
    value: {
      type: Array,
      default() {
        return []
      },
    },
    field: {
      type: [String, Number],
      default: '',
    },
    source: {
      type: Array,
      default() {
        return []
      },
    },
    map: {
      type: Object,
      default() {
        return {
          label: 'text',
          value: 'key',
        }
      },
    },
    type: {
      type: String,
      default: 'checkbox',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: [String],
    labelWidth: [String],
    checkWidth: String,
    selectAll: Boolean,
  },
  methods: {
    getValue (check, f = 'value') {
      let {map} = this
      return typeof check === 'string' ? check : check[map[f]]
    },
    onChange (check) {
      let key = this.getValue(check)
      let vmodel = this.vmodel
      let i = vmodel.indexOf(key)
      if (i >= 0) this.vmodel.splice(i, 1)
      else vmodel.push(key)
      this.vmodel = vmodel
    },
    handleCheckAllChange (val) {
      this.vmodel = val ? this.source.map(v => this.getValue(v)) : []
    },
    getDisplay (check) {
      if (this.type !== 'self') return
      let key = this.getValue(check)
      let i = this.vmodel.indexOf(key)
      return (i + 1) || ''
    }
  }
}
</script>
<style lang="scss">
.x-check-group {
  display: inline-flex;
  line-height: 30px;
  .x-check {
    margin-right: 15px;
  }
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: inherit;
}
</style>
