import Vue from "vue";
import { Constant as ComConstant } from "dj-model";
import { get } from "@/utils/request";
let constantSetting = {
  expressComs() {
    return [
      { en: "DHL", cn: "DHL" },
      { en: "EMS", cn: "EMS" },
      { en: "TNT", cn: "TNT" },
      { en: "UPS", cn: "UPS" },
      { en: "FEDEX", cn: "FEDEX" },
      { en: "SF", cn: "顺丰" },
      { en: "TACT", cn: "圆通" },
      { en: "STO", cn: "申通" },
    ];
  },
  containersType: function containersType() {
    return [
      { en: "40HC", v: 0 },
      { en: "40GP", v: 1 },
      { en: "20GP", v: 2 },
      { en: "LCL", v: 3 },
      { en: "N/A", v: 10 },
      { en: "45HC", v: 12 },
    ];
  },
  prodFeature: function prodFeature() {
    return [
      {
        text: "产品特性",
        text_en: "Feature",
        key: "prod_feature",
        type: "html",
      },
      {
        text: "卖点详情",
        text_en: "Selling point details",
        key: "selling_point",
        type: "html",
      },
      {
        text: "使用场景",
        text_en: "Scenes to be used",
        key: "use_scenes",
        type: "html",
      },
      {
        text: "售后政策",
        text_en: "After sales policy",
        key: "sales_policy",
        type: "html",
      },
      {
        text: "常见维修问题",
        text_en: "Common maintenance problems",
        key: "maintenance_problem",
        type: "html",
      },
      { text: "产品设计", text_en: "Design", key: "prod_design" },
      { text: "培训视频", text_en: "Training", key: "video" },
      { text: "说明书", text_en: "Manual", key: "manual" },
      { text: "认证", text_en: "Certification", key: "certification" },
      { text: "测试报告", text_en: "Testing", key: "testing" },
      { text: "包装稿", text_en: "Artwork", key: "artwork" },
    ];
  },
  pieceworkUnit: function pieceworkUnit() {
    return [
      { key: "PCS", text_en: "PCS", text: "个", tag: "公制" },
      { key: "SETS", text_en: "SETS", text: "套", tag: "公制" },
      {
        key: "PAIRS",
        text_en: "PAIRS",
        text: "双",
        tag: "公制",
      },
      { key: "DOZENS", text_en: "DOZENS", text: "打", tag: "公制" },
      { key: "CTNS", text_en: "CTNS", text: "箱", tag: "公制" },
      {
        key: "PKGS",
        text_en: "PKGS",
        text: "件",
        tag: "公制",
      },
      { key: "PLTS", text_en: "PLTS", text: "托", tag: "公制" },
      { key: "mm", text_en: "mm", text: "毫米", tag: "公制" },
      { key: "dm", text_en: "dm", text: "分米", tag: "公制" },
      {
        key: "cm",
        text_en: "cm",
        text: "厘米",
        tag: "公制",
      },
      { key: "m", text_en: "m", text: "米", tag: "公制" },
      { key: "in", text_en: "in", text: "英尺", tag: "英制" },
      { key: "ft", text: "英寸", tag: "英制" },
      {
        key: "dm³",
        text_en: "dm³",
        text: "立方分米",
        tag: "公制",
      },
      { key: "mm³", text_en: "mm³", text: "立方毫米", tag: "公制" },
      { key: "cm³", text_en: "cm³", text: "立方厘米", tag: "公制" },
      { key: "m³", text_en: "m³", text: "立方米", tag: "公制" },
      // {text_en: 'mg', text: '毫克', tag: '公制'},
      { key: "g", text_en: "g", text: "克", tag: "公制" },
      { key: "KGS", text_en: "KGS", text: "千克", tag: "公制" },
      { key: "MT", text_en: "MT", text: "公吨", tag: "公制" },
      {
        key: "lb",
        text_en: "lb",
        text: "磅",
        tag: "英制",
      },
      { key: "oz", text_en: "oz", text: "盎司", tag: "英制" },
      { key: "L", text_en: "L", text: "升", tag: "公制" },
      { key: "mL", text_en: "mL", text: "毫升", tag: "公制" },
      {
        key: "gal",
        text_en: "gal",
        text: "英制加仑",
        tag: "英制",
      },
      { key: "pt", text_en: "pt", text: "品脱", tag: "英制" },
    ];
  },
};

// 一些需要异步加载的常量
let AsyncConstantMap = {};
let AsyncLoad = function() {
  let obj = {
    tradeTerm: function(k) {
      let user = window.vglobal.user || {};
      get(
        "/api/support/getConfigure?field=trade_term_setting&instance=" +
          user.com_id
      ).then((res) => {
        res = res.trade_term_setting;
        if (res && res.length) AsyncConstantMap[k] = res.filter((f) => f.checked);
      });
    },
    currencyType: function(k) {
      let user = window.vglobal.user || {};
      get("/api/system/queryCurrency?com_id=" + user.com_id).then((res) => {
        res = res.currency;
        if (res && res.length) {
          AsyncConstantMap[k] = res.map((m) => ({
            ...m,
            en: m.key,
            cn: m.text,
            tag: m.text_en,
            value: m.key,
            rate: m.value,
          }));
        }
      });
    },
  };
  Object.keys(obj).forEach((k) => {
    obj[k](k);
  });
};

let constantMap = {};
let locale = window.localStorage.getItem('dj_language') || "cn";

Object.keys(constantSetting).forEach(function(key) {
  let item = constantSetting[key];
  Object.defineProperty(constantMap, key, {
    get: function get() {
      let values = item();
      let arr = [];
      values.forEach(function(v) {
        arr.push(
          Object.assign(v, {
            value: v.en || v.cn,
            txt: v[locale] || v.en,
          })
        );
      });
      return arr;
    },
  });
});

function constantAbbr(arr) {
  return arr.reduce(function(pre, c) {
    pre.push(c.value);
    return pre;
  }, []);
}

function paymentMixCond(paymentValue) {
  let paymentTypes = constantMap.paymentType;
  let MixConds = constantMap.paymentCutPointMixCond;
  let payType = paymentTypes.contains(function(item) {
    return item.value === paymentValue;
  });
  let MixCondSelectable = [];
  if (payType && Array.isArray(payType.selectable)) {
    MixConds.forEach(function(item) {
      let v = payType.selectable.contains(item.type);
      v && MixCondSelectable.push(item);
    });
  }
  return MixCondSelectable;
}

function paymentSupMixCond(paymentValue) {
  let paymentTypes = constantMap.paymentSupplierTime || [];
  let MixConds = constantMap.paymentSupplierType || [];
  let MixCondSelectable = [];
  if (!paymentValue || !paymentValue.txt) return MixCondSelectable;
  if (paymentValue.txt) paymentValue = paymentValue.txt;
  let t;
  paymentTypes.forEach(function(item) {
    if (item.txt === paymentValue) {
      t = item;
    }
  });
  if (t && Array.isArray(t.selectable)) {
    MixConds.forEach(function(item) {
      let v = t.selectable.contains(item.type);
      v && MixCondSelectable.push(item);
    });
  }
  return MixCondSelectable;
}

function filter(arr, f) {
  let n = [];
  arr.forEach(function(v) {
    if (f(v)) {
      n.push(v);
    }
  });
  return n;
}

function Constant(type, abbr) {
  if (AsyncConstantMap[type]) {
    if (abbr) return constantAbbr(AsyncConstantMap[type]);
    return AsyncConstantMap[type];
  }
  if (!constantMap[type]) {
    return ComConstant(type, abbr);
  }
  if (typeof abbr === "boolean") {
    return constantAbbr(constantMap[type]);
  } else if (typeof abbr === "function") {
    return filter(constantMap[type], abbr);
  } else {
    return constantMap[type] || [];
  }
}

Constant.paymentMixCond = paymentMixCond;
Constant.paymentSupMixCond = paymentSupMixCond;
Constant.asyncLoad = AsyncLoad;

Vue.prototype.$constant = Constant;
// export default Constant
