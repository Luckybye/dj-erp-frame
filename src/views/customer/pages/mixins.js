export default {
  props: {
    vm: {
      type: Object,
      default () {
        return {}
      }
    },
    payload: {
      type: Object,
      default () {
        return {}
      }
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    custType: {
      type: String,
      default: '2'
    },
    billId: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    approving: Boolean,
    isPass: Boolean,
    path: String,
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mixins: [],
  methods: {
    onSave (v) {
      this.$emit('save', v)
    }
  },
  created () {
  },
  beforeDestroy() {}
}
