<template>
  <div
    class="ideal-prod-tag"
    :style="{ width: width, background: map.tag_color, color: map.font_color }"
  >
    <div class="p-tag">
      {{ map.tag_name_en || map.tag_name }}
    </div>
    <div class="p-unit" @click.stop="onClick">
      <div class="circle" v-if="!close"></div>
      <div class="close" v-else>x</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    map: {
      type: Object,
      default() {
        return {};
      },
    },
    close: {
      type: Boolean,
      default: false,
    },
    width: String
  },
  methods: {
    onClick() {
      this.$emit("close", this.map);
    },
  },
  watch: {
    value(n) {
      this.onChange(n);
    },
  },
};
</script>
<style lang="scss">
.ideal-prod-tag {
  height: 30px;
  // border: 1px solid #c5caf0;
  line-height: 30px;
  position: relative;
  display: inline-block;
  padding: 0 20px;
  border-radius: 2px 15px 15px 2px;
  box-shadow: 2px 2px 5px grey;
  div {
    display: inline-block;
  }
  .p-tag {
    margin-right: 15px;
  }
  .p-unit {
    cursor: pointer;
    .circle {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: #eee;
    }
  }
}
</style>
