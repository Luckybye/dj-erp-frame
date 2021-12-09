import store from "@/store";
// import Router from './index'

const RouterMethods = Object.create(null)
let EventBus = new Map()
window.EventBus = EventBus
let findTabId = v => {
  // console.log(v.tabId, 'vvvvvvvvvvvv')
  if (v.tabId) return v.tabId
  if (!v.$parent) return
  return findTabId(v.$parent)
}
RouterMethods.install = function (Vue) {
  // 处理 push 和 replace 2个接口的附带参数
  function processData(item, payload) {
    let newItem = {};
    if (typeof item === "string") {
      newItem.path = item;
    } else {
      newItem = item;
    }
    // 如果有第二个参数，则会覆盖原本的 query
    if (payload) newItem.query = { ...newItem.query, ...payload };
    return newItem;
  }
  const tab = {
    // 设置当前显示的 tab name
    showTab(data) {
      // console.log(data, 1111111111111)
      store.commit("SetCurrentTabIndex", data);
    },
    showHome(data) {
      // console.log(data, 1111111111111)
      store.commit("SetCurrentTabIndex", 'Home');
    },
    // 打开新的 tab  项
    open(item) {
      if (window.new_tab && (!item.query || !item.query.SPA)) {
        console.log('new_tabnew_tabnew_tab')
        window.postMessage({type: 'new_tab', data: item}, '*')
        // return
      } else {
        item.from = this.tabId
        store.commit("OpenTab", item);
      }
    },
    // 删除 tab 项
    close(menuId) {
      store.commit("CloseTab", menuId || this.tabId);
    },
    // 跳转
    push(item, payload) {
      // console.log(this, 'pushpushpushpushpushpushpushpushpush');
      let newItem = processData(item, payload);
      if (newItem.slot) newItem.slot = this.componentName || true
      newItem.from = newItem.from || this.componentName
      newItem.tab_id = this.tabId
      // if (newItem.show_menus) newItem.mode = newItem.mode || 'horizontal'
      store.dispatch("OpenedTabPush", newItem);
    },
    // 后退
    back(v) {
      v = v || {show: this.componentName}
      // if (typeof num === 'number') v.step = num || 1
      // if (typeof num === 'object') Object.assign(v, num)
      // if (typeof num === 'string') v.to = num

      store.commit("OpenedTabBack", v);
    },
    // 替换
    replace(item, payload) {
      let newItem = processData(item, payload);
      store.commit("ReplaceTab", newItem);
    },
    // 关闭所有 tab
    closeAll() {
      store.commit("CloseAllTabs");
    },
    // 关闭其他标签
    closeOthers(tab) {
      store.commit("CloseOthersTabs", tab);
    },
    // 根据浏览器的 url 回显 tab
    reShow() {
      store.commit("ReShowHash");
    },
    // 获取当前激活的 tab
    info() {
      let tabId = this.tabId
      return store.getters.GetOpenedTabs.find(f => f.tab_id === tabId) || store.getters.GetCurrentTab
    },
    // 获取当前组件的查询参数
    query (path) {
      path = path || this.componentName
      let tab = store.getters.GetCurrentTab
      let tabId = this.tabId
      if (tabId !== tab.tab_id && tabId) {
        tab = store.getters.GetOpenedTabs.find(f => f.tab_id === tabId)
      }
      let query = tab.query || {}
      let findQuery = (v) => {
        if (!v.parts || !v.parts.length) return
        let p = v.parts.find(f => f.path === path)
        if (!p) return findQuery(v.parts.find(f => f.path === v.show))
        query = p.query || {}
      }
      findQuery(tab)
      return query;
    },
    // 设置当前组件的查询参数
    setQuery (data, path) {
      path = path || this.componentName
      let tab = store.getters.GetCurrentTab
      let tabId = this.tabId
      if (tabId !== tab.tab_id && tabId) {
        tab = store.getters.GetOpenedTabs.find(f => f.tab_id === tabId)
      }
      let query = tab.query || {}
      let curr = tab
      let findQuery = (v) => {
        if (!v.parts || !v.parts.length) return
        let p = v.parts.find(f => f.path === path)
        if (!p) return findQuery(v.parts.find(f => f.path === v.show))
        query = p.query || {}
        curr = p
      }
      findQuery(tab)
      Object.assign(query, data)
      Vue.set(curr, 'query', query)
      store.commit("SetHash");
    },
    refresh (tab) {
      let slotPush = tab === true
      if (tab && typeof tab === 'object' && tab.tab_id) {
        tab = store.getters.GetOpenedTabs.find(f => f.tab_id === tab.tab_id)
      } else tab = store.getters.GetCurrentTab
      let c = tab.parts;
      tab.parts = [];
      tab.slotPush = slotPush
      this.$nextTick(() => {
        // 待定
        if (slotPush) {
          tab.show = c[0].path
          if (c.length > 1) c = c.slice(0, 1)
        }

        tab.parts = c;
      });

      slotPush && store.commit("SetHash");
    },
    setTitle (t) {
      let tabId = this.tabId
      let tab = store.getters.GetOpenedTabs.find(f => f.tab_id === tabId) || store.getters.GetCurrentTab
      tab.title = t
    },
    emit (type, ...arg) {
      let tabId = findTabId(this)
      let evList
      if (tabId) {
        evList = (EventBus.get(tabId) || {})[type]
      } else {
        evList = EventBus.get(type)
      }
      if (evList) {
        for (let i = 0; i < evList.length; i++) {
          const fun = evList[i];
          fun(...arg)
        }
      }
      // console.log(EventBus, 'EventBus emitemitemitemit', evList)
    },
    on (type, listener) {
      if (typeof listener !== 'function') throw new TypeError('listener must be a function');
      let tabId = findTabId(this)
      // console.log('on type, listener', tabId)
      if (tabId) {
        let evList = EventBus.get(tabId) || {}
        evList[type] || (evList[type] = [])
        if (evList[type].find(f => f === listener)) return
        evList[type].push(listener)
        EventBus.set(tabId, evList)
        // console.log(evList[type], 'type', type)
      } else {
        let evList = EventBus.get(type) || []
        evList.push(listener)
        EventBus.set(type, evList)
      }
      if (type === 'tab-close') {
        let tab = store.getters.GetOpenedTabs.find(f => f.tab_id === tabId)
        if (tab) tab.hasCloseEvent = true
      }
      // console.log(EventBus, 'EventBus onononononon')
    },
    remove (type, listener) {
      if (typeof listener !== 'function') throw new TypeError('listener must be a function');
      let tabId = findTabId(this)
      if (tabId) {
        let evList = EventBus.get(tabId) || {}
        if (!evList[type]) return
        evList[type] = evList[type].filter(f => f !== listener)
        EventBus.set(tabId, evList)
        // console.log(EventBus.get(tabId), 'removeremoveremove', type)
      } else {
        let evList = EventBus.get(type)
        if (!evList) return
        let i = evList.findIndex(f => f === listener)
        evList.splice(i, 1)
        EventBus.set(type, evList)
      }
      // console.log(EventBus, 'EventBus removeremoveremove')
    },
    scrollTo (val) {
      let tabId = 'pane-' + findTabId(this)
      let scrollEl = document.getElementById(tabId)
      let top = val
      if (val === 'top') top = 0
      if (val === 'bottom') top = scrollEl.scrollHeight - scrollEl.clientHeight
      scrollEl.scrollTop = top
    },
    dom () {
      let tabId = 'pane-' + findTabId(this)
      return document.getElementById(tabId)
    },
    fullScreen () {
      this.$h.requestFullScreen(document.body, (isFull) => {
        let cls = ['full-screen-body', 'hidden-header', 'hidden-aside', 'hidden-tabs']
        isFull && document.body.classList.add(...cls)
        isFull || document.body.classList.remove(...cls)
      })
    }
  };

  // Object.defineProperties(tab, {
  //   query: {
  //     get () {

  //       return store.getters.GetCurrentTab
  //     }
  //   }
  // })

  const TabRote = function () {
    let obj = {}
    Object.keys(tab).forEach(key => {
      obj[key] = tab[key].bind(this)
    })
    return obj
  }
  Object.defineProperties(Vue.prototype, {
    $tab: {
      get () {
        return TabRote.call(this)
      }
    }
  })
}
export default RouterMethods