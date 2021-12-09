<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="d-content">
      <div>{{$t('same_model_not')}}</div>
      <x-table :data="datas">
        <x-table-column>
          <t slot="header" path="model">型号</t>
          <template slot-scope="scope">
            {{scope.row.model}}
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="supplier_no">ERP品号</t>
          <template slot-scope="scope">
            {{scope.row.supplier_no}}
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod_no">公司货号</t>
          <template slot-scope="scope">
            {{scope.row.prod_no}}
          </template>
        </x-table-column>
      </x-table>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button @click="onConfirm('part')" >{{$t('public_part')}}</el-button>
      <el-button type="primary" @click="onConfirm('all')" >{{$t('public_all')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      datas: []
    }
  },
  computed: {},
  methods: {
    async onConfirm(type) {
      this.onCallback(type).then(() => {
        this.onClose()
      })
    },
    onChange (v) {
      v = v || {}
      this.vm.x_prod_sort = v.sort_name
      this.vm.x_prod_sort_en = v.sort_name_en
      // this.selectOption = v || {}
    }
  },
  created() {},
};
</script>

<style lang="scss">
.select-cust-com-dialog {
}
</style>
