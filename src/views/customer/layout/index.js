/* eslint-disable */
let layout = require.context('./items', true, /([a-zA-Z\-_0-9]+)\.js$/)
layout = layout.keys().reduce((pre, key) => {
  let fileName = key.match(/([a-zA-Z\-_0-9]+)\.js$/i)[1] || 'cust'
  let v = layout(key).default
  if (!pre[fileName]) pre[fileName] = {}
  pre[fileName] = v
  return pre
}, {})
export default layout
