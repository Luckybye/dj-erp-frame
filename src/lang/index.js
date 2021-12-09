import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './cn.js'
import en from './en.js'
import envue from 'element-ui/lib/locale/lang/en'
import cnvue from 'element-ui/lib/locale/lang/zh-CN'
import {getProd} from '@/lib/setting'
import {get} from '@/utils/request'
import {debounce} from 'lodash'

const setLocalStorage = debounce((v) => {
  window.localStorage.setItem('dj_saas_language_pack', JSON.stringify(v))
}, 6000)

const mergeLocaleMessage = VueI18n.prototype.mergeLocaleMessage
VueI18n.prototype.mergeLocaleMessage = function (locale, localeMessage) {
  mergeLocaleMessage.call(this, locale, localeMessage || {})
  setLocalStorage(this.messages)
}

function getPageLang () {
  const pageLangFiles = require.context('./pages/', false, /\.js$/)
  return pageLangFiles.keys().reduce((pre, key) => {
    let f = key.match(/([a-zA-Z\-_0-9]+)\.js$/i)[1] || 'global'
    // console.log(f, pageLangFiles(key).en, 666666666)
    let file = pageLangFiles(key)
    pre.en[f] = file.en
    pre.cn[f] = file.cn
    pre.cn._file[f] = (file.filename || {}).cn || f
    pre.en._file[f] = (file.filename || {}).en || f
    return pre
  }, {en: {_file: {}}, cn: {_file: {}}})
}

function getItemLang () {
  const itemLangFiles = require.context('./items/', false, /\.js$/)
  return itemLangFiles.keys().reduce((pre, key) => {
    pre.en = {...pre.en, ...itemLangFiles(key).en}
    pre.cn = {...pre.cn, ...itemLangFiles(key).cn}
    return pre
  }, {en: {}, cn: {}})
}

// 系统默认翻译
function getDfltLang () {
  const pagesLangs = getPageLang()
  const itemLangs = getItemLang()
  return getProd().reduce((pre, val) => {
    if (!pre.en[val.id]) pre.en[val.id] = val.en
    if (!pre.cn[val.id]) pre.cn[val.id] = val.cn
    return pre
  }, {en: {...envue, ...en, ...itemLangs.en, ...pagesLangs.en}, cn: {...cnvue, ...cn, ...itemLangs.cn, ...pagesLangs.cn}})
}

let localStorageLang = window.localStorage.getItem('dj_saas_language_pack')
if (localStorageLang) localStorageLang = JSON.parse(localStorageLang)

export let messages = localStorageLang || getDfltLang()
export const i18n = new VueI18n({
  locale: window.localStorage.getItem('dj_language') || 'cn',
  messages
})

// 公司翻译
async function querySysLang () {
  let v = await get('/api/system/querySysLang', null, {loading: false, warning: false})

  return v.sys_langs.reduce((pre, val) => ({...pre, [val.lang_code]: {}}), {})
}

// async function querySysTranslation () {
//   try {
//     let v = await get('/api/system/querySysTranslation', null, {loading: false, warning: false})
//     return {dic: v.sys_dictionarys || [], trans: v.sys_translatios || []}
//   } catch (error) {
//     return {dic: [], trans: []}
//   }
// }
async function queryCmTranslation () {
  try {
    let v = await get('/api/crm/queryCmTranslation', null, {loading: false, warning: false})
    return {dic: v.cm_dictionarys || [], trans: v.cm_translations || []}
  } catch (error) {
    return {dic: [], trans: []}
  }
}
async function setMessages () {
  let ps = [
    querySysLang(),
    // querySysTranslation(),
    queryCmTranslation()
  ]
  let [langs, d3] = await Promise.all(ps)
  let trans = d3.trans
  for (let i = 0; i < trans.length; i++) {
    const m = trans[i];
    const {translation_key: k, translation_type: type, translation_val: val, lang_code: code} = m
    if (type && k) {
      langs[code][type] = langs[code][type] || {}
      langs[code][type][k] = val
    } else if (k) {
      langs[code][k] = val
    }
  }
  let dflt = {}
  if (localStorageLang) dflt = getDfltLang()
  Object.keys(langs).forEach(k => {
    i18n.mergeLocaleMessage(k, dflt[k] || {})
    i18n.mergeLocaleMessage(k, langs[k])
  })
}

setTimeout(() => {
  setMessages()
}, localStorageLang ? 5000 : 0)

Vue.prototype.$td = function (key, dflt) {
  return i18n.te(key) ? i18n.t(key) : dflt
}
Vue.prototype.$tt = (v, field) => {
  let lang = i18n.locale
  if (!v) return ''
  if (!field) return v
  let f = field + '_' + lang
  f = f.replace(/_cn$/, '')
  let f_en = field + '_en'
  return v[f] || v[f_en] || v[field]
}