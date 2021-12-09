<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title" class="text-blue text-16 text-bold">
      <span v-if="type === 'sample'">Sample Request</span>
      <span v-else>Test Request</span>
    </div>
    <el-form class="d-content" label-width="130px">
      <div v-if="type === 'sample'">
        <div>
          <el-form-item :label="isCn ? '客户要样时间' : 'Send Date:'">
            <select-date
              width="90%"
              :result="sample"
              field="req_date"
            ></select-date>
          </el-form-item>
          <el-form-item :label="isCn ? '样品数量' : 'Quantity:'">
            <x-input
              width="90%"
              field="quantity"
              :result="sample"
              unit="PCS"
            ></x-input>
          </el-form-item>
          <el-form-item :label="isCn ? '运费' : 'Express Fee:'">
            <x-input
              width="90%"
              field="exp_fee1"
              :result="sample"
              unit="CNY"
            ></x-input>
          </el-form-item>
          <el-form-item :label="isCn ? '寄样说明' : 'Sample Style:'">
            <x-input width="90%" field="smpl_style" :result="sample" :rows="4" type="textarea"></x-input>
          </el-form-item>
        </div>
      </div>
      <div v-else>
        <div>
          <el-form-item :label="isCn ? '检测完成日期' : 'Test Result Date:'">
            <select-date
              width="90%"
              :result="test"
              field="req_date"
            ></select-date>
          </el-form-item>
          <el-form-item :label="isCn ? '检测耗时' : 'Test Lead Date:'">
            <x-input
              width="90%"
              field="lead_days"
              :result="test"
              unit="days"
            ></x-input>
          </el-form-item>
          <el-form-item :label="isCn ? '检测费' : 'Test Fee:'">
            <x-input
              width="90%"
              field="test_fee1"
              :result="test"
              unit="CNY"
            ></x-input>
          </el-form-item>
          <el-form-item :label="isCn ? '检测标准' : 'Test Standard:'">
            <x-input
              width="90%"
              field="test_standard"
              :result="test"
            ></x-input>
          </el-form-item>
          <el-form-item :label="isCn ? '检测机构' : 'Test Company:'">
            <select-cust
              width="90%"
              :result="test"
              field="test_com_id"
              field2="test_user_id"
              :pm="{custType: '16'}"
              @change="onSelectCust"
            ></select-cust>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      sample: {
        req_date: null,
        quantity: "",
        exp_fee1: "",
        smpl_style: "",
      },
      test: {
        req_date: null,
        lead_days: "",
        test_fee1: "",
        test_standard: "",
        test_user_id: "",
        test_com_id: "",
      },
    };
  },
  computed: {},
  methods: {
    onSelectCust(v, v2) {
      let cust = v2[v2.length - 1] || {}
      this.test.test_contact = cust.user_name
    },
    onConfirm() {
      let p = null;
      if (this.type === "sample") p = this.onSaveSample();
      if (this.type === "test") p = this.onSaveTest();
      p.then(() => {
        this.onCallback().then(() => {
          this.onClose();
        });
      });
    },
    onSaveSample() {
      let para = this.sample;
      para.contract_id = para.contract_id || this.contract_id;
      if (!para.smplreq_id) {
        para = {
          ...para,
          bill_prod_id: this.bill_prod_id,
          create_type: "quote",
        };
        return this.$pull.preSample(para, {loading: true});
      }
      para.bill_action = "smpl_edit";
      return this.$pull.upsertSample(para);
    },
    onSaveTest() {
      let para = this.test;
      para.contract_id = para.contract_id || this.contract_id;
      if (!para.test_id) {
        para = {
          ...para,
          bill_prod_id: this.bill_prod_id,
          create_type: "quote",
        };
        return this.$pull.preTest(para);
      }
      para.bill_action = "test_edit";
      return this.$pull.upsertTest(para, {loading: true});
    },
    init() {
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss"></style>
