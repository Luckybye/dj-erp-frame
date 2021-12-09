<template lang="html">
  <div>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        产品同步
      </div>
      <sync-prod :payload="payload" :componentName="componentName"></sync-prod>
    </x-fold>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        产品图片同步
      </div>
      <sync-pic :payload="payload" :componentName="componentName"></sync-pic>
    </x-fold>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  components: {
    SyncProd: require('./sync-prod').default,
    SyncPic: require('./sync-pic').default,
  },
  methods: {
  },
  created () {
  },
}
</script>

<style lang="scss">
</style>
