/* eslint-disable */
import axios from '../lib/axios'
import Axios from 'axios'
import Vue from 'vue'
import pullAll from './pull.js'
import { Message, Loading } from 'element-ui'
import {debounce} from 'lodash';

let AxiosCache = new Map()
let logs = []

let record = debounce(() => {
  let pre = JSON.parse(sessionStorage.getItem('dj_req_logs') || '[]')
  pre.unshift(...logs)
  if (pre.length > 500) pre = pre.slice(0, 500)
  sessionStorage.setItem('dj_req_logs', JSON.stringify(pre))
}, 2000)

function LOADING () {
  let loading
  this.options = {}
  this.open = () => {
    loading = Loading.service({
      lock: false,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.2)',
      ...this.options
    })
  }
  this.close = () => {
    loading && loading.close()
  }
}
let loadModel = new LOADING()

function tip (res) {
  Message({
    message: res.msg || res.message || res,
    type: 'error',
    duration: 5 * 1000,
    showClose: true,
  })
}

function http (method, direct) {
  const isRequest = !method
  method = method || 'get'

  // 参数是对象
  // 参数是url, data, opts
  // opts, 属性: warning是否开启错误提示; loading是否开启请求等待; cache是否开启接口缓存,1代表缓存1s,true代表一直缓存
  // 警告！！！，下面函数里面不要更改method
  return function (...para) {
    let loadInstance = loadModel
    if (typeof para[0] === 'object') {
      para = para[0]
    } else {
      para = {
        url: para[0],
        data: para[1] || '',
        method,
        ...para[2]
      }
    }
    para.method = para.method || 'get'
    // 去除x_开头数据
    let handlerData = eliminateX(para.data, isRequest)
    para.data = handlerData.data
    // method为空时，判断数据类型，自动匹配method
    if (handlerData.usePost) para.method = 'post'

    // 默认get加loading，post不加
    let opts = Object.assign({warning: true, loading: para.method === 'get'}, para)

    let CacheKey = para.url + JSON.stringify(para.data || {})
    if (AxiosCache.has(CacheKey) && opts.cache) return AxiosCache.get(CacheKey)
    let warning = opts.warning
    let loading = opts.loading
    if (loading) {
      if (typeof loading === 'object') loadInstance.options = loading
      loadInstance.open()
    }

    if (direct === 'direct') {
      para.data || (para.data = {})
      para.data.url = para.url
      para.url = '/api/direct'
    }
    if (para.method === 'get' && para.data && !para.params) {
      para.params = para.data
      para.data = ''
    }

    let p = new Promise(function (resolve, reject) {
      para.req_date = Date.now()
      para.no_record || logs.unshift(para)
      axios({
        ...para,
      }).then((res) => {
        loadInstance.close()
        // console.log(res, 555555)
        // 状态码
        if (typeof opts.cache === 'number') {
          setTimeout(() => {
            AxiosCache.delete(CacheKey, p)
          }, opts.cache * 1000);
        } else if (opts.cache) AxiosCache.delete(CacheKey, p)
        if (res.errcode === 0) {
          resolve(res)
        } else {
          warning && tip(res || {})
          reject(res)
          para.err = res.message
        }
        record()
      }).catch(err => {
        opts.cache && AxiosCache.delete(CacheKey, p)
        loadInstance.close()
        warning && tip(err || {})
        reject(err)
        para.err = err.message
        record()
      })
    })
    opts.cache && AxiosCache.set(CacheKey, p)
    return p
  }
}

export const jsonp = (url) => {
  if(!url){
      console.error('请传入一个url参数')
      return;
  }
  return new Promise((resolve,reject) => {
      window.jsonCallBack =(result) => {
        resolve(result)
      }
      var JSONP=document.createElement("script");
      JSONP.type="text/javascript";
      JSONP.src=`${url}&callback=jsonCallBack`;
      document.getElementsByTagName("head")[0].appendChild(JSONP);
      setTimeout(() => {
          document.getElementsByTagName("head")[0].removeChild(JSONP)
      },500)
  })
} 


Vue.prototype.$axios = (...para) => {
  let loading = false
  let warning = false
  if (typeof para[0] === 'object') {
    loading = para[0].loading
    warning = para[0].warning
  } else if (para[2]) {
    loading = para[2].loading
    warning = para[2].warning
  }
  if (loading) loadModel.open()
  return Axios(...para).then((d) => {
    if (loading) loadModel.close()
    return d
  }).catch((err) => {
    if (loading) loadModel.close()
    warning && tip(err || {})
  })
}
Vue.prototype.$request = http()
Vue.prototype.$get = http('get')
Vue.prototype.$post = http('post')
Vue.prototype.$put = http('put')
Vue.prototype.$delete = http('delete')

Vue.prototype.$request2 = http('', 'direct')
Vue.prototype.$get2 = http('get', 'direct')
Vue.prototype.$post2 = http('post', 'direct')
Vue.prototype.$put2 = http('put', 'direct')
Vue.prototype.$delete2 = http('delete', 'direct')

export let request = http()
export let get = http('get')
export let post = http('post')
export let put = http('put')

export let request2 = http('', 'direct')
export let get2 = http('get', 'direct')
export let post2 = http('post', 'direct')
export let put2 = http('put', 'direct')
// export let delete = http('delete')

function pull () {
  let pullMap = {}
  Object.keys(pullAll).forEach((key) => {
    let item = pullAll[key]
    let req = item.url2 ? request2 :request
    req = req.bind(this)
    let url = item.url2 || item.url
    let loading = !!item.loading
    pullMap[key] =(function (data, opts) {
      let method = item.method
      return req(url, data, {loading, method, ...opts}._trim())
    }).bind(this)
  })
  return pullMap
}

Vue.prototype.$pull = pull()
// Object.defineProperties(Vue.prototype, {
//   $pull: {
//     get () {
//       return pull.call(this)
//     }
//   }
// })

function getType (value) {
  return Object.prototype.toString.call(value)
}
function eliminateX (data, isRequest) {
  // 只去除对象第一层的x_开头数据
  let usePost = false
  if (data && getType(data) === '[object Object]') {
    let len = 0
    Object.keys(data).forEach(key => {
      if (/^x_/i.test(key)) {
        data[key] = undefined
      } else if (isRequest) {
        const strType = getType(data[key])
        len += (data[key] + '').length
        usePost = usePost || len > 512 || strType === '[object Object]' || strType === '[object Array]'
      }
    })
  }
  return {data, usePost}
}