<template lang="html">
  <busi-config field="prodType" :componentName="componentName"></busi-config>
</template>

<script>
export default {
  options: { title: '产品类型' },
  data() {
    return {
    }
  },
  components: {
    busiConfig: require('./busi-config').default
  },
  methods: {
  },
  computed: {
  },
  created() {
  },
}
</script>
