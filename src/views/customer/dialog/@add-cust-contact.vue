<template>
  <el-dialog
    :visible="true"
    width="80%"
    @close="onClose"
    :close-on-click-modal="false"
    class="h-hidden"
    title="新建联系人"
  >
    <add-contact :vm="vm" ref="custInfo" v-if="vm.cust_type === '2'"></add-contact>
    <cust-info :vm="vm" add ref="custInfo" v-else></cust-info>
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
  data() {
    return {
      vm: {
        user_name: '',
        user_mail: '',
        user_phone: '',
        address: '',
        mg_office_phone: '',
        position: '',
        mg_cardpic: [],
        gender: 'm',
        contact_no: '',
        fax_number: '',
        country_id: '',
        country: '',
        area_code: '',
        legal_id: '',
        cust_com_id: '',
        cust_type: '',
        cust_com: '',
        cust_id: '',
        cust_nature: '',
        cust_profit: '',
        cust_level: ''
      },
      payload: {},
    };
  },
  components: {
    CustInfo: require('../widget/components/contact-info').default,
    AddContact: require('../widget/components/add-contact').default,
  },
  computed: {
  },
  methods: {
    async onConfirm() {
      let ref = this.$refs.custInfo
      let valid = await ref.$refs.form.validate()
      if (!valid) return
      let v
      if (this.vm.cust_com_id) {
        v = await this.addCustUser()
        v.add_cust = true
      } else if (this.vm.cust_com) {
        v = await this.createCom()
        v.add_com = true
      } else return this.$message.warning('选择所属公司')
      this.vm.cust_id = (v.cust_user || {}).cust_id
      ref.onSaveProdSorts && ref.onSaveProdSorts()
      this.onCallback(v).then(() => {
        this.onClose();
      });
    },
    createCom () {
      let para = {...this.vm}._trim()
      // para.cust_com = para.cust_com_id
      // delete para.cust_com_id
      return this.$pull.createCustInfo(para, {loading: true})
    },
    addCustUser () {
      let para = {...this.vm}._trim()
      return this.$post('/api/crm/upsertCustUser', para, {loading: true})
    }
  },
  created() {
  },
};
</script>
