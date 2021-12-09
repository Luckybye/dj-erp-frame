
import Mixins from './mixins.js'

function snake2Camel (str, capLower) {
  let s = str.replace(/[-_](\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
  s = s.replace(/^\w/, function (x) {
    return capLower ? x.toLowerCase() : x.toUpperCase()
  })
  return s
}

const contexts = require.context('./items/', true, /([a-zA-Z\-_0-9]+)\.vue$/)
const Components = contexts.keys().reduce((pre, key) => {
  let part = contexts(key).default
  part.mixins = (part.mixins || []).concat(Mixins)
  let fileName = key.match(/([a-zA-Z\-_0-9]+)\.vue$/i)[1] || 'a'
  fileName = snake2Camel(fileName)
  // console.log(fileName, 'fileNamefileNamefileName')
  pre[fileName] = part
  return pre
}, {})

export default Components
