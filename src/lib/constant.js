import Vue from "vue";

import { Constant as ComConstant } from "dj-model";

let constantMap = {
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
  menusType() {
    return [
      { text: "左侧导航", text_en: "Left navigation", key: "left" },
      { text: "联动导航", text_en: "Linkage navigation", key: "linkage" },
    ];
  },
  comType() {
    return [
      { text: "VIP", text_en: "VIP", key: "vip" },
      { text: "Senior", text_en: "Senior", key: "senior" },
    ];
  },
  prodType: function prodType() {
    return [
      // { text_en: "All", key: "", text: "所有" },
      { text_en: "Product", key: "product", text: "产品/整机" },
      { text_en: "Sparepart", key: "sparepart", text: "配件" },
      { text_en: "Accessories", key: "accessories", text: "附件" },
      { text_en: "Handtool", key: "handtool", text: "手工具" },
      { text_en: "Materiel", key: "materiel", text: "物料" },
      { text_en: "Promotional", key: "promotional", text: "促销品" },
    ];
  },
  prodLevel: function prodLevel() {
    return [
      { text_en: "Civil", key: "Civil", text: "民用级" },
      { text_en: "Industrial", key: "Industrial", text: "工业级" },
      { text_en: "Professional", key: "Professional", text: "专业级" },
      {
        text_en: "Semi-professional",
        key: "Semi-professional",
        text: "半专业级",
      },
      { text_en: "Disabled", key: "Disabled", text: "淘汰产品" },
      { text_en: "Other", key: "Other", text: "其他" },
    ];
  },
  filterTime: function filterTime() {
    return [
      { text: "All Time Period", text_en: "All Time Period", key: "" },
      { text: "Last 7 days", text_en: "Last 7 days", key: "beforeOneWeek" },
      { text: "Last 30 days", text_en: "Last 30 days", key: "beforeOneMonth" },
      {
        text: "Past 3 months",
        text_en: "Past 3 months",
        key: "beforeThreeMonth",
      },
      {
        text: "Past 6 months",
        text_en: "Past 6 months",
        key: "beforeSixMonth",
      },
      {
        text: "Past 9 months",
        text_en: "Past 9 months",
        key: "beforeNineMonth",
      },
    ];
  },
  sourceType: function sourceType() {
    return [
      { text_en: "Company", text: "自营", key: "company" },
      { text_en: "Supplier", text: "代理", key: "supplier" },
      { text_en: "Customer", text: "OEM", key: "customer" },
    ];
  },
  tradeTerm: function tradeTerm() {
    return [
      { text_en: "FOB", text: "FOB", key: "FOB" },
      { text_en: "CIF", text: "CIF", key: "CIF" },
      { text_en: "FCA", text: "FCA", key: "FCA" },
      { text_en: "CFR", text: "CFR", key: "CFR" },
      { text_en: "CPT", text: "CPT", key: "CPT" },
      { text_en: "CIP", text: "CIP", key: "CIP" },
      { text_en: "DDP", text: "DDP", key: "DDP" },
      { text_en: "DDU", text: "DDU", key: "DDU" },
      { text_en: "EXW", text: "EXW", key: "EXW" },
      { text_en: "DAP", text: "DAP", key: "DAP" },
    ];
  },
  tranType: function tranType() {
    return [
      { text_en: "BY SEA", text: "海运", key: "BY SEA" },
      { text_en: "BY AIR", text: "空运", key: "BY AIR" },
      { text_en: "BY TRUCK", text: "公路运输", key: "BY TRUCK" },
      { text_en: "BY TRAIN", text: "铁路运输", key: "BY TRAIN" },
    ];
  },
  purcharsePack: function purcharsePack() {
    return [
      { en: "Colorbox", cn: "彩盒" },
      { en: "Blistercard", cn: "吸塑卡" },
      {
        en: "Doubleblister",
        cn: "双吸塑",
      },
      { en: "Whitebox with colorlable", cn: "白盒+彩标" },
      {
        en: "Brownbox with colorlable",
        cn: "棕盒+彩标",
      },
      { en: "Pvc tube with lable", cn: "PVC桶" },
      { en: "Pvcbox with lable", cn: "PVC盒" },
      {
        en: "Pvc sleeve",
        cn: "PVC套",
      },
      { en: "Polybag with header", cn: "卡头+OPP袋(吊卡)" },
      { en: "Hangtag", cn: "吊牌" },
      {
        en: "Polybag",
        cn: "塑料袋",
      },
      { en: "Loose packing", cn: "散装" },
      { en: "Whitebox", cn: "白盒" },
      { en: "Brownbox", cn: "棕盒" },
      {
        en: "Displaybox",
        cn: "展示盒",
      },
      { en: "Tie card", cn: "绑卡" },
      { en: "Window box", cn: "开窗彩盒" },
      { en: "Opp bag", cn: "opp袋" },
      {
        en: "Color sleeve",
        cn: "绕卡",
      },
      { en: "Mail box", cn: "中性邮购盒" },
      { en: "Pvc box with insert card", cn: "PVC盒子＋衬卡" },
      {
        en: "Sticker",
        cn: "彩贴",
      },
      { en: "Pvc lid with paper cover", cn: "PVC盖子＋纸托" },
      { en: "Shrink", cn: "热收缩" },
      {
        en: "Shrinking with sticker",
        cn: "热收缩＋不干胶",
      },
      { en: "Shrinking with color label", cn: "彩标＋POF收缩包装" },
      {
        en: "Color label",
        cn: "彩卡",
      },
      { en: "hangtag and carry bag", cn: "吊卡＋手提袋" },
      {
        en: "stacking",
        cn: "堆叠包装",
      },
      {
        en: "Brown Box  with color label＋stack",
        cn: "带彩贴的棕箱＋堆叠包装",
      },
      { en: "SLEEVE CARD", cn: "围卡" },
    ];
  },
  pieceworkUnit: function pieceworkUnit() {
    return [
      { en: "PCS", cn: "个", tag: "公制" },
      { en: "SETS", cn: "套", tag: "公制" },
      {
        en: "PAIRS",
        cn: "双",
        tag: "公制",
      },
      { en: "DOZENS", cn: "打", tag: "公制" },
      { en: "CTNS", cn: "箱", tag: "公制" },
      {
        en: "PKGS",
        cn: "件",
        tag: "公制",
      },
      { en: "PLTS", cn: "托", tag: "公制" },
      { en: "mm", cn: "毫米", tag: "公制" },
      { en: "dm", cn: "分米", tag: "公制" },
      {
        en: "cm",
        cn: "厘米",
        tag: "公制",
      },
      { en: "m", cn: "米", tag: "公制" },
      { en: "in", cn: "英尺", tag: "英制" },
      { en: "ft", cn: "英寸", tag: "英制" },
      {
        en: "dm³",
        cn: "立方分米",
        tag: "公制",
      },
      { en: "mm³", cn: "立方毫米", tag: "公制" },
      { en: "cm³", cn: "立方厘米", tag: "公制" },
      { en: "m³", cn: "立方米", tag: "公制" },
      // {en: 'mg', cn: '毫克', tag: '公制'},
      { en: "g", cn: "克", tag: "公制" },
      { en: "KGS", cn: "千克", tag: "公制" },
      { en: "MT", cn: "公吨", tag: "公制" },
      {
        en: "lb",
        cn: "磅",
        tag: "英制",
      },
      { en: "oz", cn: "盎司", tag: "英制" },
      { en: "L", cn: "升", tag: "公制" },
      { en: "mL", cn: "毫升", tag: "公制" },
      {
        en: "gal",
        cn: "英制加仑",
        tag: "英制",
      },
      { en: "pt", cn: "品脱", tag: "英制" },
    ];
  },
  cloudType: function cloudType() {
    return [
      { text_en: "Market Research", text: "市场调研", key: "market_research" },
      { text_en: "Catalog", text: "样册", key: "catalog" },
      { text_en: "Factory", text: "工厂", key: "factory" },
    ];
  },
};

function Constant(k, ...arg) {
  let fun = constantMap[k];
  if (fun) return fun();
  return ComConstant(k, ...arg) || [];
}

Vue.prototype.$constant = Constant;

export default constantMap;
