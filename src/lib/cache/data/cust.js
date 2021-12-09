/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/crm/custComCache?fresh=1')
  function mergeCust (lastV,newV) {
    if (!newV) return lastV
    if (!newV.cust_users.length) return lastV

    if (newV.cover) {
      dataCache.setRaw(newV)
      return newV
    }

    let users = []
    let lastUsersMap = lastV.cust_users._object('cust_id')
    let nusers = newV.cust_users||[]
    for(let i =0 ;i<nusers.length;i++){
      let item = nusers[i];
      let lastItem= lastUsersMap[item.cust_id]
      if (lastItem) {
        lastUsersMap[item.cust_id] = item
      } else {
        users.push(item)
      }
    }
    users = users.concat(Object.values(lastUsersMap))
  
    
    let coms = []
    let lastComMap = lastV.cust_companys._object('cust_com_id')
    let ncoms = newV.cust_companys||[]
    for(let i =0 ;i<ncoms.length;i++){
      let item = ncoms[i];
      let lastItem= lastComMap[item.cust_com_id]
      if (lastItem) {
        lastComMap[item.cust_com_id] = item
      } else {
        coms.push(item)
      }
    }
    coms = coms.concat(Object.values(lastComMap))
  
    lastV = {cust_users: users, cust_companys: coms}
    dataCache.setRaw(lastV)
    return lastV
  }
  
  
  async function getAllCustom (custType, forced) {
    custType = custType || {'2': 1, '4': 1, '8': 1, '16': 1, '32': 1, '64': 1, '128': 1}
    //  //'2客户 4供应商 8快递物流 16检测机构 32货运代理 64政府服务 128银行'
  //  //{'2': 1, '4': 1, '8': 1, '16': 1, '32': 1, '64': 1, '128': 1}
    //临时处理一下cust_type = 9999的情况
    if (custType['9999']) {
      custType = { '8': 1, '16': 1, '32': 1, '64': 1, '128': 1}
    }
    let ps = []
    ps.push(dataCache.getValue(forced))
    if (!forced && dataCache.cacheDate) {
      let url = '/api/crm/custComCache?since_date='+ dataCache.cacheDate.toISOString()
      dataCache.etag && (url = url + '&etag=' + dataCache.etag)
      let pMore = new Cache(url)
      ps.push(pMore.getValue())
    }
    let [lastV, newV] = await Promise.all(ps)
    dataCache.setEtag(newV)
    let v = mergeCust(lastV,newV)
    let companys = {}
    let users = v.cust_users||[]
    let comMap = (v.cust_companys||[])._object('cust_com_id')
    for(let i=0;i<users.length;i++){
      let item = users[i];
      let comm = comMap[item.cust_com_id] || {}
      if (!custType[item.cust_type]) continue
      if (!companys[item.cust_com_id]) {
        companys[item.cust_com_id] = {
          ...comm,
          node_type: 'cust_company',
          children: [],
          id: item.cust_com_id,
          text: comm.cust_no + '-' + (comm.com_name || '--') + (comm.id_code ? ('-' + comm.id_code) : ''),
          com_name: comm.com_name || '--',
          parent_id: '',
          cust_com_id: item.cust_com_id,
          cust_type: item.cust_type,
          cust_no: comm.cust_no,
          is_default: item.is_default || 'no',
          com_nick: comm.com_nick,
          id_code: comm.id_code,
          filter: comm.cust_no + '~' + comm.com_name + '~' + comm.com_nick + '~' + comm.id_code,
        }
      }
      item.node_type = 'cust_user'
      // item.children = []
      item.id = item.cust_id
      item.text = item.user_name
      item.parent_id = item.cust_com_id
      item.filter = companys[item.cust_com_id].filter + '~' + item.user_name + '~' + item.contact_no + '~' + item.user_mail + '~' + item.user_phone
      item.disabled = item.busi_status === 'stopped'
      companys[item.cust_com_id].children.push(item)
    }
    return Object.values(companys)
  }

  function getAllBuyer (forced) {
    return getAllCustom({'2': 1}, forced)
  }
  function getAllApplier (forced) {
    return getAllCustom({'4': 1}, forced)
  }
  function getAllForwarder (forced) {
    return getAllCustom({'32': 1}, forced)
  }
  function getAllLogisticsCom(forced) {
    return getAllCustom({ '256': 1 }, forced)
  }


  return {
    getAllCustom,
    getAllBuyer,
    getAllApplier,
    getAllForwarder,
    getAllLogisticsCom,
    // init: dataCache.getValue.bind(dataCache)
  }
}