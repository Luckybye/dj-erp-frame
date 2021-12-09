import Vue from 'vue'
let extend = []
let natureMap = {}
let prodMap = {}
let extendApp = []
let extendExcel = []

let querySysNature = async (forced) => {
  // const xhr = new XMLHttpRequest()
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === 4) {
  //     let data = JSON.parse(xhr.responseText).sys_natures || []
  //     handle(data)
  //   }
  // }
  // xhr.open('get', '/api/system/querySysNature')
  // xhr.send()
  let d = await Vue.prototype.$cache.getAllNatures(forced)
  handle(d)
}

let handle = (data) => {
  extend = data.map(m => {
    return {
      table: 'pi_nature',
      key: m.nature_id,
      value: '',
      text: m.nature_name || m.nature_name_en,
      rules: 'require',
      filter: 'pm,pu,qu,sc',
      components: 'extend_' + m.nature_id,
      noFmt: true,
      nature_kind: m.nature_kind
    }
  })
  extendExcel = data.reduce((pre, m) => {
    let n = {
      table: 'pi_nature',
      key: m.nature_id,
      value: '',
      text: m.nature_name,
      rules: 'require',
      filter: 'pm,pu,qu,sc',
      components: 'extend_' + m.nature_id,
      noFmt: true,
      nature_type: m.nature_type,
      isExtend: true,
      is_single: m.is_single,
      nature_name: m.nature_name,
      nature_name_en: m.nature_name_en,
      nature_kind: m.nature_kind
    }
    pre.push({...n})
    m.is_single === 'no' && pre.push({...n, key: m.nature_id + '_en', text: m.nature_name + '(' + m.nature_name_en + ')'})
    return pre
  }, [])
  extendApp = data.map(m => {
    return {
      en: m.nature_name_en,
      cn: m.nature_name,
      value: '',
      id: m.nature_id,
      key: '',
      component: 'extend_nature',
      filter: 'catalog,qu,pm,scan,new,pu,inq,web_detail,th',
      nature_kind: m.nature_kind
    }
  })
  natureMap = data._object('nature_id')
  prodMap = data.filter(f => f.nature_kind === 'prod')._object('nature_id')
}

export function initExtend () {
  querySysNature()
}
export function getExtend (type, kind) {
  kind = kind || 'prod'
  if (kind === 'all') return extend
  let arr = extend.filter(f => f.nature_kind === kind)
  if (type === 'pm') return arr.map(m => ({...m, table: 'prod_nature'}))
  return arr
}
export function getExtendExcel (type) {
  if (type === 'pm') return extendExcel.map(m => ({...m, table: 'prod_nature'}))
  return extendExcel
}
export function getExtendApp (type, kind) {
  kind = kind || 'prod'
  return extendApp.filter(f => f.filter.indexOf(type) >= 0 && (kind === 'all' || f.nature_kind === kind))
}
export function getNatures () {
  // console.log(natureMap, 'natureMapnatureMapnatureMap')
  return natureMap
}
export function getProdMap () {
  return prodMap
}
export function refreshExtend (data) {
  querySysNature(true)
}
