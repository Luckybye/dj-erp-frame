<template>
  <div class="x-component search-select-catalog-sort" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label || $t('all_catalog_sort')"
      :map="{ value: 'sort_id', label: 'sort_name', disabled: 'x_disabled' }"
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
  name: 'select-catalog-sort',
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
      let field = 'catalog_sorts'
      let instance = this.$state('me').com_id
      return this.$configure.getValue(field, instance).then(res => {
        this.preDatas = (res[field] || []).map(m => {
          m.filter = [m.sort_name, m.sort_name_en].join('~')
          return m
        })
      })
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.field ? this.result[this.field] : this.value
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) this.result[this.field] = n
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
.search-select-catalog-sort {
}
</style>
