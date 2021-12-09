<template>
  <el-dialog
    visible
    :close-on-click-modal="false"
    @close="onClose"
    width="500px"
    title="新增目录"
  >
    <el-form label-position="left" label-width="80px">
      <el-form-item>
        <t slot="label" path="" colon>*中文名：</t>
        <x-input field="text" :result="vm" width="100%"></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="" colon>*英文名：</t>
        <x-input field="text_en" :result="vm" width="100%"></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="" colon>链接：</t>
        <!-- <x-input field="link" :result="vm" width="100%"></x-input> -->
        <x-select :source="links" v-model="vm.link" :map="{label: 'text', value: 'new_url'}" allowCreate width="100%"></x-select>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="" colon>备注：</t>
        <x-input field="remark" :result="vm" width="100%" type="textarea"></x-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
async function onClick() {
  this.onCallback(this.vm).then(() => {
    this.onClose()
  })
}
export default {
  data() {
    return {
      vm: {
        text: '',
        text_en: '',
        link: '',
        remark: ''
      },
      links: []
    }
  },
  methods: {
    onClick,
    async getLinks () {
      let field = 'shimo_to_html'
      let v = await this.$configure.getValue(field)
      this.links = (v[field] || []).map(f => {
        f.text = f.filename + '/' + f.remark
        return f
      })
    }
  },
  components: {},
  created() {
    this.getLinks()
  },
}
</script>
