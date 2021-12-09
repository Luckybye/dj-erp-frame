<template>
  <el-dialog
    :visible="true"
    width="800px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title">{{ title }}({{selection.length}})</div>
    <div class="d-content">
      <el-form ref="form" label-width="100px" class="text-form">
        <el-form-item :label="$t('thead_title')">
          <x-input v-model="vm.title"></x-input>
        </el-form-item>
        <el-form-item :label="$t('thead_title_en')">
          <x-input v-model="vm.title_en"></x-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('is_resizable')">
          <el-checkbox
            :label="true"
            v-model="vm.resizable"
          >{{$t('is_resizable')}}</el-checkbox>
        </el-form-item> -->
        <el-form-item :label="$t('width')">
          <div>
            <el-checkbox
              true-label=""
              :false-label="80"
              v-model="vm.width"
            >自动宽度（列表平均分配剩余宽度）</el-checkbox>
            <el-checkbox
              v-if="vm.width !== ''"
              :label="true"
              v-model="vm.minWidth"
            >最小宽度（在当前宽度下，加上按比例分配的剩余宽度）</el-checkbox>
          </div>
          <div v-if="vm.width !== ''">
            当前宽度：<el-input-number v-model="vm.width" :min="1" :max="1000"></el-input-number>
            <span class="ml15"></span>
            宽度预览(内容可改): <div class="t-cell" contenteditable :style="{width: vm.width+'px'}">内容</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('is_fixed')">
          <el-checkbox
            :label="true"
            v-model="vm.fixed"
          >{{$t('is_fixed')}}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('display')">
          <x-input v-model="tempVm.filter" placeholder="搜索" clearable></x-input>
          <el-table :data="datas2" @selection-change="selectionChange" ref="noteTable" row-key="id">
            <el-table-column type="selection" :selectable="selectable" reserve-selection>
            </el-table-column>
            <el-table-column type="index">
              <t slot="header" path="no">序号</t>
            </el-table-column>
            <el-table-column>
              <t slot="header" path="prod_nature">产品属性</t>
              <template slot-scope="{row}">
                {{row.cn}}
              </template>
            </el-table-column>
            <el-table-column>
              <t slot="header" path="prod_nature_en">产品属性</t>
              <template slot-scope="{row}">
                {{row.en}}
              </template>
            </el-table-column>
            <el-table-column>
              <t slot="header" path="selectable_action">可选操作</t>
              <template slot-scope="{row}" v-if="row.extend">
                <el-checkbox
                  :true-label="row.slot"
                  false-label=""
                  v-model="vm.slot"
                  v-if="row.extend.edit"
                  @change="onCanEdit(row)"
                >是否可以编辑</el-checkbox>

                <x-check
                  type="checkbox"
                  v-model="row.action.link"
                  v-if="row.extend.link"
                  :expect="true"
                  unexpect=""
                >是否可以跳转</x-check>

                <x-select :source="lines" v-model="row.action.line" label="显示几行" :map="{label: 'text', value: 'key'}" v-if="row.extend.line" width="160px"></x-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getProd} from './setting.js'
import {getExtendApp} from '@/lib/fields/prod-extend.js'
export default {
  data() {
    return {
      datas: [],
      vm: {
        title: '',
        title_en: '',
        fixed: false,
        resizable: true,
        type: '',
        slot: '',
        display: [],
        width: '',
        minWidth: ''
      },
      selection: [],
      isSingle: false,
      lines: [
        {key: '', text: 'All'},
        {key: '1', text: '1'},
        {key: '2', text: '2'},
        {key: '3', text: '3'},
      ],
      tempVm: {filter: ''}
    }
  },
  computed: {
    datas2 () {
      let filter = this.tempVm.filter
      return this.datas.filter(m => {
        let text = m.en + '~' + m.cn + '~' + (m.slot || '') + '~' + m.id
        if (typeof m.value === 'string') text = text + '~' + m.value
        return new RegExp(filter, 'i').test(text)
      })
    }
  },
  methods: {
    async init() {
      let d = getExtendApp('th')
      let arr = [
        {id: 'index', en: 'NO', cn: '序号'},
        // {id: 'selection', en: '选择框', cn: '选择框', slot: 'selection', extend: {single: true}},
        ...getProd(this.filter),
        ...d,
      ]
      let actionMap = this.vm.display._object('id')
      this.datas = arr.map(m => {
        return {
          ...m,
          action: {
            unit: '',
            sort: '',
            line: '',
            ...actionMap[m.id]
          }
        }
      })
    },
    onConfirm() {
      if (!this.vm.title) {
        this.$message(this.$t('pls_input_chiness'))
        return
      }
      if (!this.vm.title_en) {
        this.$message(this.$t('pls_input_english'))
        return
      }
      if (!this.selection.length) {
        this.$message(this.$t('pls_choose_display'))
        return
      }
      this.vm.display = this.selection.map(m => {
        return {
          ...m.action,
          id: m.id
        }
      })
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    },
    selectable (row) {
      return !this.isSingle || (this.isSingle && row === this.selection[0])
    },
    selectionChange (val) {
      console.log('selectionChange', val)
      this.selection = val
      this.vm.type = ''
      val.forEach(m => {
        let hasType = m.id === 'index'
        if (hasType) this.vm.type = m.id
        this.isSingle = hasType || !!this.vm.slot || (m.extend || {}).single
      })
      if (this.isSingle) this.selection = [val[val.length - 1]]
      if (!val.length) {
        this.vm.slot = ''
        this.isSingle = false
        return
      }
      let extend = val[val.length - 1].extend || {}
      if (extend.single || !extend.edit) this.vm.slot = val[val.length - 1].slot
      this.vm.title = this.vm.title || val[0].cn
      this.vm.title_en = this.vm.title_en || val[0].en
    },
    onCanEdit (v) {
      if (!this.vm.slot) {
        this.isSingle = false
        return
      }
      this.$refs.noteTable.clearSelection()
      this.vm.slot = v.slot
      this.$refs.noteTable.toggleRowSelection(v, true)
    },
  },
  created() {
    this.init();
  },
  mounted () {
    let map = this.datas._object('id')
    this.$nextTick(() => {
      this.vm.display.forEach(m => {
        this.$refs.noteTable.toggleRowSelection(map[m.id], true);
      })
    })
  }
};
</script>
<style lang="scss">
.prod-thead-setting-display-dialog {
  .t-cell {
    background: grey;
    padding: 5px 10px;
    display: inline-block;
    line-height: normal;
    color: white;
    font-size: 12px;
  }
}
</style>
