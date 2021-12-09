import Vue from 'vue'
let castCmpt = {
  ElMain: true,
  ElTabs: true,
  EltabPane: true,
  Tab: true,
}
export function broadcast (eventName, params) {
  this.$children.forEach(child => {
    let name = child.$options.name
    console.log(child.componentName, name, 'childchildchild')
    if (castCmpt[name] || child.componentName) {
      child.$emit.apply(child, [eventName].concat(params))
      broadcast.apply(child, [eventName].concat(params))
    }
  })
}

export function dispatch (eventName, params) {
  var parent = this
  var name = parent.$options.name

  while (parent && (!name || name !== 'Main')) {
    parent.$emit.apply(parent, [eventName].concat(params))
    parent = parent.$parent
    name = parent.$options.name
  }
}

Vue.prototype.$broadcast = broadcast
Vue.prototype.$dispatch = dispatch