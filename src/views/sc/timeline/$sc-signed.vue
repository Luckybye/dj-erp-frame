<template lang="html">
  <div class="sc-signed">
    <div>{{vm.is_sign === 'yes' ? '已回签' : '未回签'}}</div>
    <el-form label-width="100px" class="mt20">
      <el-row>
        <el-col :span="12">
          <el-form-item label="回签人：">
            <div v-if="vm.is_sign === 'yes'">{{vm.x_sign_user}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回签日期：">
            <div v-if="vm.is_sign === 'yes'">{{vm.sign_date | timeFormat('YYYY-MM-DD HH:mm')}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="文件：">
        <x-upload :result="attachment" field="files" width="100%" listType="text" @change="editAttach">
          <el-button type="primary">上传文件</el-button>
        </x-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vm: {
      },
      attachment: {
        files: []
      }
    }
  },
  methods: {
    async initialize () {
      this.queryBillFullInfo()
    },
    async queryBillFullInfo () {
      let v = await this.$get('/api/business/queryBillFullInfo', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id
      })
      this.vm = {...this.vm, ...v.pi_contract}
      this.getAttachment()
    },
    async getAttachment () {
      if (!this.vm.bill_id) return
      let param = {
        collection: 'pi_bills',
        field: 'attachment',
        attach_type: 'Sign',
        id: this.vm.bill_id
      }
      this.$post('/api/support/queryAllAttach', param).then(res => {
        let attachment = (res.attachment || []).filter(item => item.attach_type === 'Sign') || []
        if (attachment.length) {
          this.attachment = attachment[0]
        }
      })
    },
    createAttach() {
      this.$post('/api/support/addAttachment', {
        attach_type: 'Sign',
        collection: 'pi_bills',
        create_date: new Date(),
        creator: this.$state('me').user_name_en,
        field: 'attachment',
        files: this.attachment.files,
        id: this.vm.bill_id,
      }).then(() => {
        // this.getAttachment()
      })
    },
    signContract(is_sign) {
      this.$post2('/api/business/signContract', {is_sign, contract_id: this.vm.bill_id}).then(res => {
        this.queryBillFullInfo()
      })
    },
    editAttach() {
      if (this.attachment.attach_id === '') return
      this.$post('/api/support/editAttachment', {
        attach_type: 'Sign',
        collection: 'pi_bills',
        field: 'attachment',
        files: this.attachment.files,
        id: this.vm.bill_id,
        attach_id: this.attachment.attach_id,
      }).then(() => {
        let is_sign = this.attachment.files.length ? 'yes' : 'no'
        this.signContract(is_sign)
      })
    },
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-pu-list {}
</style>
