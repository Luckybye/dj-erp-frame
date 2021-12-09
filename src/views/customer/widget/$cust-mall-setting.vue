<template lang="html">
  <div class="cust-mall-setting">
    <!-- <div class="tab-page-title full">
      <span class="left-border-title">客户登录官网后产品价格显示</span>
    </div> -->
    <div class="title_1 left-border-title">客户登录官网后产品价格显示</div>
    <div class="flex mt20">
      <div v-for="item in cust_mall_prices" :key="item.expect">
        <x-check class="ml20" :result="vm" field="cust_mall_price" @save="onSave('cust_mall_price')" :expect="item.expect" :unexpect="item.unexpect">{{item.text}}</x-check>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vm: {
        cust_mall_price: 'cust'
      },
      cust_mall_prices: [
        {expect: 'all', unexpect: 'cust', text: '显示所有产品价格'},
        {expect: 'cust', unexpect: 'all', text: '只有专属定价的产品才显示价格'},
        {expect: 'hidden', unexpect: 'all', text: '所有产品不显示价格'},
      ],
      field: 'cust_mall_price'
    }
  },
  methods: {
    initialize () {
      this.getConfig(this.field)
    },
    getConfig (field) {
      this.$configure.getValue(field, this.payload.cust_com_id).then((res) => {
        this.vm[field] = res[field] || 'cust'
      })
    },
    onSave(field) {
      // this.$configure.setValue(field, {[field]: this.vm[field]}, this.instance).then(res => {
      // })
    }
  },
  created () {
    this.initialize()
  }
}
</script>
