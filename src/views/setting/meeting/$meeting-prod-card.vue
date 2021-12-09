<template lang="html">
  <div>
    <prod-card-display :payload="payload" :componentName="componentName" ref="prodCardDisplay"></prod-card-display>
  </div>
</template>
<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
    }
  },
  methods: {
  },
  created() {
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
</style>
