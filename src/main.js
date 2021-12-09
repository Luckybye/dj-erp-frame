import Vue from 'vue'
import App from './App.vue'
// import '@/registerServiceWorker'
// 加载自定义工具类
import '@/utils'
import router from '@/router'
import store from '@/store'

// // 引入ui组件库和样式
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

// 加载全局样式
import 'normalize.css/normalize.css'
import '@/styles/index.scss'

// 加载路由方法
import '@/router/utils'
// 导入用户菜单
import './router/user-menus'
// 加载语言
import {i18n} from '@/lang'
// 组件注册
import '@/components'
// 弹窗注册
import '@/dialogs'
// svg
import '@/icons'

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$event = new Vue()

let app = new Vue({
  router,
  store,
  i18n,
  data: {
    isSaas: true,
    login_domain: 'saas'
  },
  render: h => h(App)
}).$mount('#app')
window.name = window.name || 'DjNewSaas'

export default app