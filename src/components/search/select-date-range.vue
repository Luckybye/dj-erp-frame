<template>
  <div class="x-component search-select-date-range" :style="{width: width}" :label="!!(label || $slots.label) + ''">
    <label v-if="label || $slots.label" :style="{width: labelWidth}" class="x-form-label">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <div class="flex-b flex-1">
      <el-date-picker
        class="flex-1"
        v-model="result[field]"
        placeholder="Start"
        :clearable="clearable"
        @change="onChange1"
        :readonly="readonly"
        :picker-options="pickerOptions1"
        :disabled="disabled || disabledMap[field]">
      </el-date-picker>
      <span class="mh5 lh-30">-</span>
      <el-date-picker
        class="flex-1"
        v-model="result[field2]"
        placeholder="End"
        :clearable="clearable"
        @change="onChange2"
        :readonly="readonly"
        :picker-options="pickerOptions2"
        :disabled="disabled || disabledMap[field]">
      </el-date-picker>
    </div>
  </div>
</template>
<script>
// import moment from 'dayjs'
export default {
  name: 'select-date-range',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Array]
    },
    result: {
      type: Object,
      default () {
        return {}
      }
    },
    field: {
      type: String,
      default: ''
    },
    field2: {
      type: String,
      default: ''
    },
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  methods: {
    onChange1 () {
      let start = this.result[this.field]
      // let end = this.result[this.field2]
      // if (end && new Date(start).getTime() > new Date(end).getTime()) {
      //   this.result[this.field] = ''
      //   return this.$message.warning('起始时间不能大于截至时间')
      // }
      this.onChange(start)
    },
    onChange2 () {
      // let start = this.result[this.field]
      let end = this.result[this.field2]
      // if (start && new Date(start).getTime() > new Date(end).getTime()) {
      //   this.result[this.field2] = ''
      //   return this.$message.warning('截至时间必须大于起始时间')
      // }
      this.onChange(end)
    },
    onChange (v) {
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field], [this.field2]: this.result[this.field2]}, this.result)
      })
    }
  },
  computed: {
    pickerOptions1 () {
      let max = this.result[this.field2]
      return {
        disabledDate: d => {
          return max && new Date(d).getTime() > new Date(max).getTime()
        }
      }
    },
    pickerOptions2 () {
      let min = this.result[this.field]
      return {
        disabledDate: d => {
          return min && new Date(d).getTime() < new Date(min).getTime()
        }
      }
    }
    // vmodel: {
    //   get: function () {
    //     let val = this.value
    //     if (this.field) {
    //       if (this.result[this.field]) val = [this.result[this.field]]
    //       if (this.result[this.field2]) val = [this.result[this.field], this.result[this.field2]]
    //     }
    //     return val
    //   },
    //   set: function (n) {
    //     this.$emit('input', n)
    //     if (this.field) {
    //       this.result[this.field] = (n || [])[0] || null
    //       this.result[this.field2] = (n || [])[1] || null
    //     }
    //   }
    // }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {
  },
  created () {
  }
}
</script>
<style lang="scss">
.search-select-date-range {
  display: inline-flex !important;
  &.x-component {
    width: auto;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 130px;
  }
}
</style>
