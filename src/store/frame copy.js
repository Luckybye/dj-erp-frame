/* eslint-disable */
import Vue from "vue";
import { Base64 } from "js-base64";
import store from "@/store";
import Router from "@/router";
import _ from 'lodash'

function handlerParts(v) {
  if (v.parts && v.parts.length) {
    v.parts = v.parts.map((f) => (typeof f === "string" ? { path: f } : f));
  }
}

// 当浏览器刷新时，某些页面会自动调用push或open，这样会改变当前路由，所以这时需要禁用自动push，
// 默认30s后开启，或者页面有点击的时候开启（可能用户手动push）
function disableAutoPush () {
  window.disable_auto_push = true
  // console.log('disableAutoPushdisableAutoPushdisableAutoPushdisableAutoPush', window.disable_auto_push)
  setTimeout(startAutoPush, 30000)
  addEvent()
}
function startAutoPush () {
  window.disable_auto_push = false
  // console.log('startAutoPushstartAutoPushstartAutoPushstartAutoPush', window.disable_auto_push)
  setTimeout(removeEvent)
}

function addEvent () {
  window.addEventListener('click', startAutoPush, true)
}
function removeEvent () {
  window.removeEventListener('click', startAutoPush, true)
}

function parseHash () {
  let hash = (location.hash || "").replace(/^#/, "")
  let index = hash.indexOf('?')
  hash = hash.slice(0, index >= 0 ? index : hash.length)
  if (!hash || hash === '/') return '/';
  if (!/^\/tabs\//.test(hash)) return
  hash = hash.replace('/tabs/', "")
  hash = window.decodeURIComponent(hash)
  return hash
}

export default {
  state: {
    currentTabIndex: "",
    homeTab: {},
    userMenus: [],
    menuType: '',
    menus: {},
    openedTabs: [],
    userMenuAuth: {}
  },
  getters: {
    // 获取 当前显示的 tab name
    GetCurrentTabIndex: (state) => state.currentTabIndex,
    // 获取 主页 tab 的 tab_id
    GetHomeTab: (state) => state.homeTab,
    // 获取 当前打开的 tab 列表
    GetOpenedTabs: (state) => state.openedTabs,
    GetMenus: (state) => state.menus,
    GetUserMenus: (state) => state.userMenus,
    menuType: (state) => state.menuType,
    userMenuAuth: (state) => state.userMenuAuth,
    GetCurrentTab(state) {
      return state.openedTabs.find((i) => i.tab_id === state.currentTabIndex);
    },
  },
  mutations: {
    // 设置 路由
    SetHash(state, data) {
      window.sessionStorage.setItem('openedTabs', JSON.stringify(state.openedTabs))
      if (data && data.hash === false) return
      console.log('SetHashSetHash', data)
      let tab = state.openedTabs.find(
        (f) => f.tab_id === state.currentTabIndex
      );
      // console.log("SetHash:", tab);
      if (!tab || tab.hash === false) return;
      tab = { ...tab };
      delete tab.open_time;
      let path =
        "/tabs/" +
        window.encodeURIComponent(Base64.encode(JSON.stringify(tab)));
      // let a = window.encodeURIComponent(Base64.encode(JSON.stringify(tab)))
      // console.log(JSON.parse(Base64.decode(window.decodeURIComponent(a))))
      let hash = location.hash.replace(/^#/, "");
      if (hash === path) return;
      // console.log(path, 'SetHashSetHashSetHashSetHash')
      window.sessionStorage.setItem('openedTabs', JSON.stringify(state.openedTabs))
      if (data && data.replace) {
        return Router.replace(path).catch((err) => {
          // console.log("router push error：%s", err);
        });
      }
      Router.push(path).catch((err) => {
        // console.log("router push error：%s", err);
      });
    },
    // 设置 当前显示的 tab
    SetCurrentTabIndex(state, data) {
      if (typeof data === "string") data = state.openedTabs.find((f) => f.tab_id === data);
      if (!data) return;
      state.currentTabIndex = data.tab_id;
      data.open_time = Date.now();
      store.commit("SetHash", data);
    },
    ShowHomeTab(state, item) {
      item = item || state.homeTab;
      // console.log("ShowHomeTabShowHomeTabShowHomeTab", item);
      state.openedTabs = [item];
      store.commit("SetCurrentTabIndex", item);
    },
    SetOpenedTabs(state, data) {
      state.openedTabs = data;
    },
    // 回显 tab
    ReShowHash(state) {
      let hash = parseHash()
      if (hash === '/') return store.commit("ShowHomeTab");
      if (!hash) return
      try {
        hash = Base64.decode(hash);
        let tab = JSON.parse(hash);
        if (tab) {
          let tabs = window.sessionStorage.getItem('openedTabs')
          if (tabs) {
            state.openedTabs = JSON.parse(tabs)
          } else {
            if (!state.openedTabs.length) state.openedTabs = [state.homeTab];
            let tabExsit = state.openedTabs.find((i) => i.tab_id === tab.tab_id);
            if (!tabExsit) {
              state.openedTabs.push(tab);
            } else Object.assign(tabExsit, tab);
          }

          store.commit("SetCurrentTabIndex", tab);
          disableAutoPush()
        }
      } catch (error) {
        console.log("ReShowHash error: %s", error);
        Router.replace('/404')
      }
    },
    SetHomeTab(state, data) {
      state.homeTab = data;
      // console.log("SetHomeTabSetHomeTab");
    },
    // 新开/替换 tab
    OpenedTabsPush(state, item) {
      if (window.disable_auto_push && item.hash !== false) return
      item = { ...item };
      let { target } = item;
      delete item.target;
      if (target === "_blank") item.tab_id = item.tab_id + "_" + Date.now();
      item.tab_id = item.tab_id || Date.now();

      handlerParts(item);
      if (!item.parts) Vue.set(item, 'parts', [{ ...item }])
      item.show = item.show || item.path;
      delete item.path;
      // 判断 tab 项是否已存在
      let tabExsit = state.openedTabs.find((i) => i.tab_id === item.tab_id);
      if (target === "_self") {
        state.openedTabs[state.openedTabs.length - 1] = item;
      } else if (!tabExsit) {
        state.openedTabs.push(item);
      }
      // console.log(item, "OpenedTabsPushOpenedTabsPush");

      store.commit("SetCurrentTabIndex", item);
    },
    // 当前 tab 内部的跳转
    OpenedSubTabsPush(state, item) {
      if (window.disable_auto_push && item.hash !== false) return
      let ii = state.openedTabs.findIndex((i) => i.tab_id === state.currentTabIndex);
      let v = state.openedTabs[ii]
      handlerParts(item);
      let parent = v
      let partIndex = 0;
      let part
      // slot存在表示插入当前页面，寻找插入位置，直到最底一层
      let findSlot = (s) => {
        if (!s) return;
        let index = s.parts.findIndex((f) => f.path === s.show);
        if (index < 0) return
        let curr = s.parts[index]
        if (item.slot === curr.path || !curr.parts || !curr.parts.length) {
          partIndex = index;
          parent = s
        } else findSlot(curr);
      };
      // 不是slot，则替换上一个显示页面last_show
      let findPart = (s) => {
        if (s.show === item.last_show) {
          parent = s;
        } else {
          let c = s.parts.find((f) => f.path === s.show);
          if (!c) return
          if (!c.parts || !c.parts.length) return (parent = s);
          findPart(c);
        }
      };
      if (item.slot) {
        // 查找slot页面
        findSlot(v);
        part = {...parent.parts[partIndex]}
        if (!part) return;
        part.slot = item.slot
        part.show = item.show || item.path
        if (item.parts && item.parts.length) {
          Object.assign(part, item)
          parent.parts.splice(partIndex, 1, part)
        } else {
          let c = { ...item };
          delete c.slot;
          part.parts = [c];
          // console.log(parent.parts, partIndex, 7777777777777)
          item.slot && parent.parts.splice(partIndex, 1, part)
        }
      } else {
        findPart(v)
        // console.log(parent, item, 888888888888888888)
        if (parent.show_menus && item.target !== '_blank') {
          let i = parent.parts.findIndex(f => f.path === item.last_show)
          // console.log(i, 'iiiiiiiiiiiiiiiiiiii', item.last_show)
          let pt = {...parent.parts[i]}
          if (pt) {
            let m = {...item}
            delete m.target
            delete m.last_show
            delete pt.slot
            pt.parts = [{path: pt.path}]
            pt.show = item.show || item.path
            pt.parts.push(m)
            parent.parts.splice(i, 1, pt)
            return
          }
        } else {
          parent.show = item.show || item.path
          parent.parts.push({...item})
        }
      };
      store.commit("SetHash", item);
    },
    // 返回
    OpenedSubTabsBack(state, m) {
      let cur = state.openedTabs.find(i => i.tab_id === state.currentTabIndex)
      if (!cur) return
      let part = cur
      let findPart = v => {
        if (!v || !v.parts || !v.parts.length) return
        if (v.show === m.show) return (part = v)
        findPart(v.parts.find(f => v.show === f.path))
      }
      let newLength = cur.parts.length - m.step;
      if (m.to) {
        let i = cur.parts.findIndex(f => f.path === m.to)
        if (i >= 0) newLength = i + 1
      }
      if (newLength > 0) {
        cur.parts = cur.parts.slice(0, newLength);
        cur.show = cur.parts[cur.parts.length - 1].path;
      }
      store.commit("SetHash", { replace: true });
    },
    // 替换当前组件
    OpenedSubTabsReplace(state, item) {
      let index = state.openedTabs.length - 2;
      state.openedTabs.map((i) => {
        if (i.tab_id === state.currentTabIndex) {
          i.parts.splice(index, 1, item);
        }
      });
      store.commit("SetHash");
    },
    // 从 tab 列表 移除 tab
    OpenedTabsRemove(state, tab_id) {
      state.openedTabs = state.openedTabs.filter((item) => {
        return item.tab_id === state.homeTab.tab_id || item.tab_id !== tab_id;
      });

      // 查询上次打开的标签
      let tab;
      for (let i = 0; i < state.openedTabs.length; i++) {
        const m = state.openedTabs[i];
        if (!tab) tab = m;
        if (m.open_time > tab.open_time) tab = m;
      }
      if (!tab) tab = state.homeTab;
      console.log('OpenedTabsRemoveOpenedTabsRemove', tab.tab_id)
      store.commit("SetCurrentTabIndex", tab);
    },
    // 关闭 其他的 tab
    CloseOthersTabs(state, data = {}) {
      let currentTabIndex = data.tab_id || state.currentTabIndex
      state.openedTabs = state.openedTabs.filter((item) => {
        return (
          item.tab_id === state.homeTab.tab_id ||
          item.tab_id === currentTabIndex
        );
      });
      store.commit("SetCurrentTabIndex", currentTabIndex);
    },
    // 关闭所有 tab
    CloseAllTabs(state) {
      state.openedTabs.length = 1;
      let tab = state.openedTabs[0];
      store.commit("SetCurrentTabIndex", tab);
    },
    SetMenus(state, data) {
      state.menus = data;
    },
    SetUserMenus(state, data) {
      state.userMenus = data;
    },
    SetUserMenuAuth(state, data) {
      state.userMenuAuth = data;
    },
    SetMenuType(state, data) {
      state.menuType = data;
    },
  },
  actions: {
    SetMenus({ commit }, data) {
      commit("SetMenus", data);
    },
    SetUserMenus({ commit }, data) {
      commit("SetUserMenus", data);
    },
    SetUserMenuAuth({ commit }, data) {
      commit("SetUserMenuAuth", data);
    },
    SetCurrentTabIndex({ commit }, data) {
      commit("SetCurrentTabIndex", data);
    },
    SetHomeTab({ commit }, data) {
      commit("SetHomeTab", data);
    },
    ShowHomeTab({ commit }, data) {
      commit("ShowHomeTab", data);
    },
    ReShowHash({ commit }, data) {
      commit("ReShowHash", data);
    },
    SetOpenedTabs({ commit }, data) {
      commit("SetOpenedTabs", data);
    },
    SetMenuType({ commit }, data) {
      commit("SetMenuType", data);
    },
  },
};
