/* eslint-disable */
import Vue from 'vue'
// import UmyUi from 'umy-ui'
import { UTable, UTableColumn } from 'umy-ui'
// import locale from 'umy-ui/lib/locale/lang/en'
// import draggable from 'vuedraggable'
import Mixins from './mixins'

// 注册所有
function snake2Camel (str, capLower) {
  let s = str.replace(/[-_](\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
  s = s.replace(/^\w/, function (x) {
    return capLower ? x.toLowerCase() : x.toUpperCase()
  })
  return s
}
let layout = require.context('./', true, /([a-zA-Z\-_0-9]+)\.vue$/)
layout = layout.keys().forEach(key => {
  let fileName = key.match(/([a-zA-Z\-_0-9]+)\.vue$/i)[1]
  fileName = snake2Camel(fileName)
  let v = layout(key).default
  v.mixins || (v.mixins = [])
  v.mixins.push(Mixins)
  Vue.component(fileName, v)
})


// Vue.use(UmyUi);
Vue.component(UTable.name, UTable)
Vue.component('XTableColumn', UTableColumn)
// Vue.component('draggable', draggable)