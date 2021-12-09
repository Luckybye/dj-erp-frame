<template>
  <div class="x-component search-pm-prod" :style="{width: width}">
    <x-select ref="selectPmProd"
      width="100%"
      v-model="vmodel"
      :source="datas"
      :placeholder="placeholder"
      :collapseTags="collapseTags"
      :multiple="multiple"
      :map="{
        label: 'text',
        value: 'prod_id',
        disabled: 'disabled'
      }"
      @change="onChange"
      @remove-tag="onChange"
      @blur="blur"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      remote
      :remoteMethod="getDatas2"
      :loading="loading"
      clearable
      default-first-option
    ><slot name="label" slot="label"></slot></x-select>
  </div>
</template>
<script>
import { getProd } from "@/lib/setting";
export default {
  name: 'search-pm-prod',
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
    search: {
      type: Object,
      default () {
        return {}
      }
    },
    selectdList: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '快速添加公司商品'
    }
  },
  methods: {
    onChange (v, v2) {
      this.$nextTick(() => {
        this.$emit('change', v, v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
        this.clear()
      })
    },
    clear () {
      this.$nextTick(() => {
        this.$refs.selectPmProd.elSelect.blur()
        this.datas = []
        this.vmodel = ''
        this.$refs.selectPmProd.elSelect.$nextTick(() => {
          // this.$refs.selectPmProd.elSelect.selectedLabel = ''
          setTimeout(() => {
            this.$refs.selectPmProd.elSelect.focus()
          }, 500)
        })
      })
    },
    blur () {
      // setTimeout(() => {
      //   this.vmodel = ''
      //   this.datas = []
      // }, 500)
    },
    async getConfigure () {
      const field = 'select_pm_prod_display'
      let v = await this.$configure.getValue(field, this.$state('me').com_id, {loading: false})
      this.showField = v[field] || this.showField
    },
    async getDatas (query) {
      if (query !== '') {
        this.loading = true;
        let search = {...this.search, fuzzy_value: query, page_index: 1, page_size: 10}
        search.need_nature = /[a-z0-9]{12,}/.test(this.showField) ? 'yes' : 'no'
        const v = await this.$get('/api/product/queryEsProds', search, {loading: false})
        this.loading = false;
        this.datas = (v.prod_infos || []).map(m => {
          m.trade_status = this.$i18n.locale === 'cn' ? 'internal' : ''
          m.natureMap = (m.natures || [])._object('nature_id')
          m.text = this.getShowText(m)
          m.disabled = !!this.selectedMap[m.prod_id]
          return m
        })
      } else {
        this.datas = [];
      }
    },
    getShowText (m) {
      return this.showField2.map(key => {
        if (/[a-z0-9]{12,}/.test(key)) {
          const op = m.natureMap[key] || {}
          return op.option_name_en || op.option_name || '-'
        } else if (this.fieldMap[key]) {
          const val = this.fieldMap[key].value
          if (typeof val === 'function') {
            return val(m) || '-'
          }
          return m[val] || '-'
        } else return '-'
      }).join(' / ')
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.value
        if (this.field) {
          val = this.result[this.field]
        }
        return val || ''
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n || null
        }
      }
    },
    selectedMap () {
      return this.selectdList.reduce((pre, val) => {
        pre[val.sell_prod_id || val.prod_id] = val
        return pre
      }, {})
    },
    showField2 () {
      return this.showField.split(',')
    }
  },
  data () {
    return {
      loading: false,
      datas: [],
      getDatas2: null,
      showField: 'prod_name_en,item_no',
      fieldMap: getProd('pm')._object('id')
    }
  },
  watch: {
  },
  mounted () {
    this.getDatas2 = this.$h.debounce(this.getDatas, 200)
  },
  created () {
    this.getConfigure()
  }
}
</script>
<style lang="scss">
.search-pm-prod {
  display: inline-flex !important;
}
</style>
