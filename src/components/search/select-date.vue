<template>
  <div class="x-component search-select-date" :style="{width: width}" :label="!!(label || $slots.label) + ''">
    <label v-if="label || $slots.label" :style="{width: labelWidth}" class="x-form-label">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <label v-if=" $slots.prefix" class="x-form-label" style="width: auto">
      <slot name="prefix"></slot>
    </label>
    <el-date-picker
      :size="size"
      class="flex-1"
      v-model="vmodel"
      :type="pm.type"
      placeholder="Select date"
      @change="onChange"
      :readonly="readonly"
      :disabled="disabled || disabledMap[field]"
      :picker-options="pickerOptions"
      :clearable="clearable"
      :format="format">
    </el-date-picker>
    <label v-if=" $slots.suffix" class="x-form-label ml10" style="width: auto">
      <slot name="suffix"></slot>
    </label>
  </div>
</template>
<script>
export default {
  name: 'select-date',
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
    max: {
      type: [Date, String]
    },
    min: {
      type: [Date, String]
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
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    pm: {
      type: Object,
      default () {
        return {
          type: 'date'
        }
      }
    },
    size: String,
    format: String,
  },
  methods: {
    onChange (v) {
      console.log('date:', v)
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.value
        if (this.field) {
          if (this.result[this.field]) val = this.result[this.field]
        }
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n || ''
        }
      }
    },
    pickerOptions () {
      let {min, max} = this
      if (!min && !max) return
      return {
        disabledDate: d => {
          return ((min && new Date(d) < new Date(min)) || !min) &&
                 ((max && new Date(d) > new Date(max)) || !max)
        }
      }
    }
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
.search-select-date {
  display: inline-flex !important;
}
</style>
