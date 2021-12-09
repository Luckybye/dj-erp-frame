<template lang="html">
  <busi-config field="materials" :componentName="componentName"></busi-config>
</template>

<script>
export default {
  options: { title: '产品材质' },
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
  },
  created() {
  },
}
</script>
