<template>
  <div class="x-component search-select-cust" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="placeholder || label || getLabel()"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: 'text',
      }"
      @change="onChange"
      @remove-tag="onChange"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      filter="filter"
      :showValue="showValue"
      :clearable="clearable">
      <slot name="label" slot="label"></slot>
    </x-cascader>
  </div>
</template>
<script>
export default {
  name: 'select-cust',
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
    checkStrictly: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
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
    pm: {
      type: Object,
      default () {
        return {
          custType: '2'
        }
      }
    },
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    showValue: String,
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: String
  },
  methods: {
    onChange (v, v2) {
      console.log("onChange:", v, v2)
      this.$nextTick(() => {
        if (!this.checkStrictly) {
          this.$emit('change', v2[1] || {})
        } else this.$emit('change', v2)
        this.$emit('change2', v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field], [this.field2]: this.result[this.field2]}, this.result)
      })
    },
    async getDatas () {
      let para
      if (this.pm.custType) para = {[this.pm.custType]: 1}
      this.datas = await this.$cache.getAllCustom(para)
    },
    getLabel () {
      let k = this.pm.custType || 0
      return this.$t(this.labelMap[k])
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.value
        if (this.field) {
          if (this.result[this.field]) val = [this.result[this.field]]
          if (this.result[this.field2]) val = [this.result[this.field], this.result[this.field2]]
        }
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n[0] || ''
          this.result[this.field2] = n[1] || ''
        }
      }
    },
  },
  data () {
    return {
      datas: [],
      datasMap: {},
      labelMap: {
        0: 'search_all_contact',
        2: 'search_customer',
        4: 'search_supplier',
        32: 'search_forwarder',
        256: 'search_logistics_com'
      }
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
.search-select-cust {
}
</style>
