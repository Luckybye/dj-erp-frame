<template>
  <div class="x-component search-select-district" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="placeholder || label"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: tfield('district_name'),
        value: 'district_id'
      }"
      @change="onChange"
      @remove-tag="onChange"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      filter="text"
    ><slot name="label" slot="label"></slot></x-cascader>
  </div>
</template>
<script>
export default {
  name: 'select-district',
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
    onChange (v, v2) {
      this.$nextTick(() => {
        this.$emit('change', this.multiple ? v2 || [] : (v2[0] || {}))
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field] || ''}, this.result)
      })
    },
    async getDatas () {
      this.datas = await this.$cache.getDistrict()
    },
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.field ? this.result[this.field] : this.value
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n[0] || null
          this.result[this.field2] = n[1] || null
        }
      }
    },
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
.search-select-district {
}
</style>
