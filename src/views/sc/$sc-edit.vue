<template lang="html">
  <div class="sc-edit">
    <slot></slot>
  </div>
</template>
<script>
import Timeline from '@/lib/timeline/sc'
function isRelaDeal (v) {
  return v.is_related === 'yes' || v.is_rpt === 'yes'
}
export default {
  options: {
    icon: 'icon-sc',
  },
  data() {
    return {
      parts: {
        edit: ['ScTerms', 'ScProds', 'ScLogList'],
        cancel: ['ScTerms', 'ScCancelProds', 'ScLogList'],
        line: Timeline.timelines.map(m => m.part).filter(f => f),
      },
      isTimeLine: false,
    }
  },
  watch: {
    actived (n) {
      if (n) {
        this.$nextTick(async () => {
          let {bill_status} = await this.queryContractInfo({loading: false})
          if (bill_status !== this.bill_status) this.$tab.refresh(true)
        })
      }
    }
  },
  methods: {
    async queryContractInfo (opt) {
      let v = await this.$get2('/api/business/queryContractInfo', {
        bill_id: this.payload.bill_id
      }, opt)
      v = v.pi_contract || {}
      return v
    },
    async initialize () {
      let v = await this.queryContractInfo()
      this.bill_status = v.bill_status
      v.isDisabled = /abandon/i.test(v.show_status)
      let b = this.isTimeLine = /^(normal|abandon)$/.test(v.bill_status)
      let parts = b ? this.parts.line : this.parts.edit
      if (v.bill_status === 'cancel') parts = this.parts.cancel
      if (isRelaDeal(v) && b) parts.push('ScRelaDeal')
      let part = this.payload.part || parts[0]
      this.path = part
      this.$tab.push({
        slot: true,
        show_menus: 'sc',
        parts,
        show: part,
        query: {
          ...v,
          x_line_type: 'PI',
        },
        mode: b ? 'timeline' : 'list'
      })
      this.$tab.setTitle(v.contract_no)
      this.changeTimeline(v)
    },
    changeTimeline (v) {
      this.$nextTick(() => {
        this.$tab.emit('change-timeline', arr => {
          if (!isRelaDeal(v)) return
          if (arr.find(f => f.key === 'ScRelaDeal')) return
          arr.splice(1, 0, {
            name: '关联交易',
            name_en: 'Related transaction',
            key: 'ScRelaDeal',
            path: 'ScRelaDeal'
          })
        })
      })
    },
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
</style>
