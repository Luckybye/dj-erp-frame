
import { initExtend } from '@/lib/fields/prod-extend.js'

export default {
  methods: {
    initTheme () {
      let theme_name = localStorage.getItem('dj_saas_theme_name') || 'dj-erp-theme--light'
      document.body.classList.add(theme_name)
      let colors = JSON.parse(localStorage.getItem('dj_saas_theme') || '[]')
      colors.forEach(row => {
        let f = '--' + row.key
        document.body.style.setProperty(f, row.value)
      });
    }
  },
  created () {
    // this.$constant.asyncLoad()
    initExtend()
    this.initTheme()
    setTimeout(() => {
      this.$cache.load()
    }, 1000);
  }
}