<template>
  <div class="busi-setting">
    <div class="left-border-title">销售订单生效后业务规则</div>
    <el-table :data="rules" tooltip-effect="dark">
      <el-table-column label="配置描述" width="180">
        <template slot-scope="scope">{{ scope.row.text }}</template>
      </el-table-column>
      <el-table-column label="状态/操作">
        <template slot-scope="scope">
          <div v-if="scope.row.checkOptions">
            <el-radio
                v-model="busi_setting[scope.row.field]"
                :label="item.expect"
                @change="onSave()"
                v-for="(item, i) in scope.row.checkOptions" :key='i'>
                {{ item.text }}
            </el-radio>
          </div>
          <div v-else>
            <el-radio
                v-model="busi_setting[scope.row.field]"
                label="yes"
                @change="onSave()">
                是
              </el-radio>
              <el-radio
                v-model="busi_setting[scope.row.field]"
                label="no"
                @change="onSave()">
                否
              </el-radio>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      rules: [
        {
          text: '采购生成方式',
          field: 'pu_create',
          checkOptions: [
            { text: "采购合同", expect: "pu_order", unexpect: "pu_plan" },
            { text: "采购计划", expect: "pu_plan", unexpect: "pu_order" },
          ],
        },
        {
          text: '出运时库存处理',
          field: 'pu_stock',
          checkOptions: [
            { text: "自动出入库", expect: "auto", unexpect: "manual" },
            { text: "不处理", expect: "manual", unexpect: "auto" }
          ],
        },
        {
          text: '客户预收 / 应收',
          field: 'customer_ar',
          checkOptions: [
            { text: "启用", expect: "yes", unexpect: "no" },
            { text: "不启用", expect: "no", unexpect: "yes" }
          ],
        },
        {
          text: '供方预付 / 应付',
          field: 'sup_ap',
          checkOptions: [
            { text: "启用", expect: "yes", unexpect: "no" },
            { text: "不启用", expect: "no", unexpect: "yes" }
          ],
        },
        {
          text: '物流应付',
          field: 'forwarder_ap',
          checkOptions: [
            { text: "启用", expect: "yes", unexpect: "no" },
            { text: "不启用", expect: "no", unexpect: "yes" }
          ],
        },
        // {
        //   text: '采购结算（应付）依据',
        //   field: 'pu_set',
        //   checkOptions: [
        //     { text: "出库数量", expect: "stock_out", unexpect: "stock_in" },
        //     { text: "入库数量", expect: "stock_in", unexpect: "stock_out" },
        //   ],
        // },
      ],
      instance: "",
      busi_setting: {
        // dev: 'yes',
        // adv: 'no',
        pu_create: 'pu_order',
        pu_stock: 'auto',
        pu_set: 'stock_out',
        // create_adv: 'yes',
        // shipment: 'stock_record',
        customer_ar: 'yes',
        forwarder_ap: 'yes',
        sup_ap: 'yes',
      },
      field: 'busi_setting'
    };
  },
  methods: {
    init() {
      this.instance = this.payload.instance || this.$state('me').legal_id || ''
      this.getConfigure(this.field, this.instance)
    },
    onSave () {
      this.setConfigure(this.field, {[this.field]: this[this.field]}, this.instance)
    },
    async getConfigure(field, instance) {
      var vv = { field };
      instance && (vv.instance = instance);
      this.$get("/api/support/getConfigure", vv).then((data) => {
        this[field] = Object.assign(this[field], data[field])
      });
    },
    async setConfigure(field, value, instance) {
      if (!field || !value) return;
      var vv = { field, value };
      instance && (vv.instance = instance);
      this.$post("/api/support/setConfigure", vv);
    },
  },
  components: {},
  watch: {},
  created() {
    this.init();
  },
};
</script>

<style lang="scss">
.busi-setting {
  .el-radio {
    width: 200px;
  }
}
</style>
