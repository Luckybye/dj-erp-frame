/* eslint-disable */
import {request, get, post, put, request2, get2, post2, put2} from './request'
import Vue from 'vue'
export let api = {
	queryProdList (para, opt) {
		let url = "/api/business/queryProdsByType";
		let extend = {
			supplier_ids: 1,
			// prod_types: 1,
			prod_levels: 1,
			extend_tags: 1,
			prod_sorts: 1,
			brand_ids: 1,
			prod_countrys: 1,
			extend_natures: 1,
			create_date_start: 1,
			create_date_end: 1,
			update_date_start: 1,
			update_date_end: 1,
			price_start: 1,
			price_end: 1,
			pu_price_start: 1,
			pu_price_end: 1,
			is_spare: "1",
			is_bom: '1'
			// source_type: "1",
			// mall_priority: "1",
		}
		// if (!para.prod_types || para.prod_types.length === 0) delete para.type
		let isExtend = !!(para.is_extend || Object.keys(para).find(k => extend[k]))
		if (para.prod_types && para.prod_types.length === 1 && para.prod_types[0] === para.type && !isExtend) {
			delete para.prod_types
		}
		if (isExtend) {
			url = "/api/product/queryEsProds";
			delete para.type
			delete para.prod_type
			delete para.prod_sort
			delete para.is_extend
		}
		if (para.extend_tags && para.extend_tags.length) {
			para.extend_tags = para.extend_tags.map(m => (typeof m === 'string' ? {tag_id: m} : m))
		}
		if (para.extend_natures && para.extend_natures.length) {
			para.extend_natures = para.extend_natures.flatMap(m => {
				if (/single|check/.test(m.nature_type)) {
					let cns = m.option_name.split(';')
					let ens = m.option_name_en.split(';')
					let max = Math.max(cns.length, ens.length)
					if (max > 1) return Array._of(max, i => ({...m, option_name: cns[i], option_name_en: ens[i]}))
				}
				return m
			})
		}
		if (para.get_para) {
			delete para.get_para
			return {...para, url, isExtend}
		}
		return post(url, para, {loading: true, ...opt}).then((d) => {
			let prods = d.prods || d.prod_infos || []
			delete d.prods
			delete d.prod_infos
			return {...d, prods}
		})
	},
	getReport (para, opt) {
		request('/x/r.json', para, {loading: true, method: 'post', ...opt}).then(data => {
			if (!data.url) return data
			let {name, suffix = 'xlsx'} = opt
			let url = data.url.replace('json', suffix)
			if (name) {
				if (!name.includes(suffix)) name += ('.' + suffix)
				return Vue.prototype.$h.download(url, name)
			}
			return url
		})
	},
	async getConfigure2 (cfg_kind, instance) {
		let v = await get('/api/system/queryBusiCfg', { cfg_kind })
		return (v.busi_config || []).map(m => {
			let {cfg_code: key, cfg_value: text, cfg_value_en: text_en} = m
			return {key, text, text_en}
		})
	},
};

Vue.prototype.$api = api