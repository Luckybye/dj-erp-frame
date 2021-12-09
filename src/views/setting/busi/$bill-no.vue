<template lang="html">
  <div class="bill-no-setting">
    <div class="tab-page-header">
      <el-menu :default-active="bill_type" mode="horizontal" @select="v => bill_type = v" class="fixed-top">
        <el-menu-item v-for="(item) in billTypes" :key="item.type" :index="item.type">
          {{item.label}}
        </el-menu-item>
      </el-menu>
    </div>
    <table class="sample-table">
      <thead>
        <tr>
          <th>单据类型</th>
          <th>是否可修改</th>
          <th>前缀</th>
          <th>第一段编码</th>
          <th>第二段编码</th>
          <th>第三段编码</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in datas2" :key="row.key">
          <td>{{row.label}}</td>
          <td>
            <template v-if="row.editable">
              <el-checkbox v-model="vm[row.key].is_edit" @change="onSave" true-label="yes" false-label="no" :disabled="!isOperate"
              >是</el-checkbox> <br>
              <el-checkbox v-model="vm[row.key].is_edit" @change="onSave" true-label="no" false-label="yes" :disabled="!isOperate"
              >否</el-checkbox>
            </template>
          </td>
          <td>
            <x-input :result="vm[row.key]" field="prefix" @blur-change="onSave" width="100px" placeholder="A-" :disabled="!isOperate"></x-input>
          </td>

          <td v-if="row.first">
            <div v-for="item in row.first" :key="item.value" class="mb10">
              <el-checkbox v-model="vm[row.key].type" @change="editFirst(row)" :true-label="item.value" :false-label="getFalseLabel(row.first)" :disabled="!isOperate">
                <span class="text-grey">{{item.label}}</span>
              </el-checkbox>

              <x-input v-if="item.value === 'text'" :result="row" field="text" @blur-change="onInput(row)" class="ml10" width="100px" :disabled="!isOperate"></x-input>
              <template v-if="item.value === 'code'">
                <x-select @change="onSelectCode(row)" class="ml10" width="200px" :source="row.codes" :map="{label: 'label', value: 'value'}" v-model="row.code" multiple collapseTags :disabled="!isOperate"></x-select>
                <div class="text-12 ml25">{{handlerFirstNo(row)}}</div>
              </template>
              <div v-if="item.value === 'inherit'" class="ml10 inline-block" style="vertical-align: text-top;">
                <span>- </span>
                <x-input :result="vm[row.key]" field="replace" @blur-change="onSave" width="200px" :disabled="!isOperate" placeholder="减去‘所继承单据号’的前缀" title="减去‘所继承单据号’的前缀"></x-input>
                <br>
                <span>+</span>
                <x-select width="200px" :source="row.codes" :map="{label: 'label', value: 'value'}" v-model="vm[row.key].inherit_suffix" :disabled="!isOperate" placeholder="加上自定义后缀" title="加上自定义后缀" clearable @change="onSave"></x-select>
              </div>
            </div>
          </td>

          <td v-for="f in ['second', 'three']" :key="f">
            <div v-for="item in row[f]" :key="item.value" class="mb10">
              <el-checkbox v-model="vm[row.key][f]" @change="onSave" :true-label="item.value" :false-label="getFalseLabel(row[f])" :disabled="!isOperate">{{item.label}}</el-checkbox>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {bill} from './bill-no'
function initialize() {
  let f = 'bill_no_config'
  this.$configure.getValue(f, this.instance).then((d) => {
    this.$h.merge(this.vm, d[f] || {})
    this.handlerDatas()
  })
  // this.handlerDatas()
}
export default {
  options: { title: '单据编号', icon: 'icon-set' },
  data() {
    return {
      bill_type: 'sc',
      billTypes: [
        {type: 'sc', label: '销售'},
        {type: 'pu', label: '采购'},
        {type: 'inve', label: '库存'},
      ],
      instance: '',
      datas: [],
      vm: Object.keys(bill).map(key => {
        let v = bill[key]
        return {
          key,
          prefix: '',
          type: 'text',
          first: v.text || key.toUpperCase(),
          second: 'YY',
          three: 'SSSS',
          is_edit: v.editable ? 'yes' : 'no',
          replace: '',
          inherit_suffix: ''
        }
      })._object('key'),
    }
  },
  methods: {
    getFalseLabel (opts) {
      return opts[0].value
    },
    handlerFirstNo (row) {
      let vm = this.vm[row.key]
      if (vm.type !== 'code') return ''
      let map = row.codes._object('value')
      return vm.first.split(',')._filter(k => map[k], k => map[k].label).join('+')
    },
    onSelectCode (row) {
      let vm = this.vm[row.key]
      vm.type = 'code'
      vm.first = row.code.join(',')
      this.onSave()
    },
    onInput (row) {
      this.vm[row.key].first = row.text
      this.onSave()
    },
    editFirst (row) {
      let vm = this.vm[row.key]
      if (vm.type === 'text') {
        vm.first = row.text || row.key.toUpperCase()
        row.text = vm.first
      }
      if (vm.type === 'code') {
        vm.first = row.codes[0].value
        row.code = vm.first.split(',')
      }
      // if (vm.type === 'inherit') vm.first = ''
      this.onSave()
    },
    handlerDatas () {
      this.datas = Object.keys(bill).map(key => {
        let vm = this.vm[key]
        return {
          ...bill[key], key,
          text: vm.type === 'text' ? vm.first : '',
          code: vm.type === 'code' && vm.first ? vm.first.split(',') : [],
        }
      })
    },
    onSave() {
      let field = 'bill_no_config'
      return this.$configure.setValue(field, { [field]: this.vm }, this.instance)
    },
  },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
    datas2 () {
      return this.datas.filter(f => f.filter === this.bill_type)
    }
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
