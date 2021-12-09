<template>
  <div class="x-component search-select-register-place" :style="{width: width}">
    <x-select
      width="100%"
      v-model="vmodel"
      :source="datas"
      :placeholder="placeholder || label"
      :collapseTags="collapseTags"
      :multiple="multiple"
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
  name: 'select-register-place',
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
    checkStrictly: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: true
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
        {text: "境内", text_en: "Domestic", key: "domestic"},
        {text: "境外", text_en: "Abroad", key: "abroad"},
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
.search-select-register-place {
}
</style>
