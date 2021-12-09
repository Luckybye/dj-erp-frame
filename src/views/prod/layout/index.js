/* eslint-disable */
let layout = require.context('./items', true, /([a-zA-Z\-_0-9]+)\.js$/)
layout = layout.keys().reduce((pre, key) => {
  let fileName = key.match(/([a-zA-Z\-_0-9]+)\.js$/i)[1] || 'pm'
  let v = layout(key).default
  if (!pre[fileName]) pre[fileName] = {}
  pre[fileName][v.com_id || 'common'] = v
  return pre
}, {})

export default function (comId) {
  return Object.keys(layout).reduce((pre, key) => {
    pre[key] = layout[key][comId] || layout[key]['common']
    return pre
  }, {})
}
