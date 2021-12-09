<template>
  <div class="x-component x-label" :style="{width}">
    <label class="x-form-label" v-if="label || $slots.label" :style="{width: labelWidth}">
      <template v-if="!$slots.label">{{label}}</template>
      <slot v-else name="label"></slot>
    </label>
    <div class="flex-1">
      <template v-if="!$slots.default">{{note}}</template>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'x-label',
  props: {
    label: [String],
    width: [String],
    labelWidth: [String],
    note: String,
  },
  data() {
    return {
      oldValue: '',
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy() {}
}
</script>

<style lang="scss">
.x-label {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-height: 30px;
  align-items: center;
}
.x-label + .x-label {
  margin-top: 15px;
}
</style>
