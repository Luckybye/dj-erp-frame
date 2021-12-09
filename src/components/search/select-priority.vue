<template>
  <div class="x-component search-select-priority" :style="{width: width}">
    <x-select
      width="100%"
      v-model="vmodel"
      :source="datas"
      :placeholder="label"
      :collapseTags="collapseTags"
      :map="{
        label: $i18n.locale === 'cn' ? 'text' : 'text_en',
        value: 'key'
      }"
      @change="onChange"
      @remove-tag="onChange"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      clearable
    ><slot name="label" slot="label"></slot></x-select>
  </div>
</template>
<script>
export default {
  name: 'select-priority',
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
  },
  methods: {
    onChange (v, v2) {
      this.$nextTick(() => {
        this.$emit('change', v, v2)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
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
          this.result[this.field] = n || null
        }
      }
    },
  },
  data () {
    return {
      datas: [
        {text: "是", text_en: "YES", key: "1"},
        {text: "否", text_en: "NO", key: "0"},
      ],
      datasMap: {}
    }
  },
  watch: {
  },
  mounted () {
  },
  created () {
  }
}
</script>
<style lang="scss">
.search-select-priority {
  display: inline-flex !important;
}
</style>
