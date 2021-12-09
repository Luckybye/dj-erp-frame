<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="change_prod" colon>换货</t></div>
    <div class="d-content">
      <x-label :note="prod.prod_no" labelWidth="120px">
        <t slot="label" path="current_supplier_no" colon>当前批次ERP号:</t>
      </x-label>
      <x-label :note="prod.model" labelWidth="120px">
        <t slot="label" path="current_model" colon>当前型号:</t>
      </x-label>
      <x-input
        type="textarea"
        class="mt10"
        field="reason"
        labelWidth="120px"
        :result="vm">
        <t slot="label" path="reason" colon>原因说明:</t>
      </x-input>
      <el-table :data="datas" tooltip-effect="dark" style="width: 100%">
        <!-- <el-table-column type="selection"  width="50"></el-table-column> -->
        <el-table-column width="100">
          <t slot="header" path="no">序号</t>
          <template slot-scope="scope">
            <el-radio
            :label="scope.row.prod_id"
            v-model="vm.prod_id"
            :disabled="prod.prod_id === scope.row.prod_id">{{scope.$index + 1}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="supplier_no">工厂货号</t>
          <template slot-scope="scope">
            {{scope.row.supplier_no}}
            <!-- {{scope.row.id_code}} -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('prod_no')">
          <t slot="header" path="prod_no">货号</t>
          <template slot-scope="scope">
            {{scope.row.prod_no}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="prod_description">产品说明</t>
          <template slot-scope="scope">
            {{scope.row.prod_name_en || scope.row.prod_name}}
          </template>
        </el-table-column>
      </el-table>
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
export default {
  data() {
    return {
      datas: [],
      isSelectedProd: false,
      vm: {
        reason: '',
        prod_id: ''
      },
      prod: {}
    };
  },
  computed: {},
  methods: {
    onConfirm() {
      if (!this.vm.prod_id) return
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    },
    getDatas () {
      if (!this.prod.model) return
      return this.$get2('/api/product/queryProductByModel', {model: this.prod.model}).then(res => {
        this.datas = res.prod_infos || []
        if (res.count >= 0) this.searchModel.count = res.count;
        return res;
      })
    },
    // handleSelectionChange (val) {
    //   this.vm.prod_id = val.prod_id
    // },
  },
  created() {
    this.getDatas();
  },
};
</script>
<style lang="scss">
</style>
