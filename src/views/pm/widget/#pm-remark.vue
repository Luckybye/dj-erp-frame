<template lang="html">
    <div class="bottom">
      <div v-part-render>
        <ideal-button skin="blue" width="80px" icon="tianjia" @click="_self.addRemark" v-pre></ideal-button>
      </div>
      <prod-remark collection="prod_infos" :bill-id="payload.prod_id" v-ref:prod-remark></prod-remark>
    </div>
</template>
<script>
  import ProdRemark from 'views/common/prod/prod-remark.vue'
  function initialize () {
    let self = this
  }
  export default {
    options: {title: 'Remark'},
    data () {
      let self = this
      return {
        viewModel: {mall_priority: 0}
      }
    },
    methods: {
      initialize,
      addRemark () {
        this.$refs.prodRemark.onEditRemark(null)
      }
    },
    components: {
      ProdRemark
    },
    created () {
    }
  }
</script>
