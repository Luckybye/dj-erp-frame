<template>
  <div class="x-check" :style="{width}">
    <el-checkbox v-model="vmodel" @change="onChangeCheck" v-if="type==='checkbox'" :disabled="disabled">
    </el-checkbox>

    <el-radio v-model="vmodel" @change="onChangeCheck" v-if="type==='radio'" :label="true" :disabled="disabled">
    </el-radio>

    <span class="self-display el-checkbox__inner" :class="{'is-checked': vmodel || display}" v-if="type === 'self'" @click="onClick">
      <span class="text">{{ display }}</span>
    </span>

    <span class="el-checkbox__label pointer" @click="onClick">
      <span v-if="text">{{ text }}</span>
      <slot></slot>
    </span>
  </div>
</template>[{}]
<script>
export default {
  data() {
    return {
    }
  },
  watch: {
  },
  computed: {
    vmodel: {
      get: function () {
        let {value, result, field, expect, checked} = this
        let val = value
        if (result && field) val = result[field]
        // console.log(val, 'getgetget', expect)
        val = val === expect
        return val || checked
      },
      set: function (val) {
        let {result, field, expect, unexpect} = this
        if (unexpect === undefined) unexpect = expect
        let rst = val ? expect : unexpect
        this.$emit('input', rst)
        if (result && field) result[field] = rst
      }
    },
  },
  props: {
    result: {
      type: Object,
      // default: function() {
      //   return {}
      // },
    },
    checked: {
      type: Boolean,
      default: false,
    },
    value: [String, Number, Boolean],
    field: {
      type: [String, Number],
      default: 'text',
    },
    rules: null,
    source: {
      type: Array,
      default() {
        return []
      },
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'radio',
    },
    width: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    expect: {
      type: [String, Number, Boolean],
      default: true
    },
    unexpect: null,
    multiselect: {
      type: Boolean,
      default: false,
    },
    display: {
      type: [String, Number],
      default: '',
    },
  },
  methods: {
    onClick () {
      if (this.disabled) return
      this.vmodel = !this.vmodel
      // console.log(111111, this.vmodel)
      this.onChangeCheck()
    },
    onChangeCheck() {
      let {result, field, vmodel} = this
      this.$nextTick(() => {
        this.$emit('change', vmodel)
        if (result && field) this.$emit('save', {[field]: result[field]}, vmodel)
      })
    },
  },
}
</script>
<style lang="scss">
.x-check {
  display: inline-flex;
  align-items: center;
  .self-display {
    $width: 16px;
    cursor: pointer;
    color: white;
    line-height: 13px;
    width: $width;
    height: $width;
    text-align: center;
    min-width: $width;
    vertical-align: middle;
    &.is-checked {
      background-color: #409EFF;
      border-color: #409EFF;
    }
    &:after {
      border: 0;
      width: 0;
      display: none;
    }
    .text {
      font-size: 12px;
      transform: scale(0.9);
      display: inline-block;
    }
  }
  .el-radio {
    // font-size: 0;
    margin-right: 0;
    .el-radio__label {
      display: none;
    }
    .el-radio__input {
      vertical-align: baseline;
      // font-size: 0;
    }
  }
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: inherit;
}
</style>
