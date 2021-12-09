<template>
  <div class="stock-process">
    <div class="tab-page-header flex-b fixed-top h-b">
      <div class="h-left lh-30">
      </div>
      <div class="h-right">
      </div>
    </div>
    <x-table :data="datas">
      <x-table-column type="index">
        <t slot="header" path="no">序号</t>
      </x-table-column>
      <x-table-column prop="process_name">
        <t slot="header" path="set.process_name">进度中文</t>
        <template slot-scope="{row}">
          <x-input :result="row" field="process_name" @save="onEdit"></x-input>
        </template>
      </x-table-column>
      <x-table-column prop="process_name_en">
        <t slot="header" path="set.process_name_en">进度英文</t>
        <template slot-scope="{row}">
          <x-input :result="row" field="process_name_en" @save="onEdit"></x-input>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="set.process_type">进度类型</t>
        <template slot-scope="{row}">
          <x-input :result="row" field="process_type" @save="onEdit"></x-input>
        </template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row, $index}">
          <i class="el-icon-delete text-17 text-red" @click="onDelete(row, $index)"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datas: []
    };
  },
  methods: {
    init() {
      this.getDatas()
    },
    async getDatas () {
      let v = await this.$get2('/api/manage/queryStockProcess')
      this.datas = v.stock_process || []
    },
    async onEdit (v, {process_id}) {
      let para = {
        ...v,
        process_id
      }
      await this.$post2('/api/manage/editStockProcess', para)
    },
    async onDelete ({process_id}, i) {
      await this.$post2('/api/manage/deleteStockProcess', {process_id})
      this.datas.splice(i, 1)
    }
    // onSave () {
    //   this.setConfigure('stock_process_config')
    // },
    // async getConfigure(field) {
    //   let v = await this.$configure.getValue(field, this.instance)
    //   this[field] = v[field] || this[field]
    // },
    // async setConfigure (field) {
    //   this.$configure.setValue(field, {[field]: this[field]}, this.instance)
    // }
  },
  created () {
    this.init()
  }
};
</script>

<style scoped></style>
