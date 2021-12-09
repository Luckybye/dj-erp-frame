<template>
  <div>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        内销订单配置
      </div>
      <x-table :data="sdRules">
        <x-table-column type="index" width="50"></x-table-column>
        <x-table-column label="配置描述" width="250">
          <template slot-scope="{row}">{{ row.text }}</template>
        </x-table-column>
        <x-table-column label="状态/操作">
          <template slot-scope="{ row }">
            <div v-if="row.type === 'input'">
              <el-input style="width: 80%" v-model="vm[row.result][row.field]" @blur="onSave(row.result)"></el-input>天
            </div>
            <div v-else>
              <div v-if="row.result === 'busi_rules'">
                <el-radio v-model="vm[row.result][row.field].param.sc" :label="true" @change="onSave(row.result)">是</el-radio>
                <el-radio v-model="vm[row.result][row.field].param.sc" :label="false" @change="onSave(row.result)">否</el-radio>
              </div>
              <div v-else>
                <el-radio v-model="vm[row.result][row.field]" label="yes" @change="onSave(row.result)">是</el-radio>
                <el-radio v-model="vm[row.result][row.field]" label="no" @change="onSave(row.result)">否</el-radio>
              </div>
            </div>
          </template>
        </x-table-column>
      </x-table>
    </x-fold>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        内销合同条款
      </div>
      <editor v-model="vm.clause" @on-blur="onSave('clause')"></editor>
    </x-fold>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
    title: '内销订单'
  },
  components: {},
  data() {
    return {
      sdRules: [
        { result: "sd_config", field: "select_sameprod", text: "是否可选同一商品货号的商品", type: "checkbox" },
        { result: "sd_config", field: "fill_up", text: "产品数量是否整箱处理", type: "checkbox" },
        { result: "sd_config", field: "shipping_day", text: "订单默认客户交期", type: "input" },
        { result: "sd_config", field: "delivery_day", text: "交货提前期", type: "input" },
        { result: "sd_config", field: "guidance_price", text: "产品价格能否低于指导价", type: "checkbox" },
        { result: "busi_rules", field: "sd_update_cust_price", text: "订单生效后更新客户专属价格", type: "checkbox" },
      ],
      vm: {
        sd_config: {
          fill_up: "yes",
          shipping_day: "60",
          delivery_day: "15",
          guidance_price: "yes",
          select_sameprod: 'yes',
        },
        busi_rules: {
          bill_title: {
            status: 'stopped',
            param: {}
          },
          sc_bill: {
            status: 'normal',
            param: {
              tran_type: true,
              shipment_date: true,
              load_port: true,
              unload_port: true
            }
          },
          sc_prod: {
            status: 'stopped',
            param: {
              sell_price: '',
              sell_quantity: '',
              etd_date: ''
            }
          },
          pu_bill: {
            status: 'normal',
            param: {
              load_port: true,
              test_stand: true,
              mg_desc: true,
              delivery_date: true,
              pack_demand: true,
              insp_type: true,
              sample_demand: true,
              delivery_type: true
            }
          },
          pu_prod: {
            status: 'stopped',
            param: {
              pu_price: '',
              sell_quantity: '',
              delivery_date: ''
            }
          },
          booking_credit: {
            status: 'stopped',
            param: {
              insurance_amount: false,
              credit_line: false,
              no_lc: false
            }
          },
          update_cust_price: {
            status: 'stopped',
            param: {
              qu: false,
              sc: false
            }
          },
          sd_update_cust_price: {
            status: 'stopped',
            param: {
              qu: false,
              sc: false
            }
          }
        },
        clause: defaultClause || ''
      },
      instance: ''
    };
  },
  methods: {
    init() {
      Object.keys(this.vm).forEach(key => {
        this.refresh(key)
      })
    },
    refresh (field) {
      this.$configure.getValue(field, this.instance).then(v => {
        if (field === 'clause') {
          this.vm[field] = v[field] || defaultClause
        } else {
          Object.assign(
            this.vm[field],
            v[field]
          )
        }
      })
    },
    onSave(field) {
      return this.$configure
        .setValue(field, { [field]: this.vm[field] }, this.instance)
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.init();
  },
};
let defaultClause = '<p>&nbsp; &nbsp; &nbsp;ADDITIONAL CLAUSE:</p><p>&nbsp;&nbsp; &nbsp;&nbsp;NEITHER QUANTITY NOR AMOUNT 5% MORE OR LESS IS ALLOWED.&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;THE SELLER(S) SHALL NOT BE HELD RESPONSIBLE IF THEY, OWING TO FORCE MAJORED CAUSES, FAIL TO DELIVERY WITHIN THE TIME STIPULATED IN THE CONTRACT OR CANNOT DELIVER THE GOODS. HOWEVER IN SUCH CASE, THE SELLER(S) SHALL INFORM THE BUYER IMMEDIATELY BY FAX, A CERTIFICATE ATTESTING THE EXISTENCE OF SUCH A CAUSE ISSUED BY A COMPETENT AUTHORITY.&nbsp;&nbsp;</p><p>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;THE BUYER SHALL ASSUME FULL RESPONSIBILITIES FOR ANY CONSEQUENCES ARISING FROM(BUT NOT LIMITING TO):&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;(A)USE OF DESIGN, UTILITY MODEL, PATENT ETC. FURNISHED BY THE BUYER IN THE GOODS;"&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;(B)LATE ESTABLISHMENT OR FAILURE TO ESTABLISH THE L/C;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;(C)LATE AMENDMENT OR FAILURE TO AMEND THE L/C INCONSISTENT WITH THE PROVISION(S) OF THIS SALE CONTRACT.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;IN CASE THE PRICE OF RAW MATERIALS HAS INCREASED BY 5% OR MORE,OR BECAUSE THE TAX REFOUND RATE DECREASED OR CNY AGAINST THE CONTRACT CURRENCY HERE OF APPRECIATED BY 5% OR MORE,THE SELLER RETAINS THE RIGHT TO RE-NEGOTIATE THE CONTRACT PRICE.</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;DISCREPANCY AND CLAIM :&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;IN CASE DISCREPANCY ON QUANTITY/QUALITY OF THE GOODS IS FOUND BY THE BUYER(S) AFTER ARRIVAL OF THE GOODS AT THE PORT OF DESTINATION, THE BUYER(S) MAY, WITHIN 30 DAYS AFTER ARRIVAL OF THE GOODS AT THE PORT OF DESTINATION, LODGE WITH THE SELLER(S) A CLAIM. THE SELLER(S) SHALL, ON THE MERITS OF THE CLAIM, EITHER MAKE GOODS THE LOSS SUSTAINED BY THE BUYER(S) OR REJECT THEIR CLAIM, IT BEING AGREED THAT THE SELLER(S) SHALL NOT BE HELD RESPONSIBLE FOR ANY LOSS OR LOSSES DUE TO NATURAL CAUSE OR CAUSE FALLING WITHIN THE RESPONSIBILITY OF SHIP-OWNERS, UNDERWRITERS AND OTHER TRANSPORTATION ORGANIZATION OR POST OFFICE ARE LIABLE. THE BUYER SHALL BE RESPONSIBLE FOR THE INTEREST OF CAPITAL OCCUPATION，EXCHANGE RATE LOSSES AND ANY OTHER CHARGES INCURRED BY DELAYED PAYMENT.&nbsp;&nbsp; &nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;ARBITRATION:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;&nbsp;ALL DISPUTES ARISING FROM THE EXECUTION OF, OR IN CONNECTION WITH THIS CONTRACT, SHALL BE SETTLED THROUGH NEGOTIATION. IN CASE NO SETTLEMENT CAN BE REACHED THROUGH NEGOTIATION, IN CASE NO SETTLEMENT CAN BE REACHED THROUGH NEGOTIATION, THE CASE SHALL THEN BE SUBMITTED TO THE CHINA INTERNATIONAL ECONOMIC AND TRADE ARBITRATION COMMISSION,SHANGHAI, CHINA. FOR ARBITRATION IN ACCORDANCE WITH ITS RULES OF ARBITRATION. THE ARBITRATE AWARD SHALL BE ACCEPTED AS FINAL BY AND BINDING UPON BOTH PARTIES. THE FEES FOR ARBITRATION SHALL BE BORNE BY THE LOSE PART. &nbsp; &nbsp;&nbsp;</p><p><br></p>'
</script>
