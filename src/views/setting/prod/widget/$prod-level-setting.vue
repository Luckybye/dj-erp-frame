<template lang="html">
  <busi-config field="prodLevel" :componentName="componentName"></busi-config>
</template>

<script>
export default {
  options: { title: '产品等级' },
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
