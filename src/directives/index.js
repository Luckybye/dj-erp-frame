import Vue from 'vue'

const contexts = require.context('./items/', false, /^\.\/.*\.js$/)
let modules = contexts.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = contexts(key)
  return modules
}, {})

Object.keys(modules).forEach(function (key) {
  Vue.directive(key, modules[key].default(Vue))
})
