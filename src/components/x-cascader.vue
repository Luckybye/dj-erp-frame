<template>
  <div
    class="x-component x-cascader"
    :style="{ width: width }"
    :label="!!(label || $slots.label) + ''"
  >
    <label
      class="x-form-label"
      v-if="label || $slots.label"
      :style="{ width: labelWidth }"
    >
      <template v-if="!$slots.label">{{ label }}</template>
      <slot v-else name="label"></slot>
    </label>
    <el-cascader
      ref="cascader"
      class="flex-1"
      :class="{ 'tag-no-wrap': collapseTags }"
      :options="options2"
      :props="props2"
      :size="size"
      :placeholder="placeholder2"
      :disabled="disabled2"
      :clearable="false"
      :show-all-levels="showAllLevels"
      :collapse-tags="collapseTags"
      :separator="separator"
      :filterable="filterable"
      :popperClass="popperClass"
      @change="onChange"
      @expand-change="onExpandChange"
      @blur="onBlur"
      @focus="onFocus"
      @visible-change="onVisibleChange"
      @remove-tag="onRemoveTag"
      v-model="vmodel"
      :before-filter="beforeFilter"
      :filter-method="filterable ? onFilter : null"
    ></el-cascader>
      <!-- :filter-method="filter ? onFilter : null"
      :before-filter="beforeFilter" -->
    <span
      v-if="clearable && vmodel && vmodel.length && !disabled2"
      class="select-close"
      @click.stop="onClose"
      ><i class="el-icon-circle-close"></i
    ></span>
  </div>
</template>
<script>
import {throttle, debounce} from 'lodash'
export default {
  name: 'x-cascader',
  props: {
    filter: String,
    width: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Array],
    },
    options: {
      type: Array,
      default() {
        return []
      },
    },
    optionsMap: {
      type: Object,
    },
    props: {
      type: Object,
      default() {
        return {}
      },
    },
    size: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: '/',
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    result: Object,
    field: {
      type: String,
      default: '',
    },
    popperClass: {
      type: String,
      default: '',
    },
    label: [String],
    labelWidth: [String],
    showValue: String,
  },
  methods: {
    onChange(v) {
      this.$nextTick(() => {
        this.$emit('change', v, this.selectedOptions)
      })
    },
    onExpandChange(v) {
      this.$nextTick(() => {
        this.$emit('expand-change', v, this.selectedOptions)
      })
    },
    onBlur(v) {
      this.$nextTick(() => {
        this.$emit('blur', v, this.selectedOptions)
        this.handlerFilterOptions()
      })
    },
    onFocus(v) {
      // console.log('focusfocusfocus')
      this.$emit('focus')
      this.addScrollEvent()
    },
    onVisibleChange(v) {
      this.$nextTick(() => {
        this.$emit('visible-change', v, this.selectedOptions)
      })
    },
    onRemoveTag(v) {
      this.$nextTick(() => {
        this.$emit('remove-tag', v, this.selectedOptions)
      })
    },
    onFilter(node, f) {
      let { filter } = this
      if (!filter) filter = this.props2.label
      if (!filter) return
      if (!f) return true
      let reg = new RegExp(f, 'i')
      // console.log(node.data[filter], 'nodenodenode')
      // reg.test(port[filter])
      return reg.test(node.data[filter])
    },
    beforeFilter(f) {
      if (this.showCount > this.options.length) return true
      let {filter} = this
      if (typeof filter === 'boolean' || !filter) filter = this.props2.label
      let reg = new RegExp(f, 'i')
      let resuts = this.$h.filterDeep(this.options, this.props2.children, d => reg.test(d[filter]), 10)
      this.filterOptions = resuts
      return this.nextTick()
    },
    nextTick () {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          resolve()
        })
      })
    },
    onClose() {
      let self = this.$refs.cascader
      self.presentText = ''
      self.$refs.panel.clearCheckedNodes()
    },
    setSelectedOptions(val) {
      if (!val) return
      if (!Object.keys(this.optionsMap2).length) return
      if (this.props.multiple) {
        this.selectedOptions = []
        val.map(m => {
          let id = m[m.length - 1]
          this.selectedOptions.push(this.optionsMap2[id] || {})
          return id
        })
      } else {
        // console.log(val, 'valvalvalval')
        this.selectedOptions = val.map(id => {
          return this.optionsMap2[id] || {}
        })
        this.setStart()
      }
    },
    setLabel() {
      // 解决下拉框没有当前值，无法显示问题
      this.$nextTick(() => {
        let cascader = this.$refs.cascader
        if (
          !cascader ||
          this.props.multiple ||
          !this.selectedOptions ||
          !this.showValue
        ) return
        cascader.$nextTick(() => {
          cascader.inputValue = cascader.inputValue || this.showValue || ''
          cascader.presentText = cascader.presentText || this.showValue || ''
        })
      })
    },
    handlerFilterOptions: debounce(function () {
      if (!this.$refs.cascader) return
      let inputValue = this.$refs.cascader.inputValue
      if (!inputValue) this.filterOptions = null
    }, 500),
    setStart () {
      // 显示当前选中值区域
      if (!this.selectedOptions || !this.selectedOptions.length) return
      if (this.options.length <= this.showCount - this.start) return
      if (this.props.multiple) {
      } else {
        // 单选，从当前选中值开始显示
        let [v] = this.selectedOptions
        if (v.x_index < this.showCount) return
        if (typeof v.x_index !== 'number') return
        this.start = Math.max(v.x_index - this.showCount + 4, 0)
      }
    },
    // load: throttle(function ({target}) {
    //   // console.log(target.scrollTop, target.clientHeight, target.scrollHeight)
    //   const {scrollTop, clientHeight, scrollHeight} = target
    //   const distance = 10
    //   this.lastTop || (this.lastTop = 0)
    //   let isScrollUp = scrollTop <= this.lastTop
    //   // console.log(isScrollUp ? '上滑' : '下滑')
    //   if (scrollTop + clientHeight + distance >= scrollHeight) {
    //     // console.log('下滑', this.showCount)
    //     this.showCount += 10
    //   } else if (this.start > 0 && isScrollUp) {
    //     if (scrollTop <= 100) {
    //       this.start = this.start < 10 ? 0 : (this.start - 10)
    //       // console.log('上滑', this.start)
    //       this.showCount += 10
    //     }
    //   }
    //   this.lastTop = scrollTop
    // }, 100),
    load: throttle(function({target}) {
      if (this.showCount >= this.options.length) return this.removeScrollEvent()
      const {scrollTop, clientHeight, scrollHeight} = target
      // console.log(scrollTop, clientHeight, scrollHeight, this.showCount, this.options.length)
      const distance = 30
      this.lastTop || (this.lastTop = 0)
      let isScrollUp = scrollTop <= this.lastTop
      // console.log(isScrollUp ? '上滑' : '下滑')
      if (scrollTop + clientHeight + distance >= scrollHeight) {
        this.showCount += 10
        this.$refs.cascader.$nextTick(() => {
          setTimeout(() => {
            if (target.scrollTop >= this.lastTop) return
            // console.log(target.scrollTop, this.lastTop, scrollTop)
            target.scrollTop = this.lastTop
          }, 10)
        })
      } else if (this.start > 0 && isScrollUp) {
        if (scrollTop <= 100) {
          this.start = this.start < 10 ? 0 : (this.start - 10)
          // console.log('上滑', this.start)
          this.showCount += 10
        }
      }
      this.lastTop = scrollTop
    }, 100),
    addScrollEvent () {
      // console.log(this.$refs.cascader, 'this.$refs.cascader')
      if (!this.$refs.cascader) return
      let el = this.$refs.cascader.$refs.popper.querySelector('.el-cascader-menu__wrap')
      el && el.addEventListener('scroll', this.load)
      let inputs = this.$refs.cascader.$el.querySelectorAll('input')
      inputs && inputs.forEach(t => {
        t.addEventListener('input', this.handlerFilterOptions)
      })
    },
    removeScrollEvent () {
      let el = this.$refs.cascader.$refs.popper.querySelector('.el-cascader-menu__wrap')
      el && el.removeEventListener('scroll', this.load)
    },
    removeInputEvent () {
      let inputs = this.$refs.cascader.$el.querySelectorAll('input')
      inputs && inputs.forEach(t => {
        t.removeEventListener('input', this.handlerFilterOptions)
      })
    },
  },
  computed: {
    vmodel: {
      get: function() {
        let {result, field} = this
        let val = result && field ? result[field] : this.value
        if (!val) return ''
        if (this.props.multiple) {
          if (!Array.isArray(val)) val = [val]
          val = val.map(m => {
            return (this.optionsMap2[m] || {}).full_id || [m]
          })
        } else if (typeof val === 'string') {
          val = (this.optionsMap2[val] || {}).full_id || [val]
        }
        if (!this.setOver) {
          this.setSelectedOptions(val)
          this.setLabel()
        }
        return val
      },
      set: function(n) {
        this.setOver = true
        this.$emit('input', n)
        if (this.result && this.field) this.result[this.field] = n
        this.setSelectedOptions(n)
      },
    },
    optionsMap2() {
      if (this.optionsMap) return this.optionsMap
      let { value, children } = { ...this.defaultProps, ...this.props }
      // console.log(value, children, 55555555)
      let map = {}
      let mapDatas = (arr, parentId) => {
        for (let i = 0; i < arr.length; i++) {
          const m = arr[i]
          map[m[value]] = {
            ...m,
            full_id: [...((map[parentId] || {}).full_id || []), m[value]],
            x_index: i
          }
          if (m[children] && m[children].length) mapDatas(m[children], m[value])
          if (!m[children] || !m[children].length) delete m[children]
        }
      }
      mapDatas(this.options)
      return map
    },
    options2 () {
      if (this.filterOptions) return this.filterOptions
      if (this.options.length < this.showCount) return this.options
      // if (this.multiple) return this.source

      return this.options.slice(this.start, this.showCount + this.start)
    },
    placeholder2() {
      let p = this.placeholder.trim()
      if (p) return p
      return this.disabled ? 'Disabled' : this.$t('select_placeholder')
    },
    disabled2 () {
      return this.disabled || this.disabledMap[this.field]
    },
    props2 () {
      return {...this.defaultProps, ...this.props}
    }
  },
  data() {
    return {
      defaultProps: {},
      selectedOptions: null,
      setOver: false,
      showCount: 50,
      start: 0,
      filterOptions: null,
      dfltSelectedOptions: []
    }
  },
  watch: {},
  mounted() {
    setTimeout(() => {
      this.addScrollEvent()
    }, 2000)
  },
  created() {
    this.defaultProps = {
      expandTrigger: 'click',
      multiple: false,
      checkStrictly: false,
      emitPath: true,
      lazy: false,
      value: 'id',
      label: 'text',
      children: 'children',
      disabled: 'disabled',
      leaf: 'leaf',
    }
  },
  beforeDestroy () {
    this.removeScrollEvent()
    this.removeInputEvent()
  }
}
</script>
<style lang="scss">
.x-cascader {
  .tag-no-wrap {
    .el-cascader__tags {
      flex-wrap: nowrap;
      overflow: hidden;
    }
    .el-input--small {
      input {
        height: 32px !important;
      }
    }
  }
  position: relative;
  .select-close {
    position: absolute;
    right: 30px;
    z-index: 10;
    background: white;
    // padding: 0 5px;
    padding-left: 5px;
    height: 28px;
    line-height: 28px;
    top: 2px;
    display: none;
    [class^='el-icon-'] {
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
    }
  }
  &:hover {
    .select-close {
      display: inline;
    }
  }
  .el-cascader__tags {
    overflow: auto;
    max-height: 100px;
  }
  .el-cascader-menu__list {
    max-height: 400px;
  }
}
</style>
