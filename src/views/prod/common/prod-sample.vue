<template>
  <div class="content-area">
    <div class="flex-row sample-test">
      <div class="prod-item">
        <span @click="onAdd('sample')" v-if="!sample" class="text-blue cursor">
          {{isCn? '添加样品要求' : 'Add Sample Request'}}</span>
        <div v-else>
          <ideal-form-item left-width="130px" right-width="calc(100% - 160px)" :label="isCn ? '客户要样时间' : 'Sample Send Date:'">
            <span>{{sample.req_date | timeFormat 'YYYY-MM-DD'}}</span>
            <ideal-icon-btn icon="xiugai" skin="blue" @click="onAdd('sample')" class="float-right"></ideal-icon-btn>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '样品数量' : 'Quantity:'">
            <span>{{sample.quantity}} PCS</span>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '运费' : 'Express Fee:'">
            <span>{{sample.exp_fee1}} CNY</span>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '寄样说明' : 'Sample Style:'">
            <span>{{sample.smpl_style}}</span>
          </ideal-form-item>
        </div>
      </div>
      <div class="prod-item">
        <span @click="onAdd('test')" v-if="!test" class="text-blue cursor">
          {{isCn? '添加检测要求' : 'Add Test Request'}}</span>
        <div v-else>
          <ideal-form-item left-width="130px" right-width="calc(100% - 160px)" :label="isCn ? '检测完成日期' : 'Test Result Date:'">
            <span>{{test.req_date | timeFormat 'YYYY-MM-DD'}}</span>
            <ideal-icon-btn icon="xiugai" skin="blue" @click="onAdd('test')" class="float-right"></ideal-icon-btn>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '检测耗时' : 'Test Lead Date:'">
            <span>{{test.lead_days || '-'}} Days</span>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '检测费' : 'Test Fee:'">
            <span>{{test.test_fee1}} CNY</span>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '检测标准' : 'Test Standard:'">
            <span>{{test.test_standard}}</span>
          </ideal-form-item>
          <ideal-form-item left-width="130px" right-width="calc(100% - 130px)" :label="isCn ? '检测机构' : 'Test Company:'">
            <span>{{test.x_test_com_id}}/{{test.x_test_user_id || test.test_contact}}</span>
          </ideal-form-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'qu-prod-sample',
    props: {
      billId: {
        type: String,
        default: ''
      },
      isCn: {
        type: Boolean,
        default: false
      },
      approving: {
        type: Boolean,
        default: false
      },
      payload: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        cost_curr: '',
        sample: '',
        test: ''
      }
    },
    methods: {
      onAdd (type) {
        if (this.approving) return
        let params = {
          type,
          cost_curr: this.cost_curr,
          sample: this.sample || {},
          test: this.test || {},
          bill_prod_id: this.billId,
          contract_id: this.payload.bill_id
        }
        this.$dialog.QuAddSampleTest(params, (data) => {
          this.init()
        })
      },
      init () {
        let para = {
          bill_type: 'SP',
          bill_prod_id: this.billId,
          is_contract: 'yes'
        }
        let ps = [
          this.$pull.billSearch(para),
          this.$pull.billSearch(Object.assign(para, {bill_type: 'TE'}))
        ]
        this.$Promise.when(ps).then((sample, test) => {
          sample = (sample.pi_smplreqs || [])[0]
          test = (test.pi_tests || [])[0]
          this.sample = sample
          this.test = test
        })
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style lang="scss">
  .sample-test {
    padding: 0 15px 10px 0;
    .prod-item {
      display: inline-block;
      width: calc(50% - 30px);
      vertical-align: top;
      overflow: hidden;
      min-height: 100px;
      border: 1px solid #6d78e7;
      padding: 10px 10px 0 10px;
      span {
        line-height: 30px;
      }
    }
  }
</style>
