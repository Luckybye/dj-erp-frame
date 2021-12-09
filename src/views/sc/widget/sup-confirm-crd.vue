<template lang="html">
  <div class="pa30">
    <sup-confirm-crd :payload="{...$route.query, enable_submit: true, disable_tr: true}" v-if="show"></sup-confirm-crd>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false
    }
  },
  watch: {
    '$route' (to) {
      if (to.name === 'sup-confirm-crd') this.reload()
    }
  },
  methods: {
    reload () {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
  created () {
    this.$get('/api/system/grantAuth', {token: this.$route.query.token}).then(() => {
      this.show = true
    })
  },
  beforeDestroy() {}
}
</script>
