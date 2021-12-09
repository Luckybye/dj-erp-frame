
/* eslint-disable */
import Vue from 'vue'
import './helper.js'
import './request'
import './api'
import * as filters from './filters'
import './core-extend.js'
import '../directives'
import ObjectID from '@/lib/objectid'
import '@/lib/cache'
import {validate, createRules} from './validate-rule'
import constantMap from '@/lib/constant.js'
import Dialog from './dialog.js'
import vueDrag from '@/lib/vue-dragging.js'
import {registerFilter} from '@/lib/sys-note'
import Configure from './configure'
import PromiseX  from './promise-x'
import '@/lib/global-extend.js'
import './emitter'
import './open-page'
import './notify'
import './web-socket'

Vue.use(vueDrag)
let dialog = Dialog()
let configure = Configure()

Vue.prototype.$validate = validate
Vue.prototype.$createRules = createRules

// 用于业务数据所属公共组
Vue.prototype.$groupId = '59b6250829f7a15b5806b0f4'

// Vue.prototype.$tt = (v, field) => {
//   let lang = window.localStorage.getItem('dj_language') || 'cn'
//   if (!v) return ''
//   if (!field) return v
//   // if (!v.hasOwnProperty(field)) return ''
//   let f = field + '_' + lang
//   f = f.replace(/_cn$/, '')
//   let f_en = field + '_en'
//   return v[f] || v[f_en] || v[field]
// }

Object.defineProperties(Vue.prototype, {
  $dialog: {
    get () {
      return dialog.call(this)
    }
  },
  $nextId: {
    get() {
      return ObjectID().toString();
    }
  },
  $configure: {
    get() {
      return configure.call(this);
    }
  },
  $Promise: {
    get() {
      return PromiseX
    }
  },
})

Object.keys(filters).forEach(function (key) {
  Vue.filter(key, filters[key])
  Vue.prototype['$' + key] = filters[key]
})


Object.keys(constantMap).forEach(function (key) {
  let obj = constantMap[key]()._object('key')
  Vue.filter(key, function (f) {
    return Vue.prototype.$tt(obj[f], 'text')
  })
})

registerFilter(Vue)