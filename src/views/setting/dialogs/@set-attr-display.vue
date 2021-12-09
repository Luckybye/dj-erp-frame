<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">
      参数显示配置
    </div>

    <div>
      <div>
        <el-checkbox v-model="vm.attr" true-label="14" false-label="22"
          >平铺展示1×4，最多展示4个重要参数</el-checkbox
        >
      </div>

      <div>
        <el-checkbox v-model="vm.attr" true-label="22" false-label="14"
          >上下展示2×2，最多展示4个重要参数</el-checkbox
        >
      </div>

      <div>
        <el-checkbox v-model="vm.attr" true-label="" false-label="14"
          >不显示</el-checkbox
        >
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      vm: {
        attr: ''
      }
    }
  },
  methods: {
    initialize() {},
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
  },
  watch: {},
  created() {},
}
</script>

<style lang="scss"></style>
