<template>
  <div class="x-component search-select-ec-group" :style="{width: width}">
    <x-select
      width="100%"
      :source="datas"
      :multiple="multiple"
      :placeholder="placeholder || label"
      :map="{ value: 'ec_group_id', label: 'ec_group_name', disabled: 'x_disabled' }"
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
  name: 'select-ec-group',
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
        return {}
      }
    },
    platformId: String,
    data: Array,
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
      if (this.data) {
        this.preDatas = this.data
        return
      }
      let platform_id = this.platformId || await this.getPlatform()
      if (!platform_id) return
      let v = await this.$get('/ideal/wf/queryEcGroups', { platform_id }, {loading: false, cache: 2})
      this.preDatas = v.ec_groups || []
      this.preDatas.map(item => {
        item.filter = item.ec_group_name + item.ec_group_code
      })
    },
    async getPlatform() {
      let v = await this.$get('/ideal/wf/queryPlatforms', {protocol: 'api'}, { loading: false, cache: 2 })
      v = (v.wf_platforms || []).find(f => f.platform_code === 'sellercloud')
      return (v || {}).platform_id
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
.search-select-ec-group {
}
</style>
