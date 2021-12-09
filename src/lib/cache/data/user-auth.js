/* eslint-disable */
import Store from '@/store'
import {merge} from 'lodash';
// import Vue from 'vue';
export default function(Cache) {
  let dataCache = new Cache("/api/support/getConfigure");
  let fmt = {
    marketing_auth: { view: 'group' },
    prod_auth: {
      view: 'all',
      add: 'yes',
      edit: 'all',
      public: 'all',
      excel_import: 'yes',
      edit_sparepart: 'yes',
      view_public: 'yes',
      edit_public: 'yes',
    },
    cust_auth: { view: 'group', add: 'yes', edit: 'all', view_public: 'yes', edit_public: 'yes'},
    supplier_auth: { view: 'group', add: 'yes', edit: 'all', view_public: 'yes', edit_public: 'yes' },
    sc_auth: { view: 'group', add: 'yes', edit: 'all', edit_prod_price: 'yes' },
    order_auth: { view: 'group', add: 'yes', edit: 'all', edit_prod_price: 'yes' },
    shipping_auth: { view: 'group', add: 'yes', edit: 'all' },
    pu_auth: { view: 'group', add: 'yes', edit: 'all' },
    meeting_auth: { view: 'group', add: 'yes', edit: 'all', edit_prod_price: 'yes' },
    financial_auth: { add: 'no' },
    ar_auth: { view: 'group', add: 'yes', edit: 'all' },
    ap_auth: { view: 'group', add: 'yes', edit: 'all' },
  };
  dataCache.fnPretty = function() {
    let datas = this.preDatas || {};
    this.datas = merge(fmt, datas.user_config)
    Store.dispatch('SetUserAuth', this.datas)
  };

  function getUserAuth(user_id, forced) {
    let para = {
      instance: user_id || window.vglobal.user.user_id,
      field: "user_config",
    };
    return dataCache.getValue(forced, para).then((v) => {
      return v;
    });
  }

  return {
    getUserAuth,
    init: getUserAuth.bind(dataCache)
  };
}
