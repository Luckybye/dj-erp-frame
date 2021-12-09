export default {
  props: {
    isCn: {
      type: [Boolean, String],
      default: ''
    }
  },
  computed: {
    lang () {
      let {locale} = this.$i18n
      if (this.isCn !== '') locale = this.isCn ? 'cn' : 'en'
      // console.log(this.isCn, 'locale', locale, this.$i18n.locale, this.isCn !== '')
      return locale
    }
  },
  methods: {
    tfield (f_cn, f_en) {
      f_en = f_en || (f_cn + '_en')
      return this.lang === 'cn' ? f_cn : f_en
    }
  },
  created () {
    if (this.$vnode && this.$vnode.context) {
      this.$t = this.$vnode.context.$t
    }
  }
}