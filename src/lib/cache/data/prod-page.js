/* eslint-disable */
// import Store from '@/store'
import Vue from 'vue';
import Layout from "@/views/prod/layout";
import { getExtend } from "@/lib/fields/prod-extend.js";
export default function (Cache) {
  let pageCache = {}
  let dataCache = new Cache('/api/support/getConfigure')
  let mergeExtend = (pages) => {
    let arr = getExtend();
    arr = arr.map((m) => ({ part: m.components }));
    if (!arr.length) return pages;
    let i = pages.findIndex((p) => p.title_en === "Logistics Info");
    if (i < 0) i = pages.length > 2 ? 2 : pages.length;
    let l = arr.length;
    let l1 = Math.ceil(l / 2);
    let parts = [];
    if (l > 1) {
      parts = [
        [
          { span: "12", parts: arr.slice(0, l1) },
          { span: "12", parts: arr.slice(l1, l) },
        ],
      ];
    } else parts = [[arr[0]]];
    pages.splice(i, 0, {
      title: "自定义属性",
      title_en: "Custom Properties",
      parts,
    });
  }

  let handelPart = (f) => {
    // 自定义属性
    if (/^extend_/.test(f.part)) {
      f.x_natureid = f.part.replace("extend_", "")
      f.x_part = 'extend-nature'
    }
    if (f.part === 'easy-code') f.x_part = 'original-item-no'
    f.x_part = Vue.prototype.$h.snake2Camel(f.x_part || f.part)
  }

  dataCache.fnPretty = function ({field, billType, instance}) {
    let datas = this.preDatas
    let pages = datas[field]
    if (!pages) {
      pages = Layout(instance)[billType] || []
      mergeExtend(pages)
    }
    pages = Vue.prototype.$h.cloneDeep(pages)
    let rst = pages.map((f1, i1) => {
      f1.x_id = 'row-' + i1
      f1.bg_color = f1.bg_color || ''
      f1.parts = f1.parts.map((f2, i2) => {
        let f2f = f2
        if (Array.isArray(f2)) f2f = {parts: f2}
        f2f.x_id = f1.x_id + '-' + i2
        f2f.parts = f2f.parts.map((f3, i3) => {
          let f3f = f3
          if (!f3.parts) f3f = {parts: [f3], span: f3.span}
          f3f.x_id = f2f.x_id + '-' + i3
          f3f.span = +f3f.span || 24
          f3f.parts = f3f.parts.map((f4, i4) => {
            f3f.x_id = f3f.x_id + '-' + i4
            handelPart(f4)
            return f4
          })
          return f3f
        })
        return f2f
      })
      return f1
    })
    if (field) pageCache[field] = rst
    return rst
  }

  async function getProdPage (billType = 'pm', type = '', forced) {
    let field = billType.replace("-", "_") + "_prod_page" + type
    if (!pageCache[field] || forced) {
      forced = true
      let instance = window.vglobal.user.partner_com_id || window.vglobal.user.com_id
      await dataCache.getValue(forced, {instance, field, billType})
    }
    return {
      pages: pageCache[field],
      field
    }
  }
  async function getDfltProdPage (billType = 'pm') {
    dataCache.preDatas = {}
    let instance = window.vglobal.user.partner_com_id || window.vglobal.user.com_id
    return dataCache.fnPretty({billType, instance})
  }


  return {
    getProdPage,
    getDfltProdPage,
    // init: getSysIcons.bind(dataCache)
  }
}