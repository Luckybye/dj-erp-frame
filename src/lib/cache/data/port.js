/* eslint-disable */
export default function (Cache) {
  // t更改时，会刷新缓存；后台更改的港口数据，浏览器不会自动刷新，加上时间后缀才会刷新
  let url = '/api/direct?url=/api/b2b/querySysPorts'
  let dataCache = new Cache(url)
  dataCache.fnPretty = function () {
    const values = this.preDatas.sys_ports || []
    let datas = []
    for (let j = 0; j < values.length; j++) {
      let port = values[j]
      let v = {
        country_name: port.country_name_en,
        country_code: port.country_code,
        country_name_cn: port.country_name,
        port_name: port.port_name_en + '-' + port.port_code,
        port_name_cn: port.port_name + '-' + port.port_code
      }
      port.filter = port.port_name + '~' + port.port_name_en + '~' + '~'+ port.country_name + '~' + port.country_name_en + '~' + port.port_code
      Object.assign(port, v)
      datas.push(port)
    }
    datas.sort((a, b) => {
      if (b.port_name > a.port_name) return -1
      return 1
    })
    this.datas = datas
  }

  function getAllHarbour (forced) {
    return dataCache.getValue(forced).then(function (v) {
      return v
    })
  }


  return {
    getAllHarbour,
    init: dataCache.getValue.bind(dataCache)
  }
}