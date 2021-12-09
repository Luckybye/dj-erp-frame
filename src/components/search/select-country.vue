<template>
  <div class="x-component search-select-country" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label"
      :map="{ value: 'country_id', label: 'name_en' }"
      v-model="vmodel"
      :clearable="clearable"
      :collapseTags="collapseTags"
      @on-change="onChange"
      @get="getSelected"
      @focus="onFocus"
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
let CacheChange = false
export default {
  name: 'select-country',
  props: {
    placeholder: String,
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
  },
  methods: {
    onFocus () {
      // 当有修改的时候，重新查询
      if (CacheChange) this.getOffenUse(this.preDatas)
    },
    onChange (v) {
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
      if (this.pm.update_often_use && v) {
        // 当有修改的时候，更新CacheChange
        setTimeout(() => {
          CacheChange = this.multiple ? !(v[v.length - 1] || {}).x_use : !v.x_use
        }, 5000)
      }
    },
    getSelected (v) {
      this.$nextTick(() => {
        this.$emit('get', v)
      })
    },
    async getCloudCountry () {
      let arr = await this.$get2('/api/b2b/queryCloudFileLabel', {table_name: 'dict_country'}, {loading: false, cache: 3}).then(d => d.table_ids || [])
      CacheChange = false
      return arr._object()
    },
    async getOffenUse (datas) {
      let {often_use} = this.pm
      if (!often_use) return (this.preDatas = datas)
      let topMap = {}
      switch (often_use) {
        case 'cloud':
          topMap = await this.getCloudCountry()
          break;
      }

      this.handlerDatas(topMap, datas)
    },
    handlerDatas (topMap, datas) {
      let topList = []
      this.preDatas = datas.filter(f => {
        if (topMap[f.country_id]) {
          f.x_use = true
          topList.push(f)
          return false
        } else return true
      })
      // console.log(topList, topMap, 'topMaptopMap')
      topList.length && this.preDatas.unshift(...topList)
    },
    async getDatas () {
      let datas = await this.$cache.getAllCountry()
      this.getOffenUse(datas)
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
.search-select-country {
}
</style>
