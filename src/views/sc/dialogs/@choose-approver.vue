<template>
  <el-dialog
    :visible="true"
    width="300px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="select_approver">选择审批人</t></div>
    <div class="d-content">
      <el-checkbox-group v-model="checkList">
        <div v-for="staff in approvers" :key="staff.user_id" class="mb10">
          <el-checkbox :label="staff" :disabled="staff.user_id===$state('me').user_id">{{$tt(staff, 'user_name')}}</el-checkbox>
        </div>
      </el-checkbox-group>
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
      approvers: [],
      checkList: []
    };
  },
  computed: {},
  methods: {
    onConfirm () {
      this.onCallback(
        this.checkList
      ).then(() => {
        this.onClose()
      })
    }
  },
  created() {
  },
};
</script>
<style lang="scss">
</style>
