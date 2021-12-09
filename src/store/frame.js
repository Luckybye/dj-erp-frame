import Vue from "vue";
import { Base64 } from "js-base64";
import store from "@/store";
import Router from "@/router";
// import {isEqual} from 'lodash'

function isEqual (a1, a2) {
  return a1.every((f, i) => f.path === (a2[i] || {}).path)
}

function handlerParts(v) {
  if (v.parts && v.parts.length) {
    v.parts = v.parts.map((f) => (typeof f === "string" ? { path: f } : f));
  }
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
      // console.log('SetHashSetHash', data)
      let tab = state.openedTabs.find(
        (f) => f.tab_id === state.currentTabIndex
      );
      // console.log("SetHash:", tab);
      if (!tab || tab.hash === false) return;
      let query = { ...tab };
      // delete tab.open_time;
      let uri = '/tabs/'
      if (location.hash.split('/')[1] === 'tab') {
        uri = '/tab/' + tab.show + '/'
        window.name = tab.tab_id
        query = tab.query
      }
      let path = uri +
        window.encodeURIComponent(Base64.encode(JSON.stringify(query)));
      // let a = window.encodeURIComponent(Base64.encode(JSON.stringify(tab)))
      // console.log(JSON.parse(Base64.decode(window.decodeURIComponent(a))))
      let hash = location.hash.replace(/^#/, "");
      if (hash === path) return;
      // console.log(path, 'SetHashSetHashSetHashSetHash')
      window.sessionStorage.setItem('openedTabs', JSON.stringify(state.openedTabs))
      if (data && data.replace) {
        return Router.replace(path).catch((err) => {
          console.log("router push error：%s", err);
        });
      }
      Router.push(path).catch((err) => {
        console.log("router push error：%s", err);
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
    OpenTab(state, item) {
      item = { ...item };
      let { target } = item;
      delete item.target;
      if (target === "_blank") item.tab_id = item.tab_id + "_" + Date.now();
      item.tab_id = item.tab_id || Date.now().toString();
      if (!item.title) {
        item.title = "新开页签";
        item.title_en = "New Tab";
      }

      handlerParts(item);
      if (!item.parts) Vue.set(item, 'parts', [{ ...item }])
      item.show = item.show || item.path;
      delete item.path;
      // 判断 tab 项是否已存在
      let tabExsit = -1
      let fromIndex = -1
      state.openedTabs.forEach((m, i) => {
        m.tab_id === item.tab_id && (tabExsit = i)
        m.tab_id === item.from && (fromIndex = i)
      });
      if (window.SPA && state.openedTabs.length) {
        state.openedTabs.splice(0, 1, item)
      } else if (tabExsit >= 0) {
        // 外部参数有变更时，是否更新已打开页签的参数，待定
        if (item.query) Object.assign(state.openedTabs[tabExsit].query || {}, item.query || {})
        if (target === 'refresh') {
          state.openedTabs.splice(tabExsit, 1)
          Vue.nextTick(() => {
            state.openedTabs.splice(tabExsit, 0, item)
          })
        }
      } else if (tabExsit < 0) {
        // 当从某个页签里面新开页签时，在该页签位置后面打开
        if (fromIndex >= 0) {
          state.openedTabs.splice(fromIndex + 1, 0, item);
        } else state.openedTabs.push(item);
      }
      // console.log(item, "OpenTabOpenTabOpenTab");

      store.commit("SetCurrentTabIndex", item);
    },
    // 当前 tab 内部的跳转
    OpenedTabPush(state, item) {
      let tabId = item.tab_id || state.currentTabIndex
      delete item.tab_id
      let ii = state.openedTabs.findIndex((i) => i.tab_id === tabId);
      let v = state.openedTabs[ii]
      handlerParts(item);
      let parent = v
      let partIndex = 0;
      let part
      // slot存在表示插入当前页面，寻找插入位置，直到最底一层
      let findSlot = (s) => {
        if (!s) return;
        if (v.x_mode === 'anchor' || v.x_mode === 'list') {
          s.parts && s.parts.forEach((curr, index) => {
            if (item.slot === curr.path) {
              partIndex = index;
              parent = s
            } else findSlot(curr);
          })
        } else {
          let index = s.parts.findIndex((f) => f.path === s.show);
          if (index < 0) return
          let curr = s.parts[index]
          if (item.slot === curr.path || !curr.parts || !curr.parts.length) {
            partIndex = index;
            parent = s
          } else findSlot(curr);
        }
      };
      // 不是slot，则替换上一个显示页面from
      let findPart = (s) => {
        if (s.show === item.from) {
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
        // console.log("parent", parent, partIndex)
        part = {...parent.parts[partIndex]}
        if (!part) return
        parent.parts[partIndex].query = {...part.query, ...item.query}
        // console.log(part.show === item.show, part.show, item.show, 'part.show === item.show', v.refresh)
        // 手动刷新时，slot页面不自动push
        // console.log(v, item, part, 'partpartpart')
        if (v.slotPush === false) return (v.slotPush = '')
        // slot一般是页面加载后自动调用方法，为防止网页刷新，导致自动push覆盖刷新前的结果，判断parts是否一样，一样则返回
        if (part.parts && isEqual(part.parts, item.parts) && part.show === item.show) return
        // console.log('partspartsparts', part.parts, item.parts)
        // console.log(isEqual(part.query, item.query), 'queryqueryquery', part.query, item.query)
        // parent.parts[partIndex].query = {...part.query, ...item.query}
        // console.log(partIndex, parent, 'parentparentparent')
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
        if (item.target !== '_blank') {
          let i = parent.parts.findIndex(f => f.path === item.from)
          let pt = parent.parts[i]
          if (pt) {
            let m = {...item}
            delete m.target
            delete m.from
            delete pt.slot
            Vue.set(pt, 'push', item.from)
            Vue.set(pt, 'parts', [])
            pt.show = item.show || item.path
            pt.parts.push(m)
          }
        } else {
          parent.show = item.show || item.path
          parent.parts.push({...item})
        }
      };
      store.commit("SetHash", item);
    },
    // 返回
    OpenedTabBack(state, m) {
      let part
      if (m.path) {
        part = m
      } else {
        let cur = state.openedTabs.find(i => i.tab_id === state.currentTabIndex)
        if (!cur) return
        part = cur
        let findPart = v => {
          if (!v || !v.parts || !v.parts.length) return
          if (v.show === m.show) return (part = v)
          findPart(v.parts.find(f => v.show === f.path))
        }
        findPart(cur)
      }
      let cp = part.parts[part.parts.length - 1]
      if (cp.target === '_blank' && part.parts.length >= 2) {
        part.parts.length = part.parts.length - 1
        part.show = (part.parts[part.parts.length - 1]).path
      } else {
        part.parts = []
        part.show = ''
        part.push = ''
      }
      store.commit("SetHash", { replace: true });
    },
    // 替换当前Tab
    ReplaceTab(state, newTab, oldTab = {}) {
      if (!newTab) return
      let tabIndex = oldTab.tab_id || state.currentTabIndex
      let i = state.openedTabs.findIndex(f => f.tab_id === tabIndex)
      state.openedTabs.splice(i, 1, newTab)
      store.commit("SetHash");
    },
    // 从 tab 列表 移除 tab
    async CloseTab(state, tab_id) {
      let i = state.openedTabs.findIndex((item) => {
        return item.tab_id !== state.homeTab.tab_id && item.tab_id === tab_id;
      });
      if (i < 0) return

      let ps = []
      if (state.openedTabs[i].hasCloseEvent) {
        console.log('处理保存事件')
        let evList = (window.EventBus.get(tab_id) || {})['tab-close']
        console.log(evList, 'evListevList')
        if (evList) {
          for (let i = 0; i < evList.length; i++) {
            const fun = evList[i];
            ps.push(fun())
          }
        }
      }
      if (ps.length) {
        // 当不在当前被关闭页签时，假如弹窗提示，就跳到当前页签
        let jumpClosePage = true
        setTimeout(() => {
          if (jumpClosePage && state.currentTabIndex !== tab_id) store.commit("SetCurrentTabIndex", state.openedTabs[i]);
        }, 500)
        await Promise.all(ps)
        jumpClosePage = false
      }

      state.openedTabs.splice(i, 1)

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
      let manualCloseArr = []
      let currentTabIndex = data.tab_id || state.currentTabIndex
      state.openedTabs = state.openedTabs.filter((item) => {
        if (item.hasCloseEvent) manualCloseArr.push(item)
        return (
          item.tab_id === state.homeTab.tab_id ||
          item.tab_id === currentTabIndex ||
          item.hasCloseEvent
        );
      });

      if (manualCloseArr.length) {
        const Close = async (i) => {
          if (i >= manualCloseArr.length) return
          await store.dispatch("CloseTab", manualCloseArr[i].tab_id)
          setTimeout(() => {
            if (state.openedTabs.find(f => f.tab_id === manualCloseArr[i].tab_id)) return
            Close(i + 1)
          })
        }
        Close(0)
        return
      }

      store.commit("SetCurrentTabIndex", currentTabIndex);
    },
    // 关闭所有 tab
    async CloseAllTabs(state) {
      // state.openedTabs.length = 1;
      let manualCloseArr = []
      state.openedTabs = state.openedTabs.filter((item) => {
        if (item.hasCloseEvent) manualCloseArr.push(item)
        return (
          item.tab_id === state.homeTab.tab_id ||
          item.hasCloseEvent
        );
      });
      if (!state.openedTabs.length) state.openedTabs = [state.homeTab]

      if (manualCloseArr.length) {
        const Close = async (i) => {
          if (i >= manualCloseArr.length) return
          await store.dispatch("CloseTab", manualCloseArr[i].tab_id)
          setTimeout(() => {
            if (state.openedTabs.find(f => f.tab_id === manualCloseArr[i].tab_id)) return
            Close(i + 1)
          })
        }
        Close(0)
        return
      }

      store.commit("SetCurrentTabIndex", state.openedTabs[0]);
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
    OpenedTabPush ({ commit }, data) {
      commit("OpenedTabPush", data);
    },
    CloseTab ({ commit }, data) {
      commit("CloseTab", data);
    },
  },
};
