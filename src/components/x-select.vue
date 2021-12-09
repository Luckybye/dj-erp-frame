<template>
  <div class="x-component x-select" :style="{width: width}" :label="!!(label || $slots.label) + ''">
    <label class="x-form-label" v-if="label || $slots.label" :style="{width: labelWidth}">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <el-select
      class="flex-1"
      ref="elSelect"
      v-model="vmodel"
      :multiple="multiple"
      :disabled="disabled2"
      :size="size"
      :clearable="false"
      :collapse-tags="collapseTags"
      :multiple-limit="multipleLimit"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder2"
      :filter-method="onFilter"
      :filterable="filterable"
      :allow-create="allowCreate"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      :popper-class="popperClass"
      :reserve-keyword="reserveKeyword"
      :default-first-option="defaultFirstOption"
      :popper-append-to-body="popperAppendToBody"
      @change="onChange"
      @visible-change="onVisibleChange"
      @remove-tag="onRemoveTag"
      @clear="onClear"
      @blur="onBlur"
      @focus="onFocus">
      <slot name="prefix" slot="prefix"></slot>
      <slot name="empty" slot="empty"></slot>
      <el-option v-if="start && !searchText" disabled value="up">
        <div class="pointer user-select-none text-center" @click="start = start <= 10 ? 0 : start - 10">
          <i class="el-icon-caret-top"></i>
        </div>
      </el-option>
      <!-- 多选选中部分 -->
      <el-option-group
        v-if="multiple && selectedOptions.length"
        label="已选">
        <template v-for="(item, i) in selectedOptions">
          <el-option
            v-if="item"
            :key="i"
            :label="getLabel(item)"
            :title="getLabel(item)"
            :value="map.value ? item[map.value] : item"
            :disabled="map.disabled && item[map.disabled]">
          </el-option>
        </template>
      </el-option-group>
      <el-option-group>
        <el-option
          v-for="(item) in options"
          :key="item[map.key] || item[map.value] || (map.value ? '' : item)"
          :label="getLabel(item)"
          :title="getLabel(item)"
          :value="map.value ? item[map.value] : item"
          :disabled="map.disabled && item[map.disabled]">
        </el-option>
      </el-option-group>
    </el-select>
    <span v-if="clearable && vmodel && vmodel.length && !disabled2" class="select-close" @click.stop="onClose"><i class="el-icon-circle-close"></i></span>
  </div>
</template>
<script>
import {throttle} from 'lodash'
export default {
  name: 'xselect',
  props: {
    value: [String, Array, Number],
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    name: [String],
    autocomplete: {
      type: String,
      default: 'off'
    },
    placeholder: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: true
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Boolean,
      default: false
    },
    remoteMethod: {
      type: Function,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: String,
      default: ''
    },
    reserveKeyword: {
      type: Boolean,
      default: false
    },
    defaultFirstOption: {
      type: Boolean,
      default: false
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },

    width: {
      type: String,
      default: ''
    },
    filter: {
      type: [String, Boolean],
      default: true
    },
    source: {
      type: Array,
      default () {
        return []
      }
    },
    map: {
      type: Object,
      default () {
        return {
          key: '',
          label: '',
          value: '',
          disabled: 'x_disabled'
        }
      }
    },
    result: Object,
    field: String,
    showValue: String,
    label: [String],
    labelWidth: [String]
  },
  methods: {
    onChange (val) {
      this.$nextTick(() => {
        // console.log('onChangeonChange', val)
        this.$emit('change', this.selectedOptions || {})
        this.$emit('on-change', this.selectedOptions || {}, this.result)

        let v = {}
        let {result, field} = this
        if (result && field) v = {[field]: result[field]}
        this.$emit('on-save', this.result, this.field, this.selectedOptions || {})
        this.$emit('save', v, this.result)
        // 解决选择后，不隐藏下拉框，待考虑，可能引起其他问题
        this.elSelect.blur()
      })
    },
    onVisibleChange (v) {
      this.$nextTick(() => {
        this.$emit('visible-change', v, this.selectedOptions || {})
      })
    },
    onRemoveTag (v) {
      this.$nextTick(() => {
        this.$emit('remove-tag', v, this.selectedOptions || {})
      })
    },
    onClear (v) {
      this.$nextTick(() => {
        this.$emit('clear', v, this.selectedOptions || {})
      })
    },
    onBlur (v) {
      this.$nextTick(() => {
        this.$emit('blur', v, this.selectedOptions || {})
      })
    },
    onFocus (v) {
      this.addScrollEvent()
      this.$nextTick(() => {
        this.$emit('focus', v, this.selectedOptions || {})
        // this.searchText = this.elSelect.query
        this.onFilter()
        this.setStart(this.vmodel)
      })
    },
    onFilter (f) {
      this.searchText = f
      if (!f) return
      let {filter} = this
      if (typeof filter === 'boolean') filter = this.map.label
      let reg = new RegExp(f, 'i')
      let results = []
      for (let j = 0; j < this.source.length; j++) {
        let item = this.source[j]
        if (reg.test(filter ? item[filter] : item)) results.push(item)
        if (results.length > 50) break
      }
      this.filterOptions = results
      this.elSelect.$nextTick(() => {
        this.elSelect.broadcast('ElOptionGroup', 'queryChange');
      })
    },
    setSelectedOptions (val) {
      // if (!val) return
      // console.log(val, this.sourceMap[val], 'sourceMap')
      let {multiple, sourceMap, map: m} = this
      if (!m.value) return (this.selectedOptions = val)
      if (multiple) {
        this.selectedOptions = val ? val.map(k => sourceMap[k]) : []
      } else this.selectedOptions = sourceMap[val]
    },
    setStart (val) {
      // 显示当前选中值区域
      if (!this.sourceIndex || !val) return
      if (this.source.length <= this.showCount - this.start) return
      if (this.multiple) {
        // 多选，将多选的值放在最前面
        // if (!val.length) return
        // this.stopWatchSource = true
        // val.forEach(f => {
        //   let i = this.sourceIndex[f]
        //   console.log(i, 'iiiiiiiiiiii')
        //   if (typeof i !== 'number') return
        //   this.source.splice(i, 1)
        // })
        // this.source.unshift(...this.selectedOptions)
        // this.showCount += this.selectedOptions.length
        // this.$nextTick(() => {
        //   this.stopWatchSource = false
        // })
      } else {
        // 单选，从当前选中值开始显示
        const i = this.sourceIndex[val]
        if (typeof i !== 'number') return
        this.start = Math.max(i - this.showCount + 4, 0)
      }
    },
    initLabel () {
      // 解决下拉数组没有当前值，不显示或显示id的问题
      let self = this.$refs.elSelect
      // self && self.$nextTick(() => {
      //   let m = this.map
      //   if (!m.label || m.multiple || !this.selectedOptions) return
      //   self.selectedLabel = this.selectedOptions[m.label] || this.showValue || ''
      //   // self.selected.currentLabel = self.selectedLabel
      // })
      if (!this.showValue || this.selectedOptions || !self) return
      self.selectedLabel = this.showValue || ''
    },
    onClose () {
      let self = this.$refs.elSelect
      const value = this.multiple ? [] : '';
      // self.selectedLabel = ''
      self.$emit('input', value)
      self.emitChange(value)
      self.visible = false
      self.$emit('clear')
    },
    load: throttle(function ({target}) {
      // console.log(target.scrollTop, target.clientHeight, target.scrollHeight)
      const {scrollTop, clientHeight, scrollHeight} = target
      const distance = 10
      this.lastTop || (this.lastTop = 0)
      let isScrollUp = scrollTop <= this.lastTop
      // console.log(isScrollUp ? '上滑' : '下滑')
      if (scrollTop + clientHeight + distance >= scrollHeight) {
        // console.log('下滑', this.showCount)
        this.showCount += 10
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
      let el = this.$refs.elSelect.$refs.scrollbar.$refs.wrap
      el && el.addEventListener('scroll', this.load)
    },
    removeScrollEvent () {
      let el = this.$refs.elSelect.$refs.scrollbar.$refs.wrap
      el && el.removeEventListener('scroll', this.load)
    },
    handlerSource () {
      let key = this.map.value
      for (let i = 0; i < this.source.length; i++) {
        this.sourceIndex || (this.sourceIndex = {})
        const m = this.source[i];
        let k = key ? m[key] : m
        this.sourceIndex[k] = i
        if (key) this.sourceMap[k] = m
      }
    },
    getLabel (item) {
      let {map} = this
      if (!map.label) return item
      if (map.label_en && this.$i18n.locale === 'en') return item[map.label_en]
      return item[map.label]
    },
    init () {
      // console.log('initinitinit')
      this.setSelectedOptions(this.vmodel)
      this.setStart(this.vmodel)
      this.initLabel()
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let {value, result, field} = this
        let val = value
        if (result && field) val = result[field]
        // console.log('getgetget')
        return val
      },
      set: function (val) {
        // console.log('setsetsetsetsetset')
        this.stopWatchVmodel = true
        this.$emit('input', val)
        let {result, field} = this
        if (result && field) result[field] = val
        // 待考虑，下方监听，兼容付款方式选择
        this.setSelectedOptions(val)
      }
    },
    options () {
      if (this.searchText) return this.filterOptions
      if (this.source.length < this.showCount) return this.source
      // if (this.multiple) return this.source
      return this.source.slice(this.start, this.showCount + this.start)
    },
    placeholder2 () {
      let p = this.placeholder.trim()
      if (p) return p
      return this.disabled2 ? 'Disabled' : this.$t('select_placeholder')
    },
    elSelect () {
      return this.$refs.elSelect
    },
    disabled2 () {
      return this.disabled || this.disabledMap[this.field]
    }
  },
  watch: {
    selectedOptions (n, o) {
      if (n && !o) this.$emit('get', n)
    },
    source: {
      handler (n) {
        if (this.stopWatchSource) return
        this.handlerSource()
        this.init()
        // if (this.multiple) this.showCount = n.length || this.showCount
      },
      immediate: true
    },
    vmodel: {
      handler () {
        if (this.stopWatchVmodel) return
        // console.log('vmodelvmodel')
        this.init()
      },
      immediate: true
    }
  },
  data () {
    return {
      filterOptions: [],
      selectedOptions: null,
      showCount: 10,
      start: 0,
      sourceMap: {},
      searchText: ''
    }
  },
  mounted () {
  },
  created () {
  },
  beforeDestroy () {
    this.removeScrollEvent()
  }
}
</script>
<style lang="scss">
  .x-select {
    position: relative;
    .select-close {
      position: absolute;
      right: 30px;
      z-index: 10;
      background: white;
      padding-left: 5px;
      height: 28px;
      line-height: 28px;
      top: 2px;
      display: none;
      [class^=el-icon-] {
        color: #C0C4CC;
        font-size: 14px;
        cursor: pointer;
      }
    }
    &:hover {
      .select-close {
        display: inline;
      }
    }
    .el-select__tags {
      overflow: auto;
      max-height: 100px;
    }
  }
</style>
