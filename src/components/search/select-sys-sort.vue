<template>
  <div class="x-component select-sys-sort" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="label || $t('all_category')"
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
    ><slot name="label" slot="label"></slot></x-cascader>
  </div>
</template>
<script>
export default {
  name: 'select-sys-sort',
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
    onChange (v) {
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field]}, this.result)
      })
    },
    async getDatas () {
      this.$get('/api/b2b/querySysSort').then(d => {
        this.datas = d.sys_sort || []
        // console.log('sys_sort:', d.sys_sort)
        // this.datasMap = this.datas._object('id')
        this.initData(this.datas)
      })
    },
    async initData (array) {
      array = array.forEach(item => {
        if (item.children && item.children.length > 0) {
          return this.initData(item.children)
        } else {
          delete item.children
        }
      })
      return array
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
.select-sys-sort {
}
</style>
