<template lang="html">
  <div class="prod-thead-setting-detail">
    <div class="tab-page-header flex-b fixed-top">
      <div class="h-left"></div>
      <div class="h-right">
        <el-button type="primary" @click="onSetDflt">
            <t path="restore_default">恢复默认</t>
        </el-button>
        <el-button type="primary" @click="onAddBtn">
            <t path="add">添加</t>
        </el-button>
      </div>
    </div>
    <x-table :data="datas" draggable @on-drop="onSave" row-key="title_en">
      <x-table-column type="index">
        <t slot="header" path="no">序号</t>
      </x-table-column>
      <x-table-column prop="title">
        <t slot="header" path="thead_title">中文表头</t>
      </x-table-column>
      <x-table-column prop="title_en">
        <t slot="header" path="thead_title_en">英文表头</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="display">展示</t>
        <template slot-scope="{row}">
          <div v-for="item in row.display" :key="item.id">
            {{(displaymap[item.id] || {}).cn}}
          </div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row, $index}" v-if="!row.disabled">
          <div><el-button type="text" @click="onEdit(row, $index)">{{ $t('edit') }}</el-button></div>
          <div><el-button type="text" @click="onDelete(row, $index)" class="text-danger">{{ $t('delete') }}</el-button></div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
import {getProd} from './setting.js'
import {getDefault} from '@/views/setting/prod-th/th.js'
import {getExtendApp} from '@/lib/fields/prod-extend.js'
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      datas: [],
      displayMap: {}
    }
  },
  computed: {
  },
  methods: {
    async initialize () {
      await this.getDatas()
      this.displaymap = {
        ...getProd(this.payload.filter)._object('id'),
        ...getExtendApp('th')._object('id')
      }
    },
    async getDatas () {
      if (!this.payload.type) return
      this.$configure.getValue(this.payload.type, this.$state('me').com_id).then(data => {
        this.datas = data[this.payload.type] || []
      })
    },
    async onSetDflt () {
      this.datas = getDefault(this.payload.type) || []
      this.onSave()
    },
    onAddBtn() {
      let para = {
        title: this.$t('add'),
        filter: this.payload.filter || 'sc_th'
      }
      this.$dialog.ProdTheadSettingDisplay(para, data => {
        this.datas.push(data)
        this.onSave()
      })
    },
    async onSave() {
      if (!this.payload.type) return
      return this.$configure.setValue(this.payload.type, {[this.payload.type]: this.datas}, this.$state('me').com_id)
    },
    async onDelete(row, index) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      this.datas.splice(index, 1)
      this.onSave()
    },
    onEdit(row, index) {
      console.log(row)
      let para = {
        title: this.$t('edit'),
        filter: this.payload.filter || 'sc_th',
        vm: row
      }
      this.$dialog.ProdTheadSettingDisplay(para, data => {
        this.datas.splice(index, 1, data)
        this.onSave()
      })
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.prod-thead-setting-detail table th{
  color: #909399;
  border-bottom: 1px solid #EBEEF5;
  font-size: 12px;
}
</style>