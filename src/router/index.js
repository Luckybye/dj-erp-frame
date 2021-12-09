import VueRouter from 'vue-router'
import Main from '../views/main.vue'
import Cache from '@/lib/cache'

import page_login from '@/views/router-page/login'
import page_404 from '@/views/404/404'
import page_sup_crd from '@/views/sc/widget/sup-confirm-crd'
import page_spa from '@/layout/SPA'
import page_dialog from '@/layout/Dialog'

VueRouter.prototype.open = function (v) {
  let url = location.origin + location.pathname + '#'
  let window_name
  if (typeof v === 'string') {
    url += v
    window_name = v
  } else if (typeof v === 'object') {
    url += v.path
    window_name = v.path
    if (v.query) {
      window_name = v.query.window_name || window_name
      delete v.query.window_name
      url += ('?' + Object.entries(v.query).map(([k, v]) => `${k}=${v}`).join('&'))
    }
  }
  window.open(url, window_name)
}

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/tabs/:params*',
    name: 'Tabs',
    component: Main,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: page_login,
    meta: { noAuth: true }
  },
  {
    path: "/404",
    component: page_404,
    meta: { noAuth: true }
  },
  {
    path: "/sup-confirm-crd",
    name: "sup-confirm-crd",
    component: page_sup_crd,
    meta: { noAuth: true }
  },
  {
    path: "/tab/:path*",
    name: "SPA",
    props: true,
    component: page_spa,
    meta: { noAuth: false }
  },
  {
    path: "/dialog/:path",
    name: "dialog",
    props: true,
    component: page_dialog,
    meta: { noAuth: false }
  },
  { path: "*", redirect: "/404" }
]
const router = new VueRouter({
  routes
})

let ISLOGIN = false
async function isLogin () {
  if (ISLOGIN) return true
  let bool = false
  try {
    let data = await Cache.getUserInfo()
    window.vglobal = {user: data}
    bool = data.user_id
    ISLOGIN = bool
  } catch (e) {
  }
  return !!bool
}

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.noAuth) {
    next()
    return
  }
  let islogin = await isLogin()
  if (islogin) {
    next()
  } else {
    next('/login?redirect=' + window.encodeURI(to.path))
  }
})

export default router
