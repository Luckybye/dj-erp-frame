<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">
      Feature
    </div>

    <el-form label-position="left" label-width="95px">
      <el-form-item label="Feature:">
        <select-feature
          width="200px"
          field="type"
          :result="vm"
          @change="selectFeature"
          :selected="selected"
        ></select-feature>
      </el-form-item>

      <el-form-item label="中文名:">
        <x-input width="80%" :result="vm" field="title"></x-input>
      </el-form-item>
      <el-form-item label="英文名:">
        <x-input width="80%" :result="vm" field="title_en"></x-input>
      </el-form-item>
    </el-form>
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
        type: '',
        title: '',
        title_en: '',
      },
      selected: [],
    }
  },
  computed: {},
  methods: {
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
    selectFeature(item = {}) {
      this.vm.title = item.text
      this.vm.title_en = item.text_en
    },
  },
  created() {},
}
</script>

<style scoped></style>
