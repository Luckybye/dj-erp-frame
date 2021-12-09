<template lang="html">
  <div class="prod-nature">
    <div class="tab-page-header flex-b">
      <div>
        <span class="left-border-title">{{$t('cmpt.' + componentName)}}</span>
      </div>
      <div class="">
        <x-input
          :result="searchModel"
          field="fuzzy_value"
          width="200px"
          @blur-change="initialize"
          @enter="initialize"
          clearable
          prefix-icon="el-icon-search"
        ></x-input>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="editProdNature()"
        ></el-button>
      </div>
    </div>

    <x-table :data="datas">
      <x-table-column label="编码" width="" prop="nature_no"></x-table-column>
      <x-table-column label="属性中文" width="" prop="nature_name">
      </x-table-column>
      <x-table-column label="属性英文" width="" prop="nature_name_en">
      </x-table-column>
      <x-table-column label="类型" width="">
        <span slot-scope="{ row }">{{
          (natureTypeMap[row.nature_type] || {}).cn || row.nature_type
        }}</span>
      </x-table-column>
      <x-table-column label="更新" width="">
        <template slot-scope="{ row }">
          <div>{{ row.x_update_user }}</div>
          <div class="text-grey">{{ row.update_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column label="操作" width="">
        <template slot-scope="scope">
          <i
            class="el-icon-edit-outline text-17 text-blue"
            @click="editProdNature(scope.row)"
          ></i>
          <i
            class="el-icon-delete text-17 text-red ml10"
            @click="onDelete(scope.row, scope.$index)"
          ></i>
        </template>
      </x-table-column>
      <div slot="nodata">
        暂无数据
      </div>
    </x-table>
  </div>
</template>

<script>
import { refreshExtend } from '@/lib/fields/prod-extend.js'

function initialize() {
  let para = {
    ...this.searchModel,
    nature_kind: this.payload.nature_kind || 'prod',
  }
  this.$get('/api/system/querySysNature', para).then(res => {
    this.datas = res.sys_natures || []
    refreshExtend(this.datas)
  })
}
export default {
  options: { title: '商品属性' },
  data() {
    return {
      searchModel: {
        fuzzy_value: '',
        status: 'normal',
      },
      datas: [],
      natureTypeMap: [
        { en: 'text', cn: '文本' },
        { en: 'textarea', cn: '文本框' },
        { en: 'single', cn: '单选' },
        { en: 'check', cn: '复选' },
      ]._object('en'),
    }
  },
  methods: {
    initialize,
    async onDelete(item) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {
        type: 'warning',
      })
      await this.$post('/api/system/deletesNature', {
        nature_id: item.nature_id,
      })
      initialize.call(this)
    },
    editProdNature(row) {
      let { payload } = this
      this.$dialog.EditProdNature(
        {
          payload: { ...row, ...payload },
          natureMap: this.datas._object('nature_name'),
        },
        data => {
          initialize.call(this)
        }
      )
    },
  },
  filters: {},
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
  },
  created() {
    initialize.call(this)
  },
}
</script>
