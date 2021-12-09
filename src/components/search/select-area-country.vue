<template>
  <div class="x-component search-select-area-country" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="label || $t('all_area')"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: $i18n.locale === 'cn' ? 'text' : 'text_en',
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
    ><slot name="label" slot="label"></slot></x-cascader>
  </div>
</template>
<script>
export default {
  name: 'select-area-country',
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
    pm: {
      type: Object,
      default () {
        return {
          area_type: 'sell'
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
    }
  },
  methods: {
    onChange (...arg) {
      this.$nextTick(() => {
        this.$emit('change', ...arg)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field] || ''}, this.result)
      })
    },
    async getDatas () {
      this.$get2('/api/b2b/queryAreaList', {area_type: this.pm.area_type}).then(({company_areas: a}) => {
        this.datas = a.map(area => {
          area.id = area.area_id
          area.text = area.area_name
          area.text_en = area.area_name_en
          area.parent_id = ''
          area.filter = area.area_name + '~' + area.area_name_en
          area.node_type = 'area'
          area.children = area.countries.map(country => {
            country.id = country.dict_country_id
            country.text = country.country_name
            country.text_en = country.country_name_en
            country.filter = country.country_name + '~' + country.country_name_en
            country.node_type = 'country'
            country.parent_id = area.area_id
            return country
          }) || []
          return area
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
        let val
        if (this.multiple) {
          val = n.map(m => {
            let id = m[m.length - 1]
            return id
          })
        } else val = n[n.length - 1]
        this.$emit('input', val)
        if (this.field) this.result[this.field] = val
      }
    },
  },
  data () {
    return {
      datas: [],
    }
  },
  mounted () {
  },
  created () {
    this.getDatas()
  }
}
</script>
<style lang="scss">
.search-select-area-country {
}
</style>
