<template>
  <div class="x-component search-select-input-range" :style="{width: width}" :label="!!(label || $slots.label) + ''">
    <label v-if="label || $slots.label" :style="{width: labelWidth}" class="x-form-label">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <div class="flex-b flex-1">
      <x-input
        class="flex-1"
        v-model="result[field]"
        placeholder="Start"
        :clearable="clearable"
        @change="onChange1"
        :readonly="readonly"
        :disabled="disabled || disabledMap[field]">
      </x-input>
      <span class="mh5 lh-30">-</span>
      <x-input
        class="flex-1"
        v-model="result[field2]"
        placeholder="End"
        :clearable="clearable"
        @change="onChange2"
        :readonly="readonly"
        :disabled="disabled || disabledMap[field]">
      </x-input>
    </div>
  </div>
</template>
<script>
// import moment from 'dayjs'
export default {
  name: 'select-input-range',
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
      this.onChange(start)
    },
    onChange2 () {
      let end = this.result[this.field2]
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
.search-select-input-range {
  display: inline-flex !important;
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 130px;
  }
}
</style>
