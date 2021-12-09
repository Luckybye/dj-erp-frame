
/* eslint-disable */
export default function () {
  function getValue (field,instance, opt) {
    //field（必选）
    //指定配置的实例 instance 如果同意配置可不填
    //multi如果是返回数组，填写true
    if (!field) return this.$Promise.as(new Error('field is empty!'))
    var vv = {field}
    instance && (vv.instance = instance )

    // // 组织架构更改，兼容代码
    // if (field === 'base_curr') {
    //   vv.instance = this.$state('me').legal_id
    // } else if (field === 'base_curr_main') {
    //   vv.instance = instance
    //   vv.field = 'base_curr'
    // }

    return this.$get('/api/support/getConfigure', vv, opt)
  }

  function setValue (field, value, instance) {
    if (!field || !value) return Promise.resolve(new Error('field or value is empty!'))
    var vv = {field, value}
    instance && (vv.instance = instance)
    return this.$post('/api/support/setConfigure', vv, {loading: false})
  }
  return function () {
    let self = this
    return {
      getValue: getValue.bind(self),
      setValue: setValue.bind(self)
    }
  }
}
