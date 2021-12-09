<template lang="html">
  <div class="meeting-setting">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
  },
  data() {
    return {
      parts: ["MeetingBillSetting", "MeetingProdSetting"],
    };
  },
  methods: {
    async initialize() {
      let part = this.payload.part || this.parts[0];
      this.$tab.push({
        slot: true,
        parts: this.parts,
        show: part,
        show_menus: true,
      });
    },
  },
  created() {
    this.initialize();
  },
  beforeDestroy() {},
};
</script>
<style lang="scss"></style>
