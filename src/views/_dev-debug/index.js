/* eslint-disable */
function snake2Camel (str, capLower) {
  let s = str.replace(/[-_](\w)/g, function (x) {
    return x.slice(1).toUpperCase()
  })
  s = s.replace(/^\w/, function (x) {
    return capLower ? x.toLowerCase() : x.toUpperCase()
  })
  return s
}
let layout = require.context('./', false, /([a-zA-Z\-_0-9]+)\.vue$/)
export default layout.keys().map(key => {
  let fileName = key.match(/([a-zA-Z\-_0-9]+)\.vue$/i)[1]
  fileName = snake2Camel(fileName)
  return {
    fileName,
    default: layout(key).default
  }
}).filter(f => !/^Del/.test(f.fileName))