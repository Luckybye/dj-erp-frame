<template>
  <div class="">
    <shipping-plan-list ref="orders" :payload="{colKey: 'history_sc_prod_table_header', hidden_header: true, search: {prod_id: payload.prod_id || payload.sell_prod_id}}"></shipping-plan-list>
  </div>
</template>
<script>
export default {
  options: {
    title: '历史销售'
  },
  props: {},
  components: {},
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
</style>