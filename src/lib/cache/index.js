/* eslint-disable */
import Vue from 'vue'

// 缓存接口，防止一瞬间多次请求
let promiseCache = new Map()
class Cache {
  constructor(url) {
    this.url = url
  }

  datas = null

  preDatas = null

  fnPretty = null

  etag = null

  cacheDate = null

  setRaw (raw) {
    this.cacheDate = new Date(Date.now() - 10000)
    this.preDatas = JSON.parse(JSON.stringify(raw))
  }

  async getValue(force, para) {
    let CacheKey = this.url + JSON.stringify(para || {})
    if (force || (!this.datas && !this.preDatas)) {
      try {
        let ps = promiseCache.get(CacheKey)
        if (!ps) {
          ps = Vue.prototype.$axios(this.url, {
            params: para
          }, {loading: false, warning: false, ...para})
          promiseCache.set(CacheKey, ps)
        }
        let res = await ps
        this.preDatas = res.data
        this.cacheDate = new Date(Date.now() - 10000)
        this.etag = (res.headers || {}).etag
        // console.log(this.etag, 'this.etagthis.etagthis.etag', this.preDatas)
        setTimeout(() => {
          promiseCache.delete(CacheKey)
        }, 3000)
      } catch (error) {
        promiseCache.delete(CacheKey)
        throw error
      }
      this.fnPretty && this.fnPretty(para)
    }
    return this.datas || this.preDatas
  }

  setEtag (result) {
    const self = this
    result && result.x_etag && (this.etag = result.x_etag)
  }
}

let CacheMap = Object.create(null)
let InitArray = []


let context = require.context('./data/', false, /.*\.js$/)
context.keys().forEach(key => {
  let map = {...context(key).default(Cache)}
  map.init && InitArray.push(map.init) && delete map.init
  CacheMap = {...CacheMap, ...map}
})

CacheMap.load = function () {
  Promise.all(InitArray.map(f => f()))
}

Vue.prototype.$cache = CacheMap

export default CacheMap