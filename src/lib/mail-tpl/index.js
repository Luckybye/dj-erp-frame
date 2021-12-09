/* eslint-disable */
import {get} from '@/utils/request'
let mixins = {
  keyToHtml (newv) {
    return `
    <span contenteditable="false" style="user-select: all;">
      【${newv}】
    </span>
    `
  },
  htmlToKey (html) {
    let {variables} = this
    let div = document.createElement('div')
    div.innerHTML = html
    let vars = [...div.querySelectorAll('span[contenteditable=false]')]
    let textMap = Object.keys(variables).reduce((pre, k) => ({...pre, [variables[k].text]: k}), {})
    vars.forEach(el => {
      let text = (el.innerText.match(/【[^】]*】/)[0] || '').replace('【', '').replace('】', '').trim()
      // (el.innerText.match(/(?<=【)[^】]*(?=】)/)[0] || '').trim()
      let k = textMap[text]
      if (text && k) {
        let newNode = document.createElement('span')
        newNode.innerText = `%${k}%`
        console.log(div, newNode, el)
        // div.replaceChild(newNode, el)
        el.replaceWith(newNode)
      }
    })
    return div.innerHTML
  },
  hasKey (html, k) {
    if (k && html) return new RegExp(`%${k}%`).test(html)
    if (!k && html) return /%[a-zA-Z0-9_]+%/.test(html)
    return false
  },
  getHtml (html) {
    let {variables, keyToHtml, hasKey} = this
    if (!hasKey(html)) return
    Object.keys(variables).forEach(k => {
      let o = new RegExp(`%${k}%`, 'g')
      let o2 = new RegExp(`<span>%${k}%</span>`, 'g')
      let n = keyToHtml(variables[k].text)
      html = html.replace(o2, n).replace(o, n)
    })
    return html
  },
  async getTpl (vars = {}) {
    let {variables, html, mail_key: field, subject} = this
    let instance = window.vglobal.user.com_id
    field = 'mail_tpl_' + field
    let v = await get('/api/support/getConfigure', {instance, field})
    v = {subject, html, ...v[field]}
    // if (!hasKey(html)) return
    Object.keys(variables).forEach(k => {
      let o = new RegExp(`%${k}%`, 'g')
      let n = variables[k].get(vars) || ''
      v.html = v.html.replace(o, n)
      v.subject = v.subject.replace(o, n)
    })
    return v
  },
  getVariables () {
    let {variables, keyToHtml} = this
    return Object.keys(variables).map(k => {
      return keyToHtml(variables[k].text)
    })
  }
}

let context = require.context('./tpl/', false, /.*\.js$/)
let tpls = context.keys().reduce((pre, key) => {
  let k = key.match(/([a-zA-Z_0-9]+)\.js$/i)[1]
  let obj = {mail_key: k, ...mixins, ...context(key).default}
  // obj.html = obj.getHtml()
  return {...pre, [k]: obj}
}, {})
export default tpls