<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <el-form class="d-content" label-width="80px">
      <el-form-item label="供应商:" v-if="prod.is_bom === 'no'">
        <select-cust-com
          width="100%"
          :result="prod"
          field="seller_id"
          :pm="{custType: '4'}"
          @change="onSelectSupplier"
        ></select-cust-com>
      </el-form-item>
      <el-form-item label="工厂货号:">
        <x-input width="100%" field="supplier_no" :result="prod"></x-input>
      </el-form-item>
      <el-form-item label="价格:">
        {{currency}}
        <x-input width="calc(100% - 35px)" field="pu_price" :result="prod" type="number" :readonly="prod.is_virtual === 'yes'"></x-input>
      </el-form-item>

      <el-form-item label="Moq:">
        <x-input width="100%" field="moq" :result="prod" :unit="prod.prod_unit" type="number"></x-input>
      </el-form-item>

      <el-form-item label="交货期:">
        <x-input width="100%" field="delivery_day" :result="prod" unit="天" type="number"></x-input>
      </el-form-item>
    </el-form>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      prod: {}
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      let { pu_price, x_seller_id, seller_id, bill_prod_id, moq, delivery_day, supplier_no } = this.prod
      let para = {pu_price, x_seller_id, seller_id, bill_prod_id, moq, delivery_day, supplier_no}
      this.onCallback(para).then(() => {
        this.onClose()
      })
    },
    onSelectSupplier (item = {}) {
      this.prod.x_seller_id = item.com_name
    }
  },
  created() {},
};
</script>

<style lang="scss">
.select-cust-com-dialog {
}
</style>
