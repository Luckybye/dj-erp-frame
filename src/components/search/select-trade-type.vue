<template>
  <div class="x-component search-select-trade-type" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label || $t('all_trade_type')"
      :map="{ value: 'value', label: $i18n.locale === 'cn' ? 'text' : 'text_en', disabled: 'x_disabled' }"
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
    ><slot name="label" slot="label"></slot></x-select>
  </div>
</template>
<script>
export default {
  name: 'select-trade-type',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
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
        return {
        }
      }
    },
  },
  methods: {
    onChange (v, v2) {
      this.$nextTick(() => {
        this.$emit('change', v, v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    getSelected (v) {
      this.$nextTick(() => {
        this.$emit('get', v)
      })
    },
    async getDatas () {
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
      preDatas: [
        {value: '', text: '全部', text_en: 'All'},
        {value: 'foreign', text: '对外交易', text_en: 'Foreign'},
        {value: 'internal', text: '对内交易', text_en: 'Internal'},
      ],
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
.search-select-trade-type {
}
</style>
