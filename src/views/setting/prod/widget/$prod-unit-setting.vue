<template lang="html">
  <busi-config field="prodUnits" :componentName="componentName" :defaultOptions="defaultOptions"></busi-config>
</template>

<script>
export default {
  options: { title: '数量单位' },
  data() {
    return {
    }
  },
  components: {
    busiConfig: require('./mg-config').default
  },
  methods: {
  },
  computed: {
    defaultOptions () {
      return this.$constant('pieceworkUnit').map(({en, cn}) => ({en, cn}))
    }
  },
  created() {
  },
}
</script>
