<template lang="html">
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title" class="text-blue text-16 text-semibold">
      添加模块
    </div>

    <div>
      <x-input
        field="title"
        :result="vm"
        label="模块中文名"
        label-width="116px"
      ></x-input>
      <div>
        <div
          class="inline-block pointer text-blue pa5"
          v-for="m in models"
          @click="selectModel(m)"
          :key="m.title"
        >
          {{ m.title }}模块
        </div>
      </div>

      <x-input
        field="title_en"
        :result="vm"
        label="模块英文名"
        label-width="116px"
        class="mt10"
      ></x-input>
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
function initialize() {}
let allModels = [
  {
    title: '客户银行',
    title_en: 'Cust Bank',
    single: true,
    parts: [{parts: [{ parts: [{ part: 'cust-bank', id: 'cust_bank'}] }]}],
    cust_type: ['2']
  },
  {
    title: '客户抬头',
    title_en: 'Cust title',
    single: true,
    parts: [{parts: [{ parts: [{ part: 'cust-title', id: 'cust_title'}] }]}],
    cust_type: ['2']
  },
  {
    title: '供应商银行',
    title_en: 'Cust Bank',
    single: true,
    parts: [{parts: [{ parts: [{ part: 'sup-bank', id: 'sup_bank'}] }]}],
    cust_type: ['4']
  },
  {
    title: '联系人信息',
    title_en: 'Contact Info',
    id: 'CustContacts',
    single: true,
    parts: [{parts: [{ parts: [{ part: 'cust-contacts', id: 'cust_contacts'}] }]}],
    cust_type: ['2', '4', '9999']
  },
]
export default {
  data() {
    return {
      vm: { title_en: '', title: '', parts: [] },
    }
  },
  computed: {
    models () {
      return allModels.filter(f => f.cust_type.indexOf(this.custType) >= 0)
    }
  },
  methods: {
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
    selectModel(m) {
      this.vm = {...m}
      delete this.vm.cust_type
    },
  },
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss"></style>
