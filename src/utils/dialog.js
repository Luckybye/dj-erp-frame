/* eslint-disable */
import Vue from 'vue'
import {cloneDeep} from 'lodash'
let dialogs = {}
let dialogInstances = new Map()

// 解决苹果手机弹窗双滚动条，且滚动穿透的问题
let scrollTop = 0
const isIOS = /(iPhone|iPod|iPad);?/i.test(navigator.userAgent)
// body.dialog-open {
//   position: fixed;
//   width: 100%;
// }
function getScrollTop(){
  return document.body.scrollTop || document.documentElement.scrollTop;
}
function to(scrollTop){
  document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
}
function fixedBody () {
  if (isIOS) {
    scrollTop = getScrollTop()
    document.body.classList.add('dialog-open')
    // 把脱离文档流的body拉上去！否则页面会回到顶部！
    document.body.style.top = -scrollTop + 'px';
  }
}
function looseBody () {
  if (isIOS) {
    document.body.classList.remove('dialog-open');
    // 滚回到老地方
    to(scrollTop);
  }
}

function camel2Snake (str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

function newDialog (name, payload, callback) {
  console.log('newDialognewDialog')
  window.postMessage({
    type: 'dialog_open',
    data: {
      src: '/new_saas.html#/dialog/' + name,
      data: payload,
      name
    }
  }, '*')
  setTimeout(() => {
    let cb = d => {
      if (d.data && d.data.type === 'dialog_confirm') {
        console.log('dialog_confirm', d.data.data)
        callback(...d.data.data)
        window.removeEventListener('message', cb)
      }
    }
    window.addEventListener('message', cb)
  })
}

function showDialog (ComponentContext, name, payload, callback) {
  return new Promise((res, rej) => {
    // callback 必须是一个promise
    let parent = this
    function onCallback (...args) {
      callback = callback || function () {}
      let p = callback.call(parent, ...args)
      p = p instanceof Promise ? p : Promise.resolve(p)
      return p.then(function (v) {
        res(...cloneDeep(args))
        return v
      }, function (e) {
        rej(e)
        return Promise.resolve(e)
      })
    }
    if (window.self != window.top && !/^#\/dialog\//.test(window.location.hash)) return newDialog(name, payload, onCallback)
    fixedBody()

    if (!payload || typeof payload === 'string') payload = {message: payload || ''}
    payload = cloneDeep(payload || {})
    let data = Object.assign({show: true}, payload, {onCallback})

    // 注册，加到body
    let el = document.createElement('div')
    let page = Vue.component('Dialog-'+name, ComponentContext)
    page = new page({data, el, parent: this.$root})

    // 该实例在dom里面只能存在一个
    if (page.onlyOneinstance && dialogInstances.get(name)) {
      return page.onClose()
    }

    // 重新加载实例，销毁上一个实例
    if (page.reloadInstance) {
      dialogInstances.get(name) && dialogInstances.get(name).onClose()
    }
    if (payload._parent) {
      payload._parent.appendChild(page.$el)
    } else document.body.appendChild(page.$el)
    page.$el.classList.add(camel2Snake(name) + '-dialog')
    dialogInstances.set(name, page)
  })
}

export default function () {
  function setDialogs (values) {
    if (!values) return
    Object.keys(values).forEach(function (name) {
      let ComponentContext = values[name].default || {}
      const _onClose = (ComponentContext.methods || {}).onClose
      ComponentContext.methods.onClose = function (...args) {
        // 唯一实例销毁的时候，删除记录
        dialogInstances.delete(name)
        // 销毁实例dom，$destroy不会销毁该实例的dom
        document.body.contains(this.$el) && document.body.removeChild(this.$el)
        // 销毁该实例
        this.$destroy(true)
        // 执行自定义的onClose
        _onClose && _onClose.call(this, ...args)
        looseBody()
        window.postMessage({
          type: name + '_dialog_close',
        }, '*')
      }
      dialogs[name] = function (...args) {
        return showDialog.call(this, ComponentContext, name, ...args)
      }
    })
  }

  return function () {
    let self = this
    let ins = {}
    ins['setDialogs'] = setDialogs.bind(self)
    Object.keys(dialogs).forEach(function (name) {
      ins[name] = dialogs[name].bind(self)
    })
    return ins
  }
}
