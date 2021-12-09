<template>
  <div class="x-component search-select-nature" :style="{width: width}">
    <extend-nature
      width="100%"
      @change="onChange"
      :label="label"
      :disabled="disabled"
      :labelWidth="labelWidth"
      :extendArr="vmodel"
      :natureid="pm.key"
      :isCn="$i18n.locale === 'cn'"
      :multiple="multiple"
    ><slot name="label" slot="label"></slot></extend-nature>
  </div>
</template>
<script>
import ExtendNature from '@/views/prod/pages/items/extend-nature.vue'
export default {
  name: 'select-nature',
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
    value: {
      type: [Array]
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
    multiple: Boolean
  },
  components: {ExtendNature},
  methods: {
    onChange (v) {
      if (!this.vmodel) return
      let i = this.vmodel.findIndex(f => f.nature_id === v.nature_id)
      if (i >= 0) {
        if (!v.option_name && !v.option_name_en) {
          this.vmodel.splice(i, 1)
        } else this.vmodel.splice(i, 1, v)
      } else this.vmodel.push(v)

      if (this.result && this.field) {
        this.$emit('save', {[this.field]: this.result[this.field]})
      }
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.value
        if (this.field) {
          val = this.result[this.field]
        }
        return val
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n || []
        }
      }
    },
  },
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {
  },
  created () {
  },
  beforeDestroy () {
    let i = this.vmodel.findIndex(f => f.nature_id === this.pm.key)
    if (i >= 0) this.vmodel.splice(i, 1)
  }
}
</script>
<style lang="scss">
</style>
