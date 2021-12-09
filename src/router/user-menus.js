import store from '@/store'
export let dfltMenu = {
  menus: [],
  favor: [],
  homeTab: {
    title: '首页',
    tab_id: 'Home',
    path: 'Home',
    parts: [{ path: 'Home' }],
  },
  sysMenu: {
    title: '系统配置',
    icon_code: 'sysconfig',
    tab_id: 'SysSetting',
    sub: [
      { title: '系统图标', tab_id: 'SysIcons', path: 'SysIcons' },
    ],
  },
  comMenu: {
    title: '公司配置',
    title_en: 'Company Configure',
    icon_code: 'm-comconfig',
    tab_id: 'ComSetting',
    sub: [
      {
        title: '多语言设置',
        title_en: 'Language',
        tab_id: 'ComLanguageCompareList',
        path: 'LanguageCompareList',
        query: { isCom: true },
      },
    ],
  },
  devMenu: {
    title: '开发调试',
    title_en: '开发调试',
    icon_code: '',
    tab_id: 'dev-debug',
    sub: [],
  },
}

const devPages = require('@/views/_dev-debug').default
dfltMenu.devMenu.sub.push(...devPages.map(m => {
  return { title: m.default.options.title || m.fileName, tab_id: m.fileName, path: m.fileName }
}))

async function getUserMenus () {
  return {data: []}
}

getUserMenus().then(v => {
  let data = v.data
  // 根据用户权限加入系统菜单
  data.unshift(dfltMenu.sysMenu)
  data.unshift(dfltMenu.comMenu)
  data.unshift(dfltMenu.devMenu)
  store.dispatch('SetMenuType', v.menu_type || 'left')
  store.dispatch('SetUserMenus', data)
  store.dispatch('SetHomeTab', dfltMenu.homeTab)
  store.dispatch('ReShowHash')
})
