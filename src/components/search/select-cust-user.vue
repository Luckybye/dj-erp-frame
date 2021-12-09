<template>
  <div class="x-component search-select-cust-com" :style="{width: width}">
    <x-select
      width="100%"
      v-model="vmodel"
      :source="datas"
      :placeholder="placeholder || label || getLabel()"
      :collapseTags="collapseTags"
      :multiple="multiple"
      :map="{
        label: 'name',
        value: 'id'
      }"
      @change="onChange"
      @remove-tag="onChange"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      :clearable="clearable"
      :showValue="showValue"
      filter="filter"
      :allowCreate="allowCreate">
      <slot name="label" slot="label"></slot></x-select>
  </div>
</template>
<script>
export default {
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
      default: true
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
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    showValue: String,
    allowCreate: Boolean,
    optionsMethod: Function,
  },
  methods: {
    onChange (v, v2) {
      this.$nextTick(() => {
        this.$emit('change', v, v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    async getDatas () {
      let para
      if (this.pm.custType) para = {[this.pm.custType]: 1}
      if (this.pm.range) para = {...para, ...this.pm.range}
      let arr = await this.$cache.getAllCustom(para)
      this.preDatas = arr.flatMap(f => {
        return f.children.map(m => {
          m.name = m.text + '/' + f.text
          return m
        })
      })
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
          val = this.result[this.field]
        }
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n || null
        }
      }
    },
    datas () {
      if (!this.optionsMethod) return this.preDatas
      return this.optionsMethod(this.preDatas)
    }
  },
  data () {
    return {
      preDatas: [],
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
.search-select-cust-com {
}
</style>
