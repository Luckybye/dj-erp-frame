<template lang="html">
  <div class="mall-prod-display">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      // parts: ['MallProdList', 'MallProdDetail']
      part: {
        parts: ['MallProdList', 'MallProdDetail', 'MallProdSupplier'],
        catalog: ['MallProdDetail'],
        qu: ['QutationProdSetting', 'MallProdDetail'],
      },
    }
  },
  methods: {},
  computed: {},
  created() {
    let parts = this.part[this.payload.type] || this.part.parts
    let part = this.payload.childPart || parts[0]
    console.log(parts)
    console.log(part)
    this.$tab.push({
      slot: true,
      show_menus: true,
      parts,
      show: part,
      query: this.payload
    })
  },
  beforeDestroy() {},
}
</script>
