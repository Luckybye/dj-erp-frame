<template>
  <div class="x-component search-select-city" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="placeholder || label"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: 'name',
        value: 'adcode'
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
  name: 'select-city',
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
    field2: String,
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
      this.datas = await this.$cache.getAllCity()
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
.search-select-city {
}
</style>
