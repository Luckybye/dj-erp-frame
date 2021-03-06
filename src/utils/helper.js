/* eslint-disable */
import lodash from 'lodash'
import Vue from 'vue'
import CryptoJS from '../lib/tripledes'
import { fairHostMap, erpHostMap } from './host'
import Store from '@/store'
import { get, jsonp } from '@/utils/request'
import {formatJson, transitionJsonToString} from './format-json';
import MD5 from '@/lib/md5.js'

let { isPlainObject, isDate, isObject, isArray } = lodash

function copy(str) {
  const inputEl = document.createElement('input')
  inputEl.value = str
  document.body.appendChild(inputEl)
  inputEl.select()
  document.execCommand('Copy')
  document.body.removeChild(inputEl)
}

function creatParams(data) {
  let arr = []
  for (let key in data) {
    arr.push((key + '=' + data[key]).toString())
  }
  return '?' + arr.join('&')
}

// function getBlob (url) {
//   return new Promise(resolve => {
//     const xhr = new window.XMLHttpRequest()
//     xhr.open('GET', url, true)
//     xhr.responseType = 'blob'
//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         resolve(xhr.response)
//       }
//     }
//     xhr.send()
//   })
// }

function getBlob(url) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 304) {
        console.log(xhr, 'resresresresresresresresres')
        let res = xhr.response
        if (res.type === 'application/json') {
          let reader = new FileReader()
          reader.onload = e => {
            try {
              let v = JSON.parse(e.target.result)
              reject({ message: v.message || 'unknow error' })
            } catch (error) {
              reject(error)
            }
          }
          reader.readAsText(res)
        } else resolve(res)
      }
    }
    xhr.send()
  })
}

function getUrl(url) {
  return getBlob(url).then(blob => {
    return window.URL.createObjectURL(blob)
  })
}

function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    let link = document.createElement('a')
    let body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  }
}

function download(url, filename) {
  let tip = Vue.prototype.$message({
    message: '????????????' + filename,
    duration: 300000,
    showClose: true,
  })
  if (url.indexOf('/r.') >= 0 && url.indexOf('download=') < 0) {
    url = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'download=' +  filename
  }
  return getBlob(url)
    .then(blob => {
      saveAs(blob, filename)
      tip.close()
    })
    .catch(e => {
      tip.close()
      Vue.prototype.$message({ message: e.message, duration: 30000 })
      throw e
    })
}

function getQueryString(field, url) {
  // console.log(url, field)
  url = url || location.href
  let reg = new RegExp('(^|&)' + field + '=([^&]*)(&|$)')
  let result = ''
  if (!url) {
    url = window.location.search.substr(1)
  } else {
    url = url.replace(/.*\?/, '')
  }
  result = url.match(reg)
  // console.log(result, '11')
  if (result != null) return decodeURIComponent(result[2])
  return null
}

function getQueryString2(url) {
  // console.log(url, field)
  url = url || location.href
  return (url.split('?')[1] || '').split('&').map(m => m.split('=')).reduce((pre, val) => {
    pre[val[0]] = val[1]
    return pre
  }, {})
}
function isMobile() {
  let userAgentInfo = navigator.userAgent
  let Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ]
  let flag = false
  for (let i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) >= 0) {
      flag = true
      break
    }
  }
  return flag
}

// ?????????????????????????????? n ???????????????????????????????????? n ????????????????????????????????????
function debounce(fn, wait) {
  let timer = null;
  return function (...arg) {
    if (timer) {
      // ???????????????????????????????????? ??????????????? ??????????????????
      clearTimeout(timer);
      timer = null; // ??????timer ?????????????????????
    }
    // ????????????/???????????????
    timer = setTimeout(() => {
      fn.call(this, ...arg); // wait????????? ???????????? ???????????????debounce ??????????????????
    }, wait);
  };
}

//?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
function throttle(fn, gapTime) {
  let last = 0; // ?????????????????? ?????????????????????
  return function (...arg) {
    let nowTime = Date.now(); // ????????????
    // ????????????-????????????????????????????????????????????? ???????????????
    if (nowTime - last > gapTime) {
      fn.call(this, ...arg); // ...arr???fn?????????
      last = Date.now(); // ??????????????????????????????????????? ??????????????????
    }
  };
}

const cryptoJsKey = CryptoJS.enc.Utf8.parse('ds104fd8')
const cryptoJsIv = CryptoJS.enc.Utf8.parse('e17122d5')
const cryptoJsLogo = '---#dj#---'
CryptoJS.mode.ECB = (function() {
  let ECB = CryptoJS.lib.BlockCipherMode.extend()

  ECB.Encryptor = ECB.extend({
    processBlock: function(words, offset) {
      this._cipher.encryptBlock(words, offset)
    },
  })

  ECB.Decryptor = ECB.extend({
    processBlock: function(words, offset) {
      this._cipher.decryptBlock(words, offset)
    },
  })

  return ECB
})()
// ??????
function encrypt(message) {
  if (!message) return ''
  message = CryptoJS.enc.Utf8.parse(message)
  let encrypted = CryptoJS.DES.encrypt(message, cryptoJsKey, {
    iv: cryptoJsIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return cryptoJsLogo + encrypted.ciphertext.toString()
}
// ??????
function decrypt(message) {
  if (!message) return ''
  message = message.replace(cryptoJsLogo, '')
  message = CryptoJS.enc.Hex.parse(message)
  let decrypted = CryptoJS.DES.decrypt({ ciphertext: message }, cryptoJsKey, {
    iv: cryptoJsIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// console.log(decrypt('3b63f217487ffccd1554ac2849a4142b'), 'decryptdecrypt')

// function createWorker (f) {
//   return new Promise((resolve, reject) => {
//     function fun () {
//       let p = f instanceof Promise ? f : new Promise((res, rej) => {
//         try {
//           let a = f()
//           res(a)
//         } catch (error) {
//           rej(error)
//         }
//       })
//       return p().then(rst => {
//         self.postMessage(rst)
//       }).catch(err => self.postMessage(err, true))
//     }
//     var blob = new Blob(['(' + fun.toString() +')()'])
//     var url = window.URL.createObjectURL(blob)
//     var worker = new Worker(url)
//     worker.onmessage = function (d, err) {
//       worker.terminate()
//       if (err) return reject(d)
//       resolve(d)
//     }
//   })
// }

function asyncWorker(f) {
  return new Promise((resolve, reject) => {
    var blob = new Blob(['(' + f.toString() + ')()'])
    var url = window.URL.createObjectURL(blob)
    var worker = new Worker(url)
    worker.onmessage = function(d) {
      worker.terminate()
      resolve(d)
    }
  })
}

function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()'])
  var url = window.URL.createObjectURL(blob)
  var worker = new Worker(url)
  return worker
}

function diffObject(oldValue, newValue, field) {
  //field?????????????????????????????????????????????
  if (
    !oldValue ||
    !field ||
    !newValue[field] ||
    oldValue[field] !== newValue[field]
  ) {
    return newValue
  }
  let diffValue = {}
  diffValue[field] = oldValue[field]
  //??????????????? ?????? ???????????????????????????
  Object.keys(newValue).forEach(function(key) {
    if (key === field) return
    if (/^x_[\S]/i.test(key)) {
      return
    }
    let o = oldValue[key]
    let v = newValue[key]
    if (o === v) return
    if (!o && v) {
      if (v instanceof Date) {
        if (v.getTime()) {
          diffValue[key] = v
        }
      } else {
        diffValue[key] = v
      }
    } else if (typeof v === 'number' || typeof v === 'string') {
      if (o !== v) {
        if (o + '' !== v + '') {
          diffValue[key] = v
        }
      }
    } else if (isDate(v)) {
      console.log(o, '--------', v)
      new Date(o).getTime() === v.getTime() || (diffValue[key] = v)
    } else if (isPlainObject(v) || isArray(v)) {
      JSON.stringify(o) !== JSON.stringify(v) && (diffValue[key] = v)
    } else if (v === null) {
      diffValue[key] = v
    }
  })
  //?????????????????????
  return Object.keys(diffValue).length > 1 ? diffValue : undefined
}

function diffValue(oldValue, newValue, field) {
  if (!field) return newValue
  //???????????????oldValue,newValue???????????????????????????
  //newValue???????????????????????????oldValue
  var diffValue
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    diffValue = []
    let oldMap = {}
    let newMap = {}
    //??????????????????????????????????????????????????????????????????????????????
    oldValue.forEach(function(item) {
      item[field] && (oldMap[item[field]] = item)
    })
    newValue.forEach(function(item) {
      item[field] && (newMap[item[field]] = item)
      //??????????????????????????????
      item[field] || diffValue.push(item)
    })
    //???????????????????????????
    Object.keys(newMap).forEach(function(index) {
      let diff = diffObject(oldMap[index], newMap[index], field)
      diff && diffValue.push(diff)
    })
  } else if (
    isPlainObject(oldValue) &&
    isPlainObject(newValue) &&
    oldValue &&
    newValue
  ) {
    diffValue = diffObject(oldValue, newValue, field)
  } else {
    diffValue = newValue
  }
  return diffValue
}

function getFairHost(id) {
  id = id || Store.getters.me.com_id
  return fairHostMap[id] || fairHostMap[0]
}

async function getComId() {
  if (window.sell_com_id) return window.sell_com_id
  let host = getHost()
  let v = await get(
    '/api/system/querySysHost',
    { host_url: host },
    { cache: true }
  )
  window.sell_com_id = (v.host_url || {}).sell_com_id
  return window.sell_com_id
}

function getHost() {
  let { pathname, host } = location
  if (/127.0.0.1|localhost/.test(host)) {
    if (pathname === '/cust.html') host = 'cust.in-ideal.com'
    if (pathname === '/dealer.html') host = 'dealer.in-ideal.com'
    if (pathname === '/vendor.html') host = 'vendor.in-ideal.com'
  }
  return host
}
function getERPHost() {
  return location.origin
  // return erpHostMap[location.hostname]
}

function camel2Snake(str) {
  // return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  lodash.snakeCase(str).replace(/_/g, '-')
}

function translate(params = '') {
  if (!isObject(params)) params = { query: params }
  // if (!params.query) return Promise.as()
  let setting = {
    appid: '20170217000039322',
    secret_key: 'QfBVO3lZ_RM3jBIf8INj',
    salt: new Date().getTime().toString(),
    url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
  }
  params = {
    q: params.query,
    from: params.from || 'auto',
    to: params.to || 'auto',
    appid: setting.appid,
    salt: setting.salt,
    sign: MD5(
      (
        setting.appid +
        params.query +
        setting.salt +
        setting.secret_key
      ).toString()
    ),
  }
  return jsonp(setting.url + creatParams(params))
    .then(res => {
      if (res.error_msg) throw res.error_msg
      return res.trans_result || []
    })
    .catch(err => {
      this.$message(err)
    })
}

function clone2(v) {
  if (!v || typeof v === 'string') return v
  if (typeof v === 'object') JSON.parse(JSON.stringify(v))
  return lodash.clone(v)
}

function format(fmt, val) {
  //fmt  = JSON.parse(JSON.stringify(fmt))
  fmt = lodash.clone(fmt)
  if (!val) return fmt
  if (isObject(fmt) && isObject(val)) {
    Object.keys(fmt).forEach(function(key) {
      if (typeof val[key] === 'undefined') {
        val[key] = fmt[key]
      } else {
        if (!isPrimitive(val[key])) {
          format(fmt[key], val[key])
        } else {
          if (!isPrimitive(fmt[key])) {
            val[key] = fmt[key]
          }
        }
      }
    })
  }
  if (isArray(fmt) && isArray(val)) {
    if (!val.length) {
      val = fmt
    } else {
      val.forEach(function(item) {
        format(fmt[0], item)
      })
    }
  }
  return val
}

function _format(fmt, val) {
  if (Array.isArray(val)) {
    var arr = []
    val.forEach(function(item) {
      arr.push(format(fmt, lodash.clone(item)))
    })
    return arr
  } else {
    val = lodash.clone(val)
    return format(fmt, val)
  }
}

function isPrimitive(value) {
  if (value === undefined) return true
  if (value === null) return true
  var type = typeof value
  if (type === 'string') return true
  if (type === 'number') return true
  if (type === 'boolean') return true
  if (type === 'symbol') return true
  //???????????????????????????
  if (Object.prototype.toString.call(value) === '[object Date]') return true
}

// ???????????????????????????????????????????????????????????????????????????
function textToId(text) {
  return (text + '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase()
}

function getVideoDuration(v) {
  return new Promise(resolve => {
    let video = document.createElement('video')
    video.src = v.url
    video.style.display = 'none'
    document.body.appendChild(video)
    try {
      video.onloadedmetadata = e => {
        v.duration = video.duration
        document.body.removeChild(video)
        resolve(v.duration)
      }
    } catch (error) {
      resolve('')
    }
  })
}
export function createElement (tag = 'div', content = '', opt = {}) {
  return `<${tag} style="${opt.style || ''}" class="${opt.class || ''}">${content}</${tag}>`
}
function previewExcel (src) {
  let {origin} = location
  if (/localhost|127.0.0.1/.test(origin)) origin = 'https://djtest.wokelink.com'
  if (!/^http/.test(src)) src = origin + src
  return 'https://view.officeapps.live.com/op/view.aspx?src=' + src
}
function filterDeep (arr, field, cb, count) {
  if (!arr || !arr.length) return []
  if (typeof field === 'function') {
    cb = field
    field = 'children'
  }
  field = field || 'children'
  let fn = (array, n) => {
    if (!array || !array.length) return []
    let rst = []
    for (let i = 0; i < array.length; i++) {
      const f = array[i];
      if (n && rst.length >= n) break
      if (cb(f)) {
        const children = fn(f[field])
        rst.push({...f, children: children.length ? children : undefined})
      } else if (f[field] && f[field].length) {
        const children = fn(f[field])
        if (children.length) rst.push({...f, children})
      }
    }
    return rst
  }
  return fn(arr, count)
}
function forDeep (arr, field, cb) {
  if (!arr || !arr.length) return []
  if (typeof field === 'function') {
    cb = field
    field = 'children'
  }
  field = field || 'children'
  let fn = array => {
    if (!array || !array.length) return []
    array.forEach(f => {
      cb(f)
      if (f[field] && f[field].length) fn(f[field])
    })
  }
  fn(arr)
}
function snake2Camel (str, capLower) {
  let s = str.replace(/[-_](\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
  s = s.replace(/^\w/, function (x) {
    return capLower ? x.toLowerCase() : x.toUpperCase()
  })
  return s
}

// ????????????
function requestFullScreen(element, cb) {
  if (!element) return
  let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
  
  if (requestMethod) {
    requestMethod.call(element);
    setTimeout(() => {
      cb && cb(true)
      let listenFullScreenEvent = listenFullScreen(isFull => {
        if (!isFull) {
          listenFullScreenEvent.remove()
          cb && cb(false)
        }
      })
    });
  }
};

// ????????????
function exitFullScreen(cb) {
  let elem = document;
  if (elem.webkitCancelFullScreen) {
    elem.webkitCancelFullScreen();
  } else if (elem.mozCancelFullScreen) {
    elem.mozCancelFullScreen();
  } else if (elem.cancelFullScreen) {
    elem.cancelFullScreen();
  } else if (elem.exitFullScreen) {
    elem.exitFullScreen();
  } else {
  //????????????????????????API???????????????
  };
  setTimeout(() => {
    cb && cb()
  });
}
// ??????????????????
function listenFullScreen(cb) {
  let fun = () => {
    let isFull = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    // console.log(isFull, 'isFullisFullisFullisFullisFullisFull')
    cb(isFull)
  }
  document.addEventListener('fullscreenchange', fun)
  document.addEventListener('mozfullscreenchange', fun)
  document.addEventListener('webkitfullscreenchange', fun)
  document.addEventListener('msfullscreenchange', fun)
  return {
    remove () {
      document.removeEventListener('fullscreenchange', fun)
      document.removeEventListener('mozfullscreenchange', fun)
      document.removeEventListener('webkitfullscreenchange', fun)
      document.removeEventListener('msfullscreenchange', fun)
    }
  }
}


export function isImg (str) {
  return /\.(bmp|jpg|jpeg|png|tif|tiff|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|raw|WMF|webp|jfif|ico)$/i.test(str)
}

export function isOssFile (str) {
  return /\.oss-[\s\S]+\.aliyuncs.com/i.test(str)
}

export function setCookie (name, value, days = 30) {
  let exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export function getCookie (name) {
  let arr
  let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) return unescape(decodeURIComponent(arr[2])); else return null;
}

export function removeCookie (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  document.cookie = name + "=" + '' + ";expires=" + exp.toGMTString();
}

let helper = {
  ...lodash,
  ...{
    copy,
    creatParams,
    getBlob,
    getUrl,
    download,
    getQueryString,
    getQueryString2,
    isMobile,
    encrypt,
    decrypt,
    createWorker,
    diffValue,
    getFairHost,
    getHost,
    getERPHost,
    getComId,
    camel2Snake,
    translate,
    clone2,
    format,
    textToId,
    getVideoDuration,
    createElement,
    previewExcel,
    filterDeep,
    forDeep,
    formatJson,
    transitionJsonToString,
    snake2Camel,
    requestFullScreen,
    exitFullScreen,
    listenFullScreen,
    isImg,
    isOssFile
  },
}
Vue.prototype.$h = helper

export default helper
