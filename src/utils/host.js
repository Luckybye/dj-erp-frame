import Vue from 'vue'
export let fairHostMap = {
  '5d06500c76ce550363dc2319': 'http://test.merit-link.com/fair.html',
  '5d064fc56eb7c844cfdc2310': 'https://eu.merit-link.com',
  0: 'http://test.merit-link.com/fair.html'
}

export let erpHostMap = {
  localhost: 'https://djtest.wokelink.com',
  '192.168.3.12': 'http://localhost:8080',
  'saas.in-ideal.com': 'https://djtest.wokelink.com',
  'seller.merit-link.com': 'https://i.wokelink.com'
}

Object.defineProperties(Vue.prototype, {
  $getHost: {
    get() {
      let url = window.location.origin
      let pro = window.location.protocol
      if (/localhost|127.0.0.1/.test(url)) url = pro + '//saas.in-ideal.com'
      return url
    }
  }
})