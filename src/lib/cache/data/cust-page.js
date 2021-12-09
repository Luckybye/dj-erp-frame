/* eslint-disable */
// import Store from '@/store'
import Vue from 'vue';
import Layout from "@/views/customer/layout";
export default function (Cache) {
  let pageCache = {}
  let dataCache = new Cache('/api/support/getConfigure')
  let billTypeMap = {
    '2': 'cust',
    '4': 'sup',
    '9999': 'service'
  }
  dataCache.fnPretty = function ({field, billType}) {
    let datas = this.preDatas
    let pages = Vue.prototype.$h.cloneDeep(datas[field] || Layout[billType]) || []
    let fieldsMap = window._g.getComponents(billType)._object('id')
    let mapFn = (arr, level) => {
      arr.forEach((f, i) => {
        f.x_id = level + '-' + i
        if (!f.parts) {
          f.part = (fieldsMap[f.id] || {}).components || f.part
          if (f.id) f.x_path = billType + '.' + f.id
        } else mapFn(f.parts, f.x_id)
      })
    }
    mapFn(pages, 'row')
    if (field) pageCache[field] = pages
    return pages
  }

  async function getCustPage (custType = '2', type = '', forced) {
    let billType = billTypeMap[custType] || billTypeMap['9999']
    let field = billType.replace("-", "_") + "_web_page" + type
    if (!pageCache[field] || forced) {
      forced = true
      let instance = window.vglobal.user.partner_com_id || window.vglobal.user.com_id
      await dataCache.getValue(forced, {instance, field, billType})
    }
    return {
      pages: pageCache[field],
      field
    }
  }
  async function getDfltCustPage (custType = '2') {
    let billType = billTypeMap[custType] || billTypeMap['9999']
    dataCache.preDatas = {}
    let instance = window.vglobal.user.partner_com_id || window.vglobal.user.com_id
    return dataCache.fnPretty({billType, instance})
  }


  return {
    getCustPage,
    getDfltCustPage,
    // init: getSysIcons.bind(dataCache)
  }
}