<template>
  <div class="x-component search-prod-type" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label || 'All Prod Type'"
      :map="{
        label: tfield('text'),
        value: 'key'
      }"
      v-model="vmodel"
      :clearable="clearable"
      :collapseTags="collapseTags"
      @on-change="onChange"
      filter="filter"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
    ><slot name="label" slot="label"></slot></x-select>
  </div>
</template>
<script>
export default {
  name: 'prod-type',
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
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    optionsMethod: Function,
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
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    placeholder: String
  },
  methods: {
    onChange (v) {
      this.$nextTick(() => {
        // console.log("onChange:", v)
        // console.log("onChange:", this.field)
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    async getDatas () {
      // this.datas = await this.$constant("prodType")
      this.datas = await this.$api.getConfigure2("prodType")
      if (!this.datas.length) this.datas = await this.$constant("prodType")
    }
  },
  computed: {
    vmodel: {
      get: function () {
        console.log("get:", this.value)
        console.log("get:", this.result[this.field])
        let val = this.field ? this.result[this.field] : this.value
        return val
      },
      set: function (n) {
        console.log("set:", n)
        this.$emit('input', n)
        if (this.field) this.result[this.field] = n
      }
    }
  },
  data () {
    return {
      datas: [],
    }
  },
  watch: {
  },
  mounted () {
  },
  created () {
    this.getDatas()
  }
}
</script>
<style lang="scss">
.search-prod-type {
  display: inline-flex !important;
}
</style>
