<template>
  <div class="x-component search-select-cust-level" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="label || $t('all_cust_level')"
      :map="{ value: 'level_id', label: 'text' }"
      v-model="vmodel"
      :clearable="clearable"
      :collapseTags="collapseTags"
      @on-change="onChange"
      @get="getSelected"
      filter="filter"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
    >
      <slot name="label" slot="label"></slot>
    </x-select>
  </div>
</template>
<script>
const priceTypesMap = [
  {text: '售价折算(售价 × 价格系数)', expect: 'sell_price', unexpect: 'sell_price'},
  {text: '采购价折算(采购价 ÷ 价格系数)', expect: 'pu_price', unexpect: 'sell_price'},
]._object('expect')
export default {
  name: 'select-cust-level',
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
    pm: {
      type: Object,
      default () {
        return {}
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
  },
  methods: {
    onChange (v) {
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    getSelected (v) {
      this.$nextTick(() => {
        this.$emit('get', v)
      })
    },
    async getDatas () {
      this.$request2('/api/b2b/queryCustLevels').then(({cust_levels: a}) => {
        this.preDatas = a.map(f => {
          f.text = f.level_name + ((priceTypesMap[f.price_type] || {}).text || '')
          return f
        })
        this.$nextTick(() => {
          this.$emit('get-data', this.datas)
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
      return this.preDatas
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
.search-select-cust-level {
}
</style>
