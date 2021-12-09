<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="d-content">
      <select-sort field="prod_sort" :result="vm" @change="onChange" width="100%"></select-sort>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      vm: {
        prod_sort: '',
        x_prod_sort: '',
        x_prod_sort_en: ''
      },
      selectOption: {}
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      this.onCallback(this.vm, this.selectOption).then(() => {
        this.onClose()
      })
    },
    onChange (v) {
      v = v || {}
      this.vm.x_prod_sort = v.sort_name
      this.vm.x_prod_sort_en = v.sort_name_en
      // this.selectOption = v || {}
    }
  },
  created() {},
};
</script>

<style lang="scss">
.select-cust-com-dialog {
}
</style>
