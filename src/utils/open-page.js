import { Base64 } from "js-base64";
import Vue from 'vue'
// import {get} from './request'
// let token = ''
// async function createAuthToken () {
//   if (token) return token
//   let v = await get('/api/system/createAuthToken')
//   token = v.token
//   return token
// }

// const host = erpHostMap[location.hostname]
const openPage = async (v) => {
  // let token = await createAuthToken()
  v = window.encodeURIComponent(Base64.encode(JSON.stringify(v)))
  // console.log(host + '/saas.html?page=' + v + '&token=' + token)
  // window.open(host + '/saas.html?page=' + v + '&token=' + token, 'DjOldSaas')
  // if (window.opener && window.opener.name === 'DjOldSaas') {
  //   window.open('/saas.html?page=' + v, 'DjOldSaas')
  // }
  window.open('/saas.html?page=' + v, 'DjOldSaas')
}

Vue.prototype.$openPage = openPage