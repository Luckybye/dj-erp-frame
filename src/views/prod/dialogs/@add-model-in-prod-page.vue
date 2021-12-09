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

      <x-label
        label="模块背景色"
        label-width="116px"
        class="mt10"
      >
        <el-color-picker
          v-model="vm.bg_color"
          :predefine="predefineColors"
          show-alpha>
        </el-color-picker>
      </x-label>
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
export default {
  data() {
    return {
      vm: { title_en: '', title: '', parts: [], bg_color: '#fff' },
      models: [
        {
          title: '物流信息',
          title_en: 'Logistics Info',
          parts: [{parts: [{parts: [{ part: 'logistics-info', span: '24' }]}]}],
        },
        {
          title: '样品和检测要求',
          title_en: 'Sample & Test Request',
          parts: [{parts: [{parts: [{ part: 'sample-test', span: '24' }]}]}],
        },
        {
          title: '海关信息',
          title_en: 'Custom Info',
          parts: [{parts: [{parts: [{ part: 'custom-info', span: '24' }]}]}],
        },
        {
          title: '客户专属',
          title_en: 'Customer',
          parts: [{parts: [{parts: [{ part: 'pm-customer', span: '24' }]}]}],
        },
      ],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
    }
  },
  computed: {},
  methods: {
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
    selectModel(m) {
      this.vm = m
    },
  },
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss"></style>
