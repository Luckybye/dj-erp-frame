<template>
  <div class="more-search" :style="{'--labelWidth': labelWidth}">
    <slot></slot>
    <el-form class="search--more" v-if="parts2.length && show" v-show="showMore2" :label-width="labelWidth" label-position="left">
      <el-row :gutter="gutter" type="flex">
        <template v-for="(item, i) in parts2">
          <el-col :key="item.key || i" :span="item.span || 12" class="mt10" v-if="!item.hidden">
            <component
            :is="item.part"
            v-if="item.part"
            :result="vmodel"
            :field="item.field"
            :field2="item.field2"
            :clearable="item.clearable"
            width="100%"
            :multiple="item.multiple"
            :checkStrictly="item.checkStrictly"
            :collapseTags="item.collapseTags"
            :pm="item"
            :disabled="item.disabled"
            :disabledMap="disabledMap"
            @change="onSelect(item)"
            @save="addChangeVm"
            :label-width="labelWidth">
              <span slot="label" v-if="searchKey">{{$tt(item, 'text') || item.label}}:</span>
              <t slot="label" :path="item.key" colon v-else>{{item.label}}</t>
            </component>
            <slot :name="item.slot" v-else-if="item.slot" :vmodel="vmodel" :change="addChangeVm" :pm="item" :labelWidth="labelWidth">
            </slot>
          </el-col>
        </template>
      </el-row>
      <div class="search--confirm text-center mt15">
        <el-button @click="showMore2=false">{{$t('fold')}}</el-button>
        <el-button type="danger" class="ml30" @click="onReset">{{$t('reset')}}</el-button>
        <el-button type="primary" class="ml30" @click="onConfim">{{$t('confirm')}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import {getQueryMap, getDefault} from '@/views/setting/prod/prod-query.js'
import Vue from 'vue'
export default {
  name: 'moreSearch',
  props: {
    gutter: {
      type: Number,
      default: 20
    },
    vm: {
      type: Object,
      default () {
        return {}
      }
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    parts: {
      type: Array,
      default () {
        return []
      }
    },
    extend: {
      type: Array,
      default () {
        return []
      }
    },
    showMore: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    searchKey: String,
    confirmChange: Boolean
  },
  methods: {
    onReset () {
      this.parts.forEach(m => {
        let f = m.field
        let {vmodel, disabledMap} = this
        if (f && vmodel[f] && !m.disabled && m.clearable !== false && !disabledMap[f]) {
          if (Array.isArray(vmodel[f])) {
            vmodel[f] = []
          } else if (this.$h.isDate(vmodel[f])) {
            vmodel[f] = null
            if (m.field2) vmodel[m.field2] = null
          } else if (typeof vmodel[f] === 'object') {
            vmodel[f] = {}
          } else {
            vmodel[f] = null
            if (m.field2) vmodel[m.field2] = null
          }
        }
      })
      this.confirmChangeFun('reset')
      this.$nextTick(() => {
        this.$emit('reset')
      })
    },
    addChangeVm (v) {
      if (this.confirmChange) {
        this.changeModel = {...this.changeModel, ...this.$h.cloneDeep(v)}
        // console.log(this.changeModel, 'changeModelchangeModelchangeModel')
      }
    },
    confirmChangeFun (type) {
      if (this.confirmChange && type === 'reset') {
        let v = this.$h.cloneDeep(this.vmodel)
        delete v.x_searchLast
        Object.assign(this.vm, v)
      } else if (this.confirmChange && this.changeModel) {
        Object.assign(this.vm, this.changeModel)
      }
      this.changeModel = ''
    },
    onConfim () {
      this.confirmChangeFun()
      this.$nextTick(() => {
        this.$emit('confirm')
      })
    },
    listenMoreBtn () {
      let ref = this.$el.querySelector('.more--btn')
      ref && ref.addEventListener('click', () => {
        this.showMore2 = !this.showMore2
        this.$nextTick(() => {
          this.showMore2 && this.handleSortSelect()
        })
      })
    },
    async getSearchConfig () {
      let field = this.searchKey
      if (!field) return
      let v = await this.$configure.getValue(field, this.$state('me').com_id)
      v = v[field]
      if (!v || !v.length) v = getDefault(field)
      this.parts.length = 0
      let partMap = getQueryMap()
      v.forEach((m, i) => {
        let part = partMap[m.key]
        if (m.key === 'attribute') {
          this.hasAttribute = i
        } else if (part && part.component) {
          const fields = part.field.split(',')
          this.parts.push({
            ...m,
            part: part.component,
            span: 12,
            field: fields[0],
            field2: fields[1],
            multiple: !!this.vmodel[fields[0]] && Array.isArray(this.vmodel[fields[0]]),
            ...part.extend
          })
        } else if (/[a-z0-9]{12,}/.test(m.key)) {
          this.parts.push({
            ...m,
            part: 'select-nature',
            span: 12,
            field: 'extend_natures',
            multiple: true
          })
        }
      })
      if (this.extend && this.extend.length) this.parts.push(...this.extend)
    },
    onSelect (item) {
      if (item.key === 'prod_sorts') this.handleSortSelect()
    },
    handleSortSelect () {
      if (this.hasAttribute < 0) return
      Object.values(this.sortAttrs).forEach(m => {
        m.show = false
      })
      this.vmodel.prod_sorts.forEach(id => {
        if (this.sortAttrs[id]) {
          this.sortAttrs[id].show = true
        } else this.querySortAttr(id)
      })
    },
    querySortAttr (id) {
      this.$get('/api/product/querySortAttr', {sort_id: id}, {loading: false}).then(v => {
        let attrs = v.sys_natures || []
        Vue.set(this.sortAttrs, id, {show: true, attrs})
      })
    }
  },
  computed: {
    parts2 () {
      if (this.hasAttribute < 0) return this.parts
      const obj = {}
      Object.values(this.sortAttrs).forEach(f => {
        f.show && f.attrs.forEach(m => {
          if (!obj[m.nature_id]) {
            obj[m.nature_id] = {
              key: m.nature_id,
              text: m.nature_name,
              text_en: m.nature_name_en,
              part: 'select-nature',
              span: 12,
              field: 'extend_natures',
            }
          }
        })
      })
      // console.log(obj, 5555)
      const arr = Object.values(obj)
      if (!arr.length) return this.parts
      let arr2 = [...this.parts]
      arr2.splice(this.hasAttribute, 0, ...arr)
      return arr2
    },
  },
  data () {
    return {
      show: false,
      showMore2: false,
      hasAttribute: -1,
      sortAttrs: {},
      vmodel: {}
    }
  },
  watch: {
    showMore2 (n) {
      this.$nextTick(() => {
        this.show = this.show || n
      })
    },
    showMore (n) {
      this.showMore2 = n
    },
  },
  mounted () {
    this.showMore2 = this.showMore
    this.listenMoreBtn()
  },
  created () {
    this.getSearchConfig()

    let unWatchVm
    this.$watch('confirmChange', (n) => {
      if (n) {
        unWatchVm = this.$watch('vm', (val) => {
          this.vmodel = this.$h.cloneDeep(val)
        }, {immediate: true, deep: true})
      } else if (unWatchVm) {
        unWatchVm()
      } else {
        this.vmodel = this.vm
      }
    }, {immediate: true})
  }
}
</script>
<style lang="scss">
.more-search {
  .x-component + .x-component {
    margin-left: 10px;
  }
  .x-component + .el-button {
    margin-left: 10px;
  }
  .x-form-label {
    width: var(--labelWidth);
  }
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      text-align: left;
    }
  }
  // &>div:first-child {
  //   .el-cascader__tags, .el-select__tags {
  //     flex-wrap: nowrap;
  //     overflow: hidden;
  //   }
  // }
}
</style>
