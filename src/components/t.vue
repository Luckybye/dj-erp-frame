<template>
 <!-- :class="{'bg-yellow text-grey': !isExit && !tt}" -->
  <span class="x-vue-i18n" :title="path" @click="onClick">
    <span v-if="path && isExit && !tt" v-html="html">
    </span>
    <span v-else-if="tt && vm">{{$tt(vm, path)}}</span>
    <slot v-else></slot>
  </span>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: ''
    },
    colon: {
      type: Boolean,
      default: false
    },
    tt: {
      type: Boolean,
      default: false
    },
    vm: Object,
    locale: String,
    vars: [Array, Object],
  },
  data () {
    return {
    }
  },
  computed: {
    isExit () {
      return this.$te(this.path)
    },
    html () {
      // let args = []
      return this.$t(this.path, this.locale, this.vars) + (this.colon ? ':' : '')
    }
  },
  methods: {
    onClick (ev) {
      this.$emit('click', ev)
    }
  },
  mounted () {
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss">
  .x-vue-i18n {
  }
</style>
