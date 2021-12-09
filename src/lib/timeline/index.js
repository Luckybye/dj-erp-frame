let context = require.context('./', false, /[^index]*\.js$/)
let datasMap = context.keys().reduce((pre, key) => {
  let obj = {...context(key).default}
  obj.line_key = obj.key + '_timeline'
  pre[obj.key] = obj
  return pre
}, {})
export default datasMap