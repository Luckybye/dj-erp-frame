<template lang="html">
  <busi-config field="packings" :componentName="componentName" :defaultOptions="defaultOptions"></busi-config>
</template>

<script>
export default {
  options: { title: '包装方式' },
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
      return this.$constant('purcharsePack').map(({en, cn}) => ({en, cn}))
    }
  },
  created() {
  },
}
</script>
