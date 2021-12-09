<template lang="html">
  <div class="sc-log-list">
    <div class="tab-page-header mb0" v-tr-dom>
      <el-button type="primary" @click="show_log = !show_log" v-if="!show_log">
        <t path="log.open">展开</t>
      </el-button>
      <el-button type="primary" @click="show_log = !show_log" v-else>
        <t path="log.close">关闭</t>
      </el-button>
    </div>
    <log-list :payload="{bill_id: payload.bill_id}" v-if="show_log"></log-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: [],
      show_log: false
    }
  },
  computed: {
  },
  methods: {
    async initialize () {
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-log-list {}
</style>
