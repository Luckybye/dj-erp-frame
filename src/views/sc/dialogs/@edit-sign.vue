<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.sc_sign" colon>订单回签</t></div>
    <div class="d-content">
      <el-form label-width="100px">
        <el-form-item label="回签人：">
          <div v-if="vm.is_sign === 'yes'">{{vm.x_sign_user}}</div>
          <div v-else>{{this.$state('me').user_name_en}}</div>
        </el-form-item>
        <el-form-item label="回签日期：">
          <div v-if="vm.is_sign === 'yes'">{{vm.sign_date | timeFormat('YYYY-MM-DD HH:mm')}}</div>
          <div v-else>{{new Date() | timeFormat('YYYY-MM-DD HH:mm')}}</div>
        </el-form-item>
        <el-form-item label="文件：">
          <x-upload :result="attachment" field="files" width="100%" listType="text" :disabled="auth_saas_po_signed !== 'yes'">
            <el-button type="primary">上传文件</el-button>
          </x-upload>
        </el-form-item>
      </el-form>
    </div>
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
      },
      attachment: {
        files: []
      },
      auth_saas_po_signed: 'yes'
    };
  },
  computed: {},
  methods: {
    async onConfirm() {
      await this.editAttachment()
      this.onCallback(this.attachment).then(() => {
        this.onClose();
      });
    },
    async editAttachment() {
      let v = await this.$post('/api/support/editAttachment', {
        attach_type: 'Sign',
        collection: 'pi_bills',
        field: 'attachment',
        files: this.attachment.files,
        id: this.vm.bill_id,
        attach_id: this.attachment.attach_id,
      })
      return v
    },
    getAttachment () {
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
        } else {
          // this.createAttach()
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
        files: this.vm.files,
        id: this.vm.bill_id,
      }).then(() => {
        this.getAttachment()
      })
    },
  },
  created() {
    this.getAttachment()
  },
};
</script>
<style lang="scss">
</style>
