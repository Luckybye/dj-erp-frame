
export default {
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    isDisableEdit () {
      let row = this.payload || this.vm || {}
      let {edit} = this.custAuth
      let me = this.$state('me')
      return !(edit === 'all' ||
              (edit === 'self' && row.owner_id === me.user_id) ||
              (edit === 'legal' && (me.legals || []).includes(row.legal_id)) ||
              (edit === 'group' && (me.busi_groups || []).concat(this.$groupId).includes(row.busi_group_id)))
    },
    custAuth () {
      let config = this.$store.getters.user_auth
      let row = this.payload || {}
      if (row.cust_type === '4') return config.supplier_auth || {}
      if (row.cust_type === '2') return config.cust_auth || {}
      return {edit: 'all', add: 'yes', view: 'all'}
    },
  },
  mixins: [],
  methods: {
  },
  created () {
  },
  beforeDestroy() {}
}
