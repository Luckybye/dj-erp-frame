<template>
  <el-dialog
    :visible="true"
    width="300px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">
      上传指定产品
    </div>

    <div>
      <el-button type="primary" @click="onDownload">模板下载</el-button>
      <x-upload only v-model="file" class="mt20" listType="text">
        <el-button type="primary" @click="onDownload">上传Excel</el-button>
      </x-upload>
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
function onConfirm() {
  let { file } = this
  if (!file) return
  this.onCallback(file).then(v => {
    this.onClose()
  })
}
export default {
  data() {
    return {
      file: '',
    }
  },
  methods: {
    onConfirm,
    onDownload() {
      let url =
        'https://dxdoc3.oss-cn-hangzhou.aliyuncs.com/20/6/4/807300_5ed8ef64ebbcb3d98f6ddb2e_a7e6f4e80401.xlsx'
      let name = '客户产品重要性模板.xlsx'
      this.$h.download(url, name)
    },
  },
  components: {},
  created() {},
}
</script>

<style lang="scss"></style>
