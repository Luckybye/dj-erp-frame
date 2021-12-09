/* eslint-disable */

import Vue from 'vue'

function snake2Camel (str, capLower) {
  let s = str.replace(/[-_](\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
  s = s.replace(/^\w/, function (x) {
    return capLower ? x.toLowerCase() : x.toUpperCase()
  })
  return s
}

let Dialogs = {}
let mergeDialog = v => {
  v.keys().reduce((pre, key) => {
    let part = v(key)
    let fileName = key.match(/@([a-zA-Z\-_0-9]+)\.vue$/i)[1] || 'a'
    fileName = snake2Camel(fileName)
    pre[fileName] = part
    return pre
  }, Dialogs)
}

const contexts = require.context('./', false, /@([a-zA-Z\-_0-9]+)\.vue$/i)
const contexts2 = require.context('@/views/', true, /@([a-zA-Z\-_0-9]+)\.vue$/i)

mergeDialog(contexts)
mergeDialog(contexts2)
Vue.prototype.$dialog && Vue.prototype.$dialog.setDialogs(Dialogs)

export default Dialogs
