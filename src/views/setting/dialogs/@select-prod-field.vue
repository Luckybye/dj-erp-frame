<template>
  <el-dialog
    :visible="true"
    width="600px"
    @close="onClose"
    :close-on-click-modal="false"
    title="选择显示字段"
  >
    <div class="mb10 text-left flex-row">
      <span class="cursor ml15 text-blue">
        <span @click="selectAll(false)" class="mr20">取消全选</span>
        <span @click="selectAll(true)">全选</span>
      </span>
    </div>
    <div class="stats-pu-prod-field">
      <div v-for="item in allTitleDatas" class="prod-item" :key="item.key">
        <div class="check" @click="onSelectField(item)">
          <span class="radio" :class="{ selected: selectedIndex(item) >= 0 }">{{
            selectedIndex(item) + 1 || ''
          }}</span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onSave">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
let custProds = [
  {
    table: 'cust_prod',
    key: 'cust_prod_no',
    type: 'string',
    value: '',
    text: '客户货号',
  },
  {
    table: 'cust_prod',
    key: 'cust_prod_barcode',
    type: 'string',
    value: '',
    text: '客户条形码',
  },
  {
    table: 'cust_prod',
    key: 'cust_hs_code',
    type: 'string',
    value: '',
    text: '进口海关编码',
  },
  {
    table: 'cust_prod',
    key: 'cust_com_id',
    type: 'string',
    value: '',
    text: '客户',
  },
  {
    table: 'cust_prod',
    key: 'trade_term',
    type: 'string',
    value: '',
    text: '贸易条款',
  },
  {
    table: 'cust_prod',
    key: 'price',
    type: 'string',
    value: '',
    text: '客户售价',
  },
  {
    table: 'cust_prod',
    key: 'currency',
    type: 'string',
    value: '',
    text: '客户售价币种',
  },
]
let extend = [
  {
    table: 'prod_info',
    key: 'x_prod_sort_en',
    type: 'string',
    value: '',
    text: '分类_en',
  },
  {
    table: 'prod_info',
    key: 'x_brand_id_en',
    type: 'string',
    value: '',
    text: '品牌_en',
  },
]
function initialize() {
  this.allTitleDatas = window._g.getImportProdFields('pm').concat(extend)
  if (this.need_cust) this.allTitleDatas = this.allTitleDatas.concat(custProds)
}
export default {
  data() {
    return {
      allTitleDatas: [],
    }
  },
  methods: {
    onSave() {
      this.onCallback(this.selected).then(() => {
        this.onClose()
      })
    },
    selectAll(bool) {
      if (bool) {
        this.selected = []
        for (let i = 0; i < this.allTitleDatas.length; i++) {
          let param = {
            title: '',
            value: this.allTitleDatas[i],
          }
          this.selected.push(param)
        }
      } else {
        this.selected = []
      }
    },
    onSelectField(item) {
      let i = this.selectedIndex(item)
      if (i >= 0) {
        this.selected.splice(i, 1)
      } else {
        let param = {
          title: '',
          value: item,
        }
        this.selected.push(param)
      }
    },
    selectedIndex(item) {
      let index = -1
      for (let i = 0; i < this.selected.length; i++) {
        if (item.text === this.selected[i].value.text) {
          index = i
          break
        }
      }
      return index
    },
  },
  computed: {},
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss">
.stats-pu-prod-field {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  .prod-item {
    text-align: left;
    white-space: nowrap;
    width: 50%;
    .check {
      display: inline-block;
      line-height: 28px;
      cursor: pointer;
      .radio {
        display: inline-block;
        border: 1px solid #c0ccda;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 10px;
        vertical-align: middle;
        line-height: 18px;
        text-align: center;
        &.selected {
          color: white;
          background: #6d78e7;
        }
      }
    }
  }
}
</style>
