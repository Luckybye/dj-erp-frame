<template>
  <div class="x-component x-input" :style="{width}"  :label="!!(label || $slots.label) + ''">
    <label class="x-form-label" v-if="label || $slots.label" :style="{width: labelWidth}">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <el-input
      ref="input"
      class="flex-1"
      :class="{'has-unit': unit, 'is-error': errorValidate}"
      v-model="vmodel"
      :type="type"
      @blur="blur"
      @focus="focus"
      @change="change"
      @clear="clear"
      @input="onInput"
      @keyup.enter.native="onEnter"
      :maxlength="maxlength"
      :minlength="minlength"
      :clearable="clearable"
      :showPassword="showPassword"
      :prefixIcon="prefixIcon"
      :suffixIcon="suffixIcon"
      :rows="rows"
      :autosize="autosize || autosize2"
      :autocomplete="autocomplete"
      :name="name"
      :readonly="readonly"
      :max="max"
      :min="min"
      :step="step"
      :resize="resize"
      :autofocus="autofocus"
      :validateEvent="validateEvent"
      :form="form"
      :label="label"
      :tabindex="tabindex"
      :placeholder="placeholder"
      :disabled="disabled2"
      :size="size"
      :title="errorValidate">
      <slot name="prefix" slot="prefix" v-if="type === 'text'"></slot>
      <slot name="suffix" slot="suffix" v-if="type === 'text'"></slot>
      <slot name="prepend" slot="prepend"></slot>
      <slot name="append" slot="append" v-if="type === 'text'"></slot>
    </el-input>
    <span class="input-unit" v-if="unit">{{unit}}</span>
    <div class="no-text-append" v-if="type !== 'text'">
      <slot name="append"></slot>
    </div>
    <div class="error-text" v-if="errorValidate">{{errorValidate}}</div>
  </div>
</template>

<script>
import {debounce} from 'lodash'
import {ruleMap} from '@/utils/validate-rule';
const ruleMap2 = {
  integer () {
    if (/^[+-]?\d*$/.test(this.vmodel)) return
    this.vmodel = parseInt(this.vmodel) || ''
  },
  number () {
    if (/^[+-]?\d*\.?\d*$/.test(this.vmodel)) return
    this.vmodel = parseFloat(this.vmodel) || ''
  },
  max (val) {
    if (this.vmodel * 1 > val * 1) this.vmodel = val
    this.vmodel = this.vmodel * 1 || val
  },
  min (val) {
    console.log(this.vmodel, this)
    if (this.vmodel * 1 < val * 1) this.vmodel = val
    this.vmodel = this.vmodel * 1 || val
  }
}
export default {
  name: 'x-input',
  props: {
    value: [String, Number],
    placeholder: [String],
    rule: String,
    rules: String,
    type: {
      type: String,
      default: 'text'
    },
    maxlength: [Number],
    minlength: [Number],
    clearable: [Boolean],
    showPassword: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    size: [String],
    prefixIcon: [String],
    suffixIcon: [String],
    rows: [Number],
    autosize: [Boolean, Object],
    autocomplete: [String],
    name: [String],
    readonly: [Boolean],
    max: [Number, String],
    min: [Number, String],
    step: [String, Number],
    resize: [String],
    autofocus: [Boolean],
    validateEvent: [Boolean],
    form: [String],
    label: [String],
    tabindex: [String],
    width: [String],
    labelWidth: [String],
    result: Object,
    field: String,
    unit: String,
    focusAutoSize: Boolean,
    // 输入的时候不赋值，失去焦点时赋值
    blurChange: Boolean
  },
  data() {
    return {
      oldValue: '',
      autosize2: false,
      errorValidate: false,
      vmodel: ''
    }
  },
  watch: {
  },
  computed: {
    // 因为需要满足可以失去焦点后赋值，所以改成监听
    // vmodel: {
    //   get: function () {
    //     let {value, result, field} = this
    //     let val = value
    //     if (result && field) val = result[field]
    //     return this.blurChange ? this.vmodel2 : val
    //   },
    //   set: function (val) {
    //     if (this.blurChange) return (this.vmodel2 = val)
    //     this.setValue(val)
    //   }
    // },
    input () {
      return this.$refs.input
    },
    disabled2 () {
      return this.disabled || this.readonly || this.disabledMap[this.field]
    }
  },
  methods: {
    setValue () {
      // console.log(this.vmodel, 'this.vmodelthis.vmodelthis.vmodel')
      let val = this.vmodel
      let {result, field} = this
      this.$emit('input', val)
      if (result && field) result[field] = val
    },
    setVmodel (val) {
      // console.log(val, 'valvalval')
      this.vmodel = val
    },
    blur () {
      if (this.type === 'number' && this.vmodel !== '' && this.vmodel !== undefined) {
        this.vmodel = parseFloat(this.vmodel)
        this.oldValue = parseFloat(this.oldValue)
      }
      if (this.rules) this.validate2()
      this.blurChange && this.setValue()
      this.$nextTick(() => {
        this.$emit('blur')
        if (this.oldValue !== this.vmodel) {
          this.$emit('blur-change', this.vmodel)
          let v = {}
          let {result, field} = this
          if (result && field) v = {[field]: result[field]}
          this.$emit('save', v, this.result)
        }
        this.autosize2 = false
      })
    },
    focus () {
      this.oldValue = this.vmodel
      this.$emit('focus')
      if (this.focusAutoSize) this.autosize2 = true
      this.validate()
    },
    change () {
      this.$emit('change')
    },
    validate: debounce(function () {
      let {rule} = this
      this.errorValidate = ''
      if (!rule) return
      if (!this.vmodel && this.vmodel !== 0 && rule !== 'require') return
      let fun = ruleMap[rule]
      if (!fun) return
      let rst = fun(this.vmodel)
      if (!rst || !rst.hint) return
      this.errorValidate = rst.hint
      // console.log(this.errorValidate, 'this.errorValidatethis.errorValidate')
    }, 500),
    validate2 () {
      let {rules} = this
      if (!rules) return
      rules = rules.split(',')
      console.log(rules, 'this.rules')
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        let [fun, val] = rule.split('=')
        if (ruleMap2[fun]) {
          ruleMap2[fun].call(this, val)
        } else if (ruleMap[fun]) {
          this.errorValidate = ''
          let rst = ruleMap[fun](this.vmodel, val)
          if (!rst || !rst.hint) return
          this.errorValidate = rst.hint
        }
      }
    },
    onInput () {
      if (this.type === 'number') {
        // 以0为结尾的浮点型不校验
        if (/^[\d]*\.[\d]*0$/.test(this.vmodel)) return
        if (this.vmodel !== '' && this.vmodel !== undefined) this.vmodel = parseFloat(this.vmodel)
        // this.vmodel = parseFloat(this.vmodel) || ''
      }
      this.rule && this.validate()
      // console.log(9999999999)
      // this.$emit('input')
    },
    clear () {
      this.blurChange && this.setValue()
      this.$emit('clear')
      console.log(this.vmodel, 'this.vmodelthis.vmodel')
      this.$nextTick(() => {
        this.$emit('blur-change')
        this.setOldValue()
      })
    },
    onEnter () {
      if (this.type !== 'textarea') {
        if (this.blurChange) {
          this.setValue()
          this.setOldValue()
        }
        this.input.blur()
        this.$nextTick(() => {
          this.input.focus()
        })
      }
      // enter事件与blurChange事件重复，所以取消enter
      // this.$emit('enter')
      this.$emit('enter2')
    },
    setOldValue () {
      this.oldValue = this.vmodel
    }
  },
  mounted() {
    this.validate()
    this.$emit('load')
  },
  created () {
    if (this.result) {
      this.$watch(`result.${this.field}`, this.setVmodel, {immediate: true})
      this.$watch('field', () => {
        this.setVmodel(this.result[this.field])
      }, {immediate: true})
    } else this.$watch('value', this.setVmodel, {immediate: true})

    let unWatchVmodel
    this.$watch('blurChange', (n) => {
      if (!n) {
        unWatchVmodel = this.$watch('vmodel', this.setValue)
      } else if (unWatchVmodel) unWatchVmodel()
    }, {immediate: true})
  },
  beforeDestroy() {}
}
</script>

<style lang="scss">
.x-input {
  position: relative;
  &.x-component[label=false] {
    width: 100%;
  }
  .no-text-append {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    line-height: normal;
    // padding: 0 5px;
    // font-size: 13px;
  }
  .input-unit {
    position: absolute;
    z-index: 1;
    right: 0;
    top: 50%;
    padding: 0 5px;
    line-height: 100%;
    transform: translateY(-50%);
    // height: 100%;
  }
  .has-unit {
    .el-input__inner {
      padding-right: 25px;
    }
  }
  .is-error {
    .el-input__inner, .el-input__inner:focus, .el-textarea__inner, .el-textarea__inner:focus {
      border-color: #F56C6C;
    }
  }
  .error-text {
    font-size: 12px;
    color: red;
    transform: scale(0.8) translate(-10%, 90%);
    position: absolute;
    left: 0;
    bottom: -3px;
    line-height: normal;
    letter-spacing: 0.3ch;
  }
}
</style>
