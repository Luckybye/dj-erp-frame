<template>
  <div class="x-component check-yes-no" :style="{width: width}">
    <el-radio-group v-model="vmodel" :disabled="disabled || disabledMap[field]" @change="onChange">
      <el-radio :label="item.key" v-for="item in datas" :key="item.key">{{$tt(item, 'text')}}</el-radio>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  name: 'check-yes-no',
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
      type: [String]
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
        {text: "男", text_en: "Male", key: "m"},
        {text: "女", text_en: "Female", key: "wm"},
      ]
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
.check-yes-no {
  // display: inline-flex !important;
}
</style>
