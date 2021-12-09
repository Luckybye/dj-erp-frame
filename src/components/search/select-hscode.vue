<template>
  <div class="x-component search-hscode" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label"
      :map="{
        label: 'filter',
        value: 'hs_code'
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
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    async getDatas () {
      let d = await this.$cache.getProdSetting()
      let isAll = (d.hscode_set || 'all') === 'all'
      if (isAll) {
        await this.getAllHsCode()
      } else await this.querySpecHscode()
      this.$nextTick(() => {
        this.$emit('load', this.datas)
      })
    },
    async getAllHsCode () {
      this.datas = await this.$cache.getAllHsCode()
    },
    async querySpecHscode () {
      let v = await this.$get2('/api/support/querySpecHscode', null, {loading: false})
      this.datas = v.special_hscode.map(m => {
        m.filter = m.hs_code + '~' + m.hs_name + '~' + m.comment
        return m
      })
    },
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.field ? this.result[this.field] : this.value
        return val
      },
      set: function (n) {
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
.search-hscode {
  display: inline-flex !important;
}
</style>
