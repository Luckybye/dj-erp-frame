/* eslint-disable */
// import Store from '@/store'
import Vue from 'vue';
import {prod} from '@/lib/menus.js'
import {omit} from 'lodash';
export default function (Cache) {
  let dataCache = new Cache('/api/support/getConfigure')
  dataCache.fnPretty = function () {
    let fmt = {
      materials: [],
      prod_no_create_type: 'category',
      packings: [],
      qrcode: {show_field: 'prod_no', out_img: '', out_img_w: '100', out_img_h: '30', img_position: 'top', type: 1, page_width: 30, page_height: 30, options: {}, page_bg: '', in_img: '', in_img_w: '20', in_img_h: '20', text_color: ''},
      prodUnits: [],
      calc_cbm: false,
      hscode_set: 'all',
      tabs_show_mode: '',
      prod_show_mode: 'list',
    }
    let datas = (this.preDatas || {}).prod_setting || {}
    let tabs = Object.keys(prod).reduce((pre, k) => ({...pre, [k]: prod[k].dflt}), {})
    tabs = {...tabs, ...datas.tabs}
    this.datas = {...fmt, ...datas, tabs}
  }

  function getProdSetting (forced) {
    let para = {
      instance: window.vglobal.user.partner_com_id || window.vglobal.user.com_id,
      field: 'prod_setting'
    }
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  async function getProdTabs (type, forced) {
    let v = await getProdSetting(forced)
    let tab = prod[type]
    if (!tab || !v.tabs[type]) return []
    tab = tab.parts._object('id')
    return v.tabs[type].split(',').filter(k => tab[k]).map(k => tab[k].path)
  }

  async function getTabsMode (forced) {
    let v = await getProdSetting(forced)
    return v.tabs_show_mode
  }

  async function getMaterials (forced) {
    let v = await getProdSetting(forced)
    return v.materials
  }

  async function getPackings (forced) {
    let v = (await getProdSetting(forced)).packings
    if (!v || !v.length) v = Vue.prototype.$constant('purcharsePack')
    return v || []
  }

  async function getProdUnits (forced) {
    let v = (await getProdSetting(forced)).prodUnits
    if (!v || !v.length) v = Vue.prototype.$constant('pieceworkUnit')
    return v || []
  }

  async function getProdSetting2 (forced) {
    let v = await getProdSetting(forced)
    return omit(v, ['prodUnits', 'packings', 'materials', 'tabs', 'qrcode'])
  }

  return {
    getProdSetting,
    getProdSetting2,
    getProdTabs,
    getTabsMode,
    getMaterials,
    getPackings,
    getProdUnits
    // init: getSysIcons.bind(dataCache)
  }
}