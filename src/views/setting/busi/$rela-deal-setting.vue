<template>
  <div class="rela-deal-setting">
    <x-fold show>
      <div class="lh-30" slot="header">
        SC外销订单业务配置
      </div>
      <el-form label-position="left" label-width="100px">
        <el-form-item>
          <t slot="label" path="" colon>交易类型:</t>
          <x-check-group :result="rela_deal_setting" field="deal_types" @save="onSave" :source="dealTypes"></x-check-group>
        </el-form-item>
        <div v-show="rela_deal_setting.deal_types.indexOf('rela_deal')>=0">
          <hr class="underline">
          <div class="text-bold mv10">
            对外部客户销售的关联交易模型：
          </div>

          <div class="external-module ml20">
            <div class="module-item">
              <div class="mb10">例：香港子公司向海外客户销售</div>
              <div class="box">对外销售订单</div>
            </div>
            <div class="line">
              <svg width="110px" height="86px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="53" x2="100" y2="53"
                style="stroke:#aaaaaa;stroke-width:1"/>
                <polygon points="100,48 100,58 110,53" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
              </svg>
            </div>
            <div class="module-item">
              <div class="mb10">向国内子公司采购</div>
              <div class="box">内部采购订单</div>
            </div>
            <div class="line">
              <svg width="110px" height="86px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,53 10,58 10,48" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
                <line x1="10" y1="53" x2="100" y2="53"
                style="stroke:#aaaaaa;stroke-width:1"/>
                <polygon points="100,48 100,58 110,53" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
              </svg>
            </div>
            <div class="module-item">
              <div class="mb10">国内子公司销售给香港子公司</div>
              <div class="box">内部销售订单</div>
            </div>
            <div class="line">
              <svg width="110px" height="86px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="53" x2="100" y2="53"
                style="stroke:#aaaaaa;stroke-width:1"/>
                <polygon points="100,48 100,58 110,53" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
              </svg>
            </div>
            <div class="module-item">
              <div class="mb10">国内子公司向工厂采购</div>
              <div class="box">对外采购或使用库存</div>
            </div>
          </div>

          <el-form-item>
            <t slot="label" path="" colon>当前法人公司对应的内部客户:</t>
            <select-cust-com :result="rela_deal_setting" field="rela_cust" width="100%" @save="onSave" :optionsMethod="handlerCust"></select-cust-com>
          </el-form-item>
          <el-form-item>
            <t slot="label" path="" colon>内部交易对象:</t>
            <div><el-button type="primary" icon="el-icon-plus" @click="addDealTarget"></el-button></div>
            <x-fold show v-for="(item, i) in rela_deal_setting.deal_targets" :key="i" class="mt10">
              <div class="lh-30 flex-b" slot="header">
                <span>
                  对外部客户销售时内部交易对象 {{i + 1}}
                  <span class="text-success" v-if="i === 0">默认</span>
                  <span class="ml20 text-grey">
                    {{(legalMap[item.legal_id] || {}).legal_name}}
                  </span>
                </span>
                <span class="el-icon-delete lh-30 text-red" @click="delDealTarget(i)"></span>
              </div>
              <el-form label-position="left" label-width="170px">
                <el-form-item>
                  <t slot="label" path="" colon>内部交易对象（实际对外采购的法人）:</t>
                  <select-our-com :result="item" field="legal_id" width="100%" @save="onSave" :optionsMethod="handlerLegal"></select-our-com>
                </el-form-item>
                <el-form-item>
                  <t slot="label" path="" colon>对外采购法人公司对应的内部供应商:</t>
                  <select-cust-com :result="item" field="supplier_id" width="100%" @save="onSave" :optionsMethod="handlerCust" :pm="{custType: '4'}"></select-cust-com>
                </el-form-item>
                <el-form-item>
                  <t slot="label" path="" colon>内部采购订单的付款方式:</t>
                  <select-payment :result="item" field="pu_payment_id" width="100%" @save="onSave" :clearable="false" :map="{ value: 'id', label: 'desc', key: 'id' }"></select-payment>
                </el-form-item>
                <el-form-item>
                  <t slot="label" path="" colon>内部销售订单的收款方式:</t>
                  <select-remittance :result="item" field="sc_payment_id" width="100%" @save="onSave" :clearable="false" :map="{ value: 'id', label: 'desc', key: 'id' }"></select-remittance>
                </el-form-item>
                <el-form-item>
                  <t slot="label" path="" colon>关联交易币种:</t>
                  <select-currency :result="item" field="currency" width="100%" @save="onSave"></select-currency>
                </el-form-item>
                <el-form-item>
                  <t slot="label" path="" colon>关联交易价格:</t>
                  <x-check :result="item.rela_price" field="type" expect="pu_rate" unexpect="pu_rate" class="mr20" @save="onSave">
                    <x-input :result="item.rela_price" field="pu_rate" width="150px" @save="onSave" label="采购价 ×" unit="%" type="number" class=""></x-input>
                  </x-check>
                  <x-check :result="item.rela_price" field="type" expect="sale_rate" unexpect="sale_rate" class="mr20" @save="onSave">
                    <x-input :result="item.rela_price" field="sale_rate" width="150px" @save="onSave" label="销售价 ×" unit="%" type="number" class=""></x-input>
                  </x-check>
                  <x-check :result="item.rela_price" field="type" expect="sale_gross_rate" unexpect="sale_gross_rate" class="" @save="onSave">
                    <x-input :result="item.rela_price" field="sale_gross_rate" width="200px" @save="onSave" label="销售方分享毛利" unit="%" type="number"></x-input>
                  </x-check>
                </el-form-item>
              </el-form>
            </x-fold>
          </el-form-item>

          <hr class="underline">
          <div class="text-bold mv10">
            对内部客户销售的关联交易模型：
          </div>

          <div class="external-module ml20">
            <div class="module-item">
              <div class="mb10">例：香港子公司向美国子公司销售</div>
              <div class="box">内部销售订单</div>
            </div>
            <div class="line">
              <svg width="110px" height="86px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="53" x2="100" y2="53"
                style="stroke:#aaaaaa;stroke-width:1"/>
                <polygon points="100,48 100,58 110,53" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
              </svg>
            </div>
            <div class="module-item">
              <div class="mb10">美国子公司向香港子公司采购</div>
              <div class="box">内部进口采购订单</div>
            </div>
            <div class="line" style="width:110px">
            </div>
            <div class="module-item">
              <div class="mb10">香港子公司向工厂采购</div>
              <div class="box">对外采购或使用库存</div>
            </div>
          </div>
          <div class="line" style="margin-top:-15px">
            <svg width="700px" height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polyline points="90,1,90,20,610,20,610,1"
              style="fill:white;stroke:#aaaaaa;stroke-width:1"/>
              <polygon points="605,10 610,0 615,10" style="fill:#aaaaaa;stroke:#aaaaaa;stroke-width:1" />
            </svg>
          </div>

          <el-form-item>
            <t slot="label" path="" colon>当前法人公司对应的内部供应商:</t>
            <select-cust-com :result="rela_deal_setting.internal" field="supplier_id" width="100%" @save="onSave" :optionsMethod="handlerCust" :pm="{custType: '4'}"></select-cust-com>
          </el-form-item>
          <el-form-item>
            <t slot="label" path="" colon>内部客户对应的法人公司:</t>
            根据内部客户在《客户档案》的法人公司配置获取
          </el-form-item>
          <el-form-item>
            <t slot="label" path="" colon>内部采购订单的付款方式:</t>
            <select-payment :result="rela_deal_setting.internal" field="pu_payment_id" width="100%" @save="onSave" :clearable="false" :map="{ value: 'id', label: 'desc', key: 'id' }"></select-payment>
          </el-form-item>
        </div>
      </el-form>
    </x-fold>
  </div>
</template>

<script>
let fmt = {
  legal_id: '',
  supplier_id: '',
  pu_payment_id: '',
  sc_payment_id: '',
  currency: '',
  rela_price: {
    type: 'pu_rate',
    pu_rate: '',
    sale_rate: '',
    sale_gross_rate: '',
  },
}
export default {
  options: {title: '关联交易', icon: 'icon-set'},
  components: {},
  data() {
    const dealTypes = [
      {text: '对外交易', key: 'foreign'},
      {text: '关联交易', key: 'rela_deal'},
    ]
    return {
      instance: '',
      rela_deal_setting: {
        deal_types: ['foreign'],
        deal_targets: [],
        rela_cust: '',
        internal: {supplier_id: '', legal_id: '', pu_payment_id: ''}
      },
      dealTypes,
      legalMap: {},
      externalImg: 'https://dxdoc3.oss-cn-hangzhou.aliyuncs.com/21/7/27/808411_60ff6e92477665b5ed948537_280308034201.png',
      internalImg: 'https://dxdoc3.oss-cn-hangzhou.aliyuncs.com/21/7/27/808411_60ff6e956161e26e3a948539_36de7191f501.png',
    };
  },
  methods: {
    onSave() {
      let field = 'rela_deal_setting'
      return this.$configure
        .setValue(field, { [field]: this[field] }, this.instance)
    },
    async init () {
      let field = 'rela_deal_setting'
      let v = await this.$configure.getValue(field, this.instance)
      // 清除老数据
      if (v[field] && !v[field].internal) v[field] = {}
      // v[field] = {}
      this[field] = {...this[field], ...v[field]}
    },
    addDealTarget () {
      this.rela_deal_setting.deal_targets.push(this.$h.cloneDeep(fmt))
    },
    delDealTarget (i) {
      this.rela_deal_setting.deal_targets.splice(i, 1)
      this.onSave()
    },
    handlerCust (d) {
      return d.filter(f => f.is_equity === 'yes')
    },
    handlerLegal (d) {
      this.$set(this, 'legalMap', d._object('legal_id'))
      return d.filter(f => f.legal_id !== this.payload.instance)
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.init();
  },
};
</script>
<style lang="scss">
.rela-deal-setting {
  .box {
    border: 1px solid grey;
    padding: 10px 0;
    border-radius: 8px;
    text-align: center;
  }
  .module-item {
    max-width: 150px;
  }
  .external-module {
    display: flex;
    white-space: nowrap;
  }
}
</style>