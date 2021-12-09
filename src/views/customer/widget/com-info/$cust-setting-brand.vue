<template>
  <div class="cust-setting-brand">
    <div class="mb15 flex-b">
      <div>
        <span class="lh-30 text-bold text-16 mh10">配置在官网可见的品牌</span>
        <span class="text-red">不配置，则默认客户可见所有品牌</span>
      </div>
      <div>
        <x-input
          v-model="filterText"
          placeholder="输入品牌名称"
          prefix-icon="el-icon-search"
          width="200px"></x-input>
      </div>
    </div>

    <div v-for="(val, key) in brandGroups" :key="key" class="mb20">
      <span class="left-border-title">{{key | brandType}}</span>
      <span v-if="!disabled">
        <t path="select_all" class="a-link text-12 mh20" @click="handleCheckAllChange(true, val)">全选</t>
        <t path="select_not_all" class="a-link text-12" @click="handleCheckAllChange(false, val)">全不选</t>
      </span>
      <div>
        <el-checkbox v-for="b in val" :key="b.brand_id" v-model="b.checked" @change="handleCheckedChange(b)" :disabled="disabled">{{b.brand_name}} | {{b.brand_name_en}}
          <span v-if="b.busi_status!=='normal'" class="text-danger text-12">(已停用)</span>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import {queryCustCompany, getCustInfo} from '../widget';
import Auth from '../components/auth-mixins';
export default {
  options: { title: '可见品牌' },
  mixins: [Auth],
  data() {
    return {
      allBrands: [],
      filterText: '',
      searchVm: {}
    }
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
    brandGroups () {
      return this.filterBrand.toGroup('manage_type')
    },
    filterBrand () {
      let text = this.filterText
      if (!text) return this.allBrands
      return this.allBrands.filter(f => new RegExp(text, 'i').test(f.brand_name + '~' + f.brand_name_en))
    }
  },
  methods: {
    getCustInfo,
    queryCustCompany,
    initialize() {
      this.getBrandList()
      queryCustCompany.call(this)
      getCustInfo.call(this)
    },
    getBrandList() {
      this.$request2('/api/b2b/queryCompanyBrandList').then(data => {
        this.refresh()
        this.allBrands = (data.company_brands || []).reduce((pre, item) => {
          item.checked = false
          item.cust_brand_id = ''
          pre.push(item)
          return pre
        }, [])
      })
    },
    refresh(opt) {
      return this.$get2(
        '/api/b2b/queryCustomerBrandList',
        this.searchVm,
        opt
      ).then(data => {
        let map = data.cust_brands._object('brand_id')
        this.allBrands.forEach(m => {
          let {cust_brand_id} = (map[m.brand_id] || {})
          Object.assign(m, {checked: !!cust_brand_id, cust_brand_id})
        })
      })
    },
    handleCheckAllChange(val, all) {
      val && this.onAddBand(all._filter(f => !f.checked, 'brand_id'))
      val || this.onDeleteBand(all._filter(f => f.checked, 'cust_brand_id'))
      all.forEach(f => (f.checked = val))
    },
    handleCheckedChange(item) {
      item.checked && this.onAddBand([item.brand_id])
      item.checked || this.onDeleteBand([item.cust_brand_id])
    },
    onAddBand (brands) {
      if (!brands.length) return
      let pram = {
        ...this.searchVm,
        brands
      }
      this.$post2('/api/b2b/addCustomerBrand', pram).then((data) => {
        this.refresh({loading: false})
      })
    },
    onDeleteBand(cust_brands) {
      if (!cust_brands.length) return
      let pram = {
        cust_brands
      }
      this.$post2('/api/b2b/deleteCustomerBrand', pram).then(data => {
        this.refresh({loading: false})
      })
    },
  },
  created() {
    if (this.payload.cust_id) {
      this.searchVm.cust_id = this.payload.cust_id
    } else this.searchVm.cust_com_id = this.payload.cust_com_id
    this.initialize()
  },
}
</script>

<style lang="scss">
.cust-setting-brand {
  .el-checkbox {
    width: 230px;
    margin-top: 5px;
  }
}
</style>
