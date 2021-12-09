import {get} from '@/utils/request'
import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/manage/queryMyCompanyLegal')

  dataCache.fnPretty = function () {
    let v = this.preDatas || {}
    let bankMap = (v.cm_company_banks || []).toGroup('legal_id')
    v.cm_company_legals.forEach((item) => {
      item.node_type = 'cm_company_legal'
      item.id = item.legal_id
      item.address = item.legal_address
      item.address_en = item.legal_address_en
      item.text = item.legal_name
      item.text_en = item.legal_name_en || item.legal_name
      item.filter = item.legal_name + ' / ' + item.legal_name_en
      item.banks = bankMap[item.legal_id] || []
      item.banks.forEach(m => {
        m.legal_address = item.legal_address
        m.legal_address_en = item.legal_address_en
        m.legal_name_en = item.legal_name_en
        m.legal_name = item.legal_name
      })
      // item.bank_id = (item.banks.find(f => f.is_default === 'yes') || {}).bank_id
    })
    this.datas = v.cm_company_legals
  }

  async function getComLegals (forced) {
    return await dataCache.getValue(forced)
  }

  async function getAllBanks (forced) {
    return dataCache.getValue(forced).then(() => {
      return dataCache.preDatas.cm_company_banks
    })
  }

  async function getMyBanks (user_id, forced) {
    user_id = user_id || Store.getters.me.user_id
    let [banks, userLegals] = await Promise.all([
      getAllBanks(),
      get('/api/crm/queryCmUserLegal', {user_id})
    ])
    userLegals = (userLegals.cm_user_legals || [])._object('legal_id')
    return banks.filter(f => userLegals[f.legal_id])
  }

  async function getMyCompanyLegal (user_id, forced) {
    let legals = (dataCache.preDatas || {}).my_legals
    if (legals) return legals
    user_id = user_id || Store.getters.me.user_id
    let [userLegals, allLegals] = await Promise.all([
      get('/api/crm/queryCmUserLegal', {user_id}),
      getComLegals(forced)
    ])
    userLegals = (userLegals.cm_user_legals || [])._object('legal_id')
    legals = allLegals.map(f => {
      f.x_disabled = !userLegals[f.legal_id]
      return f
    })
    dataCache.preDatas.my_legals = legals
    return legals
  }

  return {
    getComLegals,
    getMyCompanyLegal,
    getAllBanks,
    getMyBanks
    // init: dataCache.getValue.bind(dataCache)
  }
}