<template>
  <div class="x-component search-select-sort" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :options-map="datasMap"
      :placeholder="placeholder || label || $t('all_category')"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: tfield('text'),
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
  name: 'select-sort',
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
        this.$emit('change', this.multiple ? v2 || [] : (v2[v2.length - 1] || {}))
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field] || ''}, this.result)
      })
    },
    async getDatas () {
      this.datas = await this.$cache.getAllSort()
      let list = await this.$cache.getPreSort()
      this.datasMap = list._object('id')
    },
    mergeArray (arr1, arr2) {
      var _arr = []
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
      }
      for (var j = 0; j < arr2.length; j++) {
        var flag = true;
        for (var k = 0; k < arr1.length; k++) {
          if (arr2[j] === arr1[k]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          _arr.push(arr2[j]);
        }
      }
      return _arr;
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.field ? this.result[this.field] : this.value
        return val
      },
      set: function (n) {
        let val = []
        if (this.multiple) {
          if (this.checkStrictly) {
            val = n.map(m => {
              let id = m[m.length - 1]
              return id
            })
          } else {
            n.forEach(m => {
              val = this.mergeArray(val, m)
            })
          }
        } else val = n[n.length - 1]
        this.$emit('input', val)
        if (this.field) this.result[this.field] = val
      }
    },
  },
  data () {
    return {
      datas: [],
      datasMap: {}
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
.search-select-sort {
}
</style>
