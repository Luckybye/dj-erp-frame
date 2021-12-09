<template lang="html">
  <div class="ideal-page">
    <div class="set-prod-page" :class="{ edit: isEdit }">
      <div class="tab-page-header s-action fixed-top flex-b">
        <div>
          <span v-if="isEdit" class="mr10">
            <el-button type="primary" @click="addModel">添加模块</el-button>
          </span>
          <el-button type="primary" @click="setDefaultTemp('clear')"
            >默认模板</el-button
          >
        </div>
        <div>
          <el-button type="primary" @click="isEdit = !isEdit">{{
            isEdit ? '预览' : '编辑'
          }}</el-button>
          <el-button type="danger" @click="onSaveTemp">保存</el-button>
        </div>
      </div>

      <div class="smart-page">
        <cust-page
          :disabled="!isEdit"
          :is-edit="isEdit"
          draggable
          ref="prodPage"
          :custType="payload.cust_type"
        ></cust-page>
      </div>
    </div>
  </div>
</template>
<script>
import CustPage from './cust-page.vue'

async function initialize() {
}

export default {
  options: { title: '页面配置' },
  components: { CustPage },
  data() {
    return {
      isEdit: true,
    }
  },
  computed: {},
  methods: {
    initialize,
    addModel() {
      this.$refs.prodPage.addModel()
    },
    setDefaultTemp(t) {
      this.$refs.prodPage.setDefaultTemp(t)
    },
    onSaveTemp() {
      this.$refs.prodPage.onSaveTemp()
    },
  },
  created() {
    this.initialize()
  },
}
</script>
<style lang="scss">
.set-prod-page {
  position: relative;
  .s-action {
  }
}
</style>
