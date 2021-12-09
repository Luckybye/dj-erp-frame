<template>
  <el-dialog
    visible
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
    title="关闭页签">
    <div class="mv30 ph20 text-red text-bold">
      {{message || '有修改未保存，确认关闭此页签！！！'}}
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose" v-if="showCancelBtn">取消</el-button>
      <el-button @click="onConfirm()" type="danger" v-if="showForceBtn">强制关闭</el-button>
      <el-button @click="onConfirm('save')" type="primary" v-if="showConfirmBtn">保存后关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      message: '',
      showCancelBtn: true,
      showForceBtn: true,
      showConfirmBtn: true,
    }
  },
  computed: {},
  methods: {
    async onConfirm(v) {
      this.onCallback(v).then(() => {
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
