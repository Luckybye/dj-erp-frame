export default {
  components: {
  },
  data () {
    return {
    }
  },
  props: {
    payload: {
      type: Object,
      default () {
        return {}
      }
    },
    parent: {
      type: String,
      default: ''
    },
    componentName: {
      type: String,
      default: ''
    },
    tabId: {
      type: String,
      default: ''
    },
    actived: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    modelReset (f, time = 0) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this[f]) this['old__' + f] = this.$h.cloneDeep(this[f])
          // console.log('modelReset', f, this[f], this['old__' + f])
        })
      }, time)
    },
    diffValue (newf, retainf, oldf) {
      let newV = this[newf]
      let oldV = this[oldf || ('old__' + newf)]
      // console.log(newf, '11111', oldV)
      if (!oldV) return newV
      let diff
      if (Array.isArray(newV)) {
        diff = !this.$h.isEqual(newV, oldV)
      } else {
        diff = this.$h.diffValue(oldV, newV, retainf)
      }
      // console.log(diff, newf, 'diffdiffdiff')
      return diff
    }
  }
}