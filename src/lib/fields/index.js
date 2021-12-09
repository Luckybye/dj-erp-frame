import { getExtend, getExtendExcel } from "./prod-extend.js";
import {isPlainObject} from 'lodash';
const allFields = {
  prod: require("./prod.js").default,
  cust: require("./cust.js").default,
  sup: require("./sup.js").default,
  service: require("./service.js").default,
  pu: require("./pu.js").default,
  sc: require("./sc.js").default,
};
const extendfields = (filter) => {
  return {
    prod: [...getExtend(filter)],
  };
};
const prodType = {
  pm: { mql: "prod_info", mg: "prod_infos" },
  qu: { mql: "quotation_prod", mg: "pi_prods" },
  inq: { mql: "quotation_prod", mg: "pi_prods" },
};
const isArray = Array.isArray;

function getField(fields, filter) {
  // let comId = ((window.vglobal || {}).user || {}).com_id
  // let specialMap = [...(fields.special || [])]
  let commonMap = [...(fields.common || [])];
  if (filter) {
    let tableMap = prodType[filter];
    let isMg = (key) => /^[$]?mg_/.test(key);
    let filterFn = (arr) => {
      return arr.reduce((pre, f) => {
        if (!f.filter || f.filter.indexOf(filter) >= 0) {
          if (tableMap) {
            let table = tableMap.mql;
            if (isMg(f.key)) table = tableMap.mg;
            pre.push({ ...f, table });
          } else pre.push({ ...f });
        }
        return pre;
      }, []);
    };
    // specialMap = filterFn(specialMap)
    return filterFn(commonMap);
  }

  // if (comId) {
  //   specialMap = specialMap.filter(m => m.com_id === comId)._object('key')
  //   commonMap = commonMap._object('key')
  //   Object.assign(commonMap, specialMap)
  //   return Object.values(commonMap)
  // }
  return commonMap;
}

// type = prod cust sup service pu sc
// filter = pm pu sc
// format用
function getFmtFields(type, filter) {
  let fields = getField(allFields[type], filter);
  return fields.reduce((pre, item) => {
    if (isArray(item.value)) {
      pre[item.key] = [];
    } else if (item.type === "object" || isPlainObject(item.value)) {
      pre[item.key] = {...pre[item.key], ...item.fmt, ...Object._of(item.value, '')}
    } else pre[item.key] = item.value;
    return pre;
  }, {});
}

function getProdFields(type, filter) {
  let e = extendfields(filter)[type];
  let a = { ...allFields[type] };
  if (e) a.common = a.common.concat(e);
  let fields = getField(a, filter);
  return fields;
}

function getImportProdFields(filter) {
  let e = getExtendExcel(filter);
  let a = allFields.prod;
  let fields = getField(a, filter);
  if (e) fields = fields.concat(e);
  let arr = [];
  for (var i = 0; i < fields.length; i++) {
    let item = fields[i];
    if (typeof item.value === "object") {
      if (Array.isArray(item.value)) {
        if (item.value.length > 0) {
          for (let i in item.value[0]) {
            let o = {};
            o.key = "$" + item.key + "." + i;
            o.text = item.value[0][i];
            o.table = item.table;
            o.text && arr.push(o);
          }
        } else {
          arr.push(item);
        }
      } else {
        for (let i in item.value) {
          let o = {};
          o.key = item.key + "." + i;
          o.text = item.value[i];
          o.table = item.table;
          o.text && arr.push(o);
        }
      }
    } else if (item.text) {
      arr.push(item);
    }
  }
  return arr;
}

function getProdComponents(type, filter) {
  let e = extendfields(filter)[type];
  let a = { ...allFields[type] };
  if (e) a.common = a.common.concat(e);
  let fields = getField(a, filter);
  return fields.reduce((pre, item) => {
    if (item.components) {
      pre.push(item);
    }
    return pre;
  }, []);
}
function getComponents(type) {
  let a = { ...allFields[type] };
  return a.common.filter(item => item.components);
}
function getVerifyFields(type, filter) {
  let e = extendfields(filter)[type];
  let a = allFields[type];
  let fields = getField(a, filter);
  if (e) fields = fields.concat(e);
  let arr = [];
  let push = (item) => {
    arr.push({
      text: item.text,
      field: item.key,
      table: item.table,
      rules: item.rules,
    });
  };
  for (let i = 0; i < fields.length; i++) {
    let item = fields[i];
    if (!item.rules) continue;
    item.text && push(item);
    if (isPlainObject(item.value)) {
      Object.keys(item.value).forEach((m) => {
        item.value[m] &&
          push({
            ...item,
            key: item.key + "." + m,
            text: item.value[m],
          });
      });
    }
    if (isArray(item.value) && item.value[0] && isPlainObject(item.value[0])) {
      let v = item.value[0];
      Object.keys(v).forEach((m) => {
        v[m] &&
          push({
            ...item,
            key: "$" + item.key + "." + m,
            text: v[m],
          });
      });
    }
  }
  return arr;
}
function getBillCheckFields(type, filter) {
  let a = allFields[type];
  let fields = a.common.filter(f => f.bill_check && f.bill_check.indexOf(filter) >= 0);
  let arr = [];
  let push = (item) => {
    arr.push({
      text: item.text,
      field: item.key,
      table: item.table,
      rules: item.rules,
    });
  };
  for (let i = 0; i < fields.length; i++) {
    let item = fields[i];
    item.text && push(item);
  }
  return arr;
}
function getPmCheckFields(type) {
  let a = allFields[type];
  return a.common.filter(f => f.check).concat(a.check || [])
}
// function isPlainObject(obj) {
//   return Object.prototype.toString.call(obj) === "[object Object]";
// }

export default {
  getFmtFields,
  getVerifyFields,
  getProdComponents,
  getComponents,
  getProdFields,
  getImportProdFields,
  getBillCheckFields,
  getPmCheckFields
};
