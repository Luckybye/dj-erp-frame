<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
  },
  components: {
  },
  data() {
    return {
      datas: []
    }
  },
  methods: {
    openTab () {
      this.$tab.push({
        show: 'ScTimelineSetting',
        parts: ['ScTimelineSetting', 'PuTimelineSetting', 'ProductTimelineSetting', 'BookingTimelineSetting', 'EcTimelineSetting', 'ImTimelineSetting'],
        show_menus: true,
        slot: true
        // mode: 'vertical'
      })
    }
  },
  created () {
    this.openTab()
  }
}
</script>
