<template>
  <div>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        默认备货方式
      </div>
      <el-form label-position="left" label-width="100px">
        <el-form-item v-for="item in contractTypes" :key="item.field" :label="item.title">
          <x-check :result="vm[item.field]" field="stock_type" @save="onSave" v-for="d in stockTypes" :key="d.key" :expect="d.key" unexpect="" class="mr10">{{d.text}}</x-check>
        </el-form-item>
      </el-form>
    </x-fold>
  </div>
</template>

<script>
export default {
  options: {title: '订单类型', icon: 'icon-set'},
  components: {},
  data() {
    const stockTypes = [
      {text: '采购', key: 'purchase'},
      {text: '库存', key: 'inventory'},
      {text: '不处理', key: 'undo'},
    ]
    return {
      instance: '',
      contractTypes: [
        {title: 'SC外销订单', field: 'sc'},
        {title: 'SD内销订单', field: 'sd'},
        {title: 'EC电商订单', field: 'ec'},
      ],
      vm: {
        sc: {stock_type: 'purchase'},
        sd: {stock_type: 'purchase'},
        ec: {stock_type: 'purchase'},
      },
      rela_deal_setting: {
        rela_cust: '',
        rela_legal: '',
        rela_currency: '',
        rela_price: {
          type: 'pu_rate',
          pu_rate: '',
          sale_rate: '',
          sale_gross_rate: ''
        },
        rela_pu_type: 'im_pu'
      },
      stockTypes,
    };
  },
  methods: {
    onSave() {
      let field = 'contract_type'
      return this.$configure
        .setValue(field, { [field]: this.vm }, this.instance)
    },
    async init () {
      let field = 'contract_type'
      let v = await this.$configure.getValue(field, this.instance)
      this.$h.merge(this.vm, v[field] || {})
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.init();
  },
};
</script>
