<template>
  <div class="x-component search-select-payment" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="label"
      :map="{ value: 'text', label: 'desc', key: 'id', disabled: 'x_disabled', ...map }"
      v-model="vmodel"
      :clearable="clearable"
      :collapseTags="collapseTags"
      @on-change="onChange"
      filter="text"
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
  name: 'select-payment',
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
    map: Object
  },
  methods: {
    onChange (v, v2) {
      delete v.x_disabled
      if (this.field2 && this.field2 in v) this.result[this.field] = v
      this.$nextTick(() => {
        this.$emit('change', v, v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    async queryCmPayment() {
      let v = await this.$get2('/api/crm/queryCmPayment', { payment_type: 'ap' })
      return (v.cm_payments || []).map(m => {
        return {
          id: m.id,
          desc: m.payment_desc,
          text: m.payment_text,
          is_credit: m.is_credit,
          pu_st_type: m.pu_st_type,
          mg_payment_term: m.payment_params.parse() || [],
          x_disabled: m.busi_status === 'stop'
        }
      })
    },
    async getDatas () {
      // this.preDatas = ((await this.$configure.getValue('payment_type', this.$state('me').com_id)).payment_type || []).map(m => {
      //   m.desc = m.desc || m.text
      //   return m
      // })
      this.preDatas = await this.queryCmPayment()
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.field ? this.result[this.field] : this.value
        if (this.field2) val = this.result[this.field][this.field2]
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field2) {
          this.result[this.field][this.field2] = n
        } else if (this.field) this.result[this.field] = n
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
.search-select-payment {
}
</style>
