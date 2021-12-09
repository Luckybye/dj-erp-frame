<template>
  <el-dialog
    :visible="true"
    width=""
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <t path="change_prod">换货</t>
    </div>
    <x-table :data="datas" :page="searchModel" @page-change="refresh" singleSelect @selection-change="val => selection = val">
      <x-table-column type="selection" width="60"></x-table-column>
      <x-table-column type="index" width="60"></x-table-column>
      <x-table-column label="产品" width="">
        <x-td-img :src="row.main_pic" slot-scope="{ row }"></x-td-img>
      </x-table-column>
      <x-table-column label="ERP品号" width="" prop="supplier_no">
      </x-table-column>
      <x-table-column label="货号" width="">
        <template slot-scope="{ row }">
          <div title="货号">{{ row.prod_no }}</div>
          <div title="型号" class="text-grey">{{ row.model }}</div>
        </template>
      </x-table-column>
      <x-table-column label="描述" width="">
        <template slot-scope="{ row }">
          <div class="line-2">{{ row.prod_name_en }}</div>
        </template>
      </x-table-column>
    </x-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      datas: [],
      tempModel: {},
      searchModel: {
        page_index: 1,
        page_size: 15,
        count: 0
      },
      selection: []
    }
  },
  methods: {
    initialize() {
      this.refresh()
    },
    refresh() {
      return this.$request2('/api/product/queryProductByModel', {
        model: this.tempModel.model,
      }).then(d => {
        this.datas = d.prod_infos || []
        if ('count' in d) this.searchModel.count = d.count
        return d
      })
    },
    onConfirm() {
      let v = this.selection[0]
      if (!v || !v.prod_id) {
        this.$message('请选择换货商品')
        return
      }
      this.onCallback(v).then(() => {
        this.onClose()
      })
    },
  },
  created() {
    if (this.param) {
      this.tempModel = this.param
    }
    this.initialize()
  },
}
</script>

<style></style>
