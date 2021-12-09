<template lang="html">
  <div class="cust-edit">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    icon: v => v.cust_type === '4' ? 'icon-sup' : 'icon-cust',
  },
  data() {
    return {
      2: ['CustComInfo', 'CustSettingPrice', 'CustSettingBrand', 'CustContacts'],
      // 2: ['CustComInfo', 'CustSettingPrice', 'CustMallSetting', 'CustSettingBrand', 'CustContacts'],
      4: ['CustComInfo', 'CustContacts', 'SupComProfile'],
      9999: ['CustComInfo', 'CustContacts'],
    }
  },
  methods: {
    async initialize () {
      let d = await this.$get2('/api/crm/queryCustCompany', {cust_com_id: this.payload.cust_com_id})
      let {cust_type, busi_group_id, cust_com_id, owner_id, com_name, legal_id} = d.cust_company
      let query = {...this.payload, cust_type, busi_group_id, cust_com_id, owner_id, com_name, legal_id}
      let parts = this[cust_type || this.payload.cust_type] || this[2]

      // 假如页面配置了联系人，菜单就删除联系人
      if (cust_type === '2' || cust_type === '4') {
        let {pages} = await this.$cache.getCustPage(cust_type)
        if (pages.find(f => f.id === 'CustContacts')) parts = parts.filter(f => f !== 'CustContacts')
      }

      let show = this.payload.show || parts[0]
      this.$tab.push({
        slot: true,
        parts,
        show,
        query,
        show_menus: true,
      })
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
</style>
