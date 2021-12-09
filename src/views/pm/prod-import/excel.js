import Vue from 'vue'
let defalutRule = {
  CBM: '$mg_pkgs.cbm',
  'FOB 价格（USD）': 'fob_price',
  HS码: 'hs_code',
  交货期: 'delivery_day',
  产品中文名: 'prod_name',
  '产品分类（一级/二级/三级）': 'prod_sort',
  产品图片: 'main_pic',
  产品英文名: 'prod_name_en',
  产品货号: 'prod_no',
  价格: 'pu_price',
  价格币种: 'pu_currency',
  内盒装量: '$mg_pkgs.inner_pkg_pcs',
  包装名字: '$mg_pkgs.pkg_name',
  单位: 'prod_unit',
  工厂货号: 'supplier_no',
  '描述(中文)': 'mg_detail',
  '描述(英文)': 'mg_detail_en',
  数量: 'moq',
  整箱内盒数: '$mg_pkgs.outer_pkg_pcs',
  整箱净重: '$mg_pkgs.carton_nw',
  整箱毛重: '$mg_pkgs.carton_gw',
  '材质(中文)': 'prod_material',
  '材质(英文)': 'prod_material_en',
  '毛利率[%]': 'gross_rate',
  起运港: 'load_port',
  重量: 'net_weight',
  销售包装: 'sale_pkg',
}
// 扩展字段
let custProds = [
  {
    table: 'cust_prod',
    key: 'cust_prod_no',
    type: 'string',
    value: '',
    text: '客户货号',
  },
  {
    table: 'cust_prod',
    key: 'cust_prod_barcode',
    type: 'string',
    value: '',
    text: '客户条形码',
  },
  {
    table: 'cust_prod',
    key: 'cust_com_id',
    type: 'string',
    value: '',
    text: '客户',
  },
  {
    table: 'cust_prod',
    key: 'trade_term',
    type: 'string',
    value: '',
    text: '贸易条款',
  },
]
let gradePrices = [
  {
    key: 'grade.qty_1',
    type: 'number',
    value: '',
    text: '阶梯价1-数量',
  },
  {
    key: 'grade.price_1',
    type: 'number',
    value: '',
    text: '阶梯价1-价格',
  },
  {
    key: 'grade.qty_2',
    type: 'number',
    value: '',
    text: '阶梯价2-数量',
  },
  {
    key: 'grade.price_2',
    type: 'number',
    value: '',
    text: '阶梯价2-价格',
  },
  {
    key: 'grade.qty_3',
    type: 'number',
    value: '',
    text: '阶梯价3-数量',
  },
  {
    key: 'grade.price_3',
    type: 'number',
    value: '',
    text: '阶梯价3-价格',
  },
  {
    key: 'grade.price',
    type: 'number',
    value: '',
    text: '阶梯价末级-价格',
  },
]
export default {
  props: {},
  data() {
    return {
      titleDatas: [],
      datas: [],
      tempModel: {
        startIndex: 2,
        headIndex: 1,
        keyList: {},
        is_merge: false,
        merge_field: '',
      },
      getMaxTitleLength: 0,
      numberField: {},
    }
  },
  methods: {
    async getAllProdTypes() {
      let datas = await this.$api.getConfigure2("prodType")
      if (!datas || !datas.length) datas = await this.$constant("prodType")
      this.prodTypeMap = datas.reduce((pre, val) => {
        pre[(val.text_en + '').toLowerCase()] = val.key
        pre[(val.text + '').toLowerCase()] = val.key
        pre[(val.key + '').toLowerCase()] = val.key
        if (val.text.indexOf('/') >= 0) {
          val.text.split('/').forEach(m => {
            pre[m] = val.key
          })
        }
        return pre
      }, {})
    },
    selectProdType(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = this.prodTypeMap[d.text.trim().toLowerCase()]
        if (t) {
          Vue.set(d, 'value', t)
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该产品类型不存在')
          err.push(d.text + '-产品类型不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    async getProdLevel() {
      let datas = await this.$api.getConfigure2("prodLevel")
      if (!datas || !datas.length) datas = this.$constant('prodLevel')
      this.prodLevelMap = datas.reduce((pre, val) => {
        pre[val.text_en] = val.key
        pre[val.text] = val.key
        pre[val.key] = val.key
        return pre
      }, {})
    },
    selectProdLevel(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = this.prodLevelMap[d.text.trim()]
        if (t) {
          Vue.set(d, 'value', t)
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该产品等级不存在')
          err.push(d.text + '-产品等级不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    handlerCol(index, rowIndex) {
      let key = this.tempModel.keyList[index]
      let mess = ''
      switch (key) {
        case 'prod_sort':
          mess = this.selectSort(index, rowIndex)
          break
        // case 'net_weight_unit':
        //   // this.selectWeightUnit(index)
        //   break
        case 'brand_id':
          mess = this.selectBrands(index, rowIndex)
          break
        case 'main_pic':
          mess = this.judgeImg(index, rowIndex)
          break
        case 'hs_code':
          this.handlerSCI(index, rowIndex)
          break
        case 'prod_no':
          this.handlerSCI(index, rowIndex)
          break
        case 'cust_prod_no':
          this.handlerSCI(index, rowIndex)
          break
        case 'cust_prod_barcode':
          this.handlerSCI(index, rowIndex)
          break
        case 'supplier_id':
          mess = this.selectApplier(index, rowIndex)
          break
        case 'cust_com_id':
          mess = this.selectBuyer(index, rowIndex)
          break
        case 'owner_id':
          mess = this.selectStaff(index, rowIndex)
          break
        case 'type':
          mess = this.selectProdType(index, rowIndex)
          break
        case 'prod_level':
          mess = this.selectProdLevel(index, rowIndex)
          break
        case 'load_port':
          mess = this.selectPort(index, rowIndex)
          break
        case 'sale_pkg':
          mess = this.selectSalePacking(index, rowIndex)
          break
        case 'sale_pkg_en':
          mess = this.selectSalePacking(index, rowIndex)
          break
        case 'prod_unit':
          mess = this.selectProdUnit(index, rowIndex)
          break
        case 'currency':
          mess = this.selectCurrency(index, rowIndex)
          break
        case 'pu_currency':
          mess = this.selectCurrency(index, rowIndex)
          break
        case 'estimate_price_currency':
          mess = this.selectCurrency(index, rowIndex)
          break
        case 'sn_currency':
          mess = this.selectCurrency(index, rowIndex)
          break
        case 'price_rule':
          mess = this.selectPriceRule(index, rowIndex)
          break
        default:
          if (this.keyMap[key] && this.keyMap[key].isExtend) {
            this.handlerExtend(index, key, rowIndex)
          } else this.cleanError(index, key, rowIndex)
          break
      }
      return mess
    },
    handlerSCI(i, rowIndex) {
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) return
        let d = item.data[i] || {}
        if (d.text) d.text = (Number(d.text) || d.text) + ''
      })
    },
    handlerExtend(i, key, rowIndex) {
      if (rowIndex >= 0) return
      let err = []
      let m = this.keyMap[key]
      let isSingle = m.nature_type === 'single'
      let isCheck = m.nature_type === 'check'
      let p = this.$Promise.as()
      if (isSingle || isCheck) {
        p = this.$request('/api/system/queryNatureOption', {
          nature_id: key.replace(/_en$/, ''),
        })
      }
      return p.then(map => {
        let n = {
          nature_id: key.replace(/_en$/, ''),
          nature_name: m.nature_name,
          nature_name_en: m.nature_name_en,
          is_single: m.is_single,
          prod_type: 'pm',
        }
        if (map) {
          map = (map.sys_nature_option || []).reduce((pre, val) => {
            let nn = {
              ...n,
              option_name: val.option_name,
              option_name_en: val.option_name_en,
            }
            pre[val.option_name] = { ...nn }
            pre[val.option_name_en] = { ...nn }
            return pre
          }, {})
        }
        this.datas.forEach((item, index) => {
          if (index < this.tempModel.startIndex - 1) {
            item.data[i] && (item.data[i].error = '')
            return
          }
          let d = item.data[i] || {}
          if (!d.text) return
          if (isCheck) {
            let tt = d.text.split(/；|;/).map(a => a.trim())
            if (!map) {
              Vue.set(d, 'error', '该自定义属性没有可选项')
              err.push(n.nature_name + '-自定义属性没有可选项')
            }
            let ff = tt.filter(f => !map[f]).join(';')
            if (ff) {
              Vue.set(d, 'error', '该自定义属性可选项没有此项-' + ff)
              err.push(n.nature_name + '-自定义属性可选项没有此项-' + ff)
            } else {
              let r = tt.map(a => map[a])
              Vue.set(d, 'value', {
                ...n,
                option_name: r.map(a => a.option_name).join(';'),
                option_name_en: r.map(a => a.option_name_en).join(';'),
              })
              d.error = ''
            }
          } else if (isSingle) {
            let t = (d.text + '').trim()
            if (map && map[t]) {
              Vue.set(d, 'value', map[t])
              d.error = ''
            } else {
              Vue.set(d, 'error', '该自定义属性可选项没有此项')
              err.push(n.nature_name + '-自定义属性可选项没有此项-' + d.text)
            }
          } else {
            if (n.is_single === 'no') {
              if (/_en$/.test(key)) {
                Vue.set(d, 'value', { ...n, option_name_en: d.text })
              } else Vue.set(d, 'value', { ...n, option_name: d.text })
            } else {
              Vue.set(d, 'value', {
                ...n,
                option_name: d.text,
                option_name_en: d.text,
              })
            }
            d.error = ''
          }
        })
        return [...new Set(err)].join('<br>')
      })
    },
    judgeImg(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let img = item.data[i] || {}
        if (!img.text) return
        if (!this.isImgUrl(img.text)) {
          Vue.set(item.data[i], 'error', '不是图片链接')
          err.push(img.text + '-不是图片链接')
        } else img.error = ''
      })
      return [...new Set(err)].join('<br>')
    },
    getAllSorts() {
      this.$cache.getPreSort().then(s => {
        this.sortsMap = s.reduce((pre, val) => {
          pre[val.sort_code] = val.sort_id
          pre[val.sort_full_name] = val.sort_id
          pre[val.sort_full_name_en] = val.sort_id
          pre[val.sort_name] = val.sort_id
          pre[val.sort_name_en] = val.sort_id
          return pre
        }, {})
      })
    },
    selectBrands(i, rowIndex) {
      // console.log('selectBrandsselectBrandsselectBrandsselectBrands', this.brandsMap)
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let brand = ((item.data[i] || {}).text || '').trim()
        if (!brand) return
        if (this.brandsMap[brand]) {
          Vue.set(item.data[i], 'value', this.brandsMap[brand])
          item.data[i].error = ''
        } else {
          Vue.set(item.data[i], 'error', '该品牌不存在')
          err.push(brand + '-品牌不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getAllBrands() {
      this.$cache.getAllBrands().then(data => {
        this.brandsMap = data.reduce((pre, val) => {
          pre[val.brand_name] = val.brand_id
          pre[val.brand_name_en] = val.brand_id
          return pre
        }, {})
      })
    },
    selectSort(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let m = item.data[i] || {}
        let sort = (m.text + '').trim()
        if (!sort) return
        if (this.sortsMap[sort]) {
          Vue.set(m, 'value', this.sortsMap[sort])
          m.error = ''
        } else {
          Vue.set(m, 'error', '该分类不存在')
          err.push(sort + '-分类不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getAllApplier() {
      return this.$cache.getAllApplier().then(v => {
        this.suppliersMap = v.reduce((pre, val) => {
          pre[val.com_name] = val.cust_com_id
          pre[val.com_nink] = val.cust_com_id
          pre[val.cust_no] = val.cust_com_id
          return pre
        }, {})
      })
    },
    selectApplier(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = d.text.trim()
        if (this.suppliersMap[t]) {
          Vue.set(d, 'value', this.suppliersMap[t])
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该供应商不存在')
          err.push(d.text + '-供应商不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getAllBuyer() {
      return this.$cache.getAllBuyer().then(v => {
        this.buyersMap = v.reduce((pre, val) => {
          pre[val.com_name] = val.cust_com_id
          // pre[val.com_nink] = val.cust_com_id
          pre[val.cust_no] = val.cust_com_id
          return pre
        }, {})
      })
    },
    selectBuyer(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = d.text.trim()
        if (this.buyersMap[t]) {
          Vue.set(d, 'value', this.buyersMap[t])
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该客户不存在')
          err.push(d.text + '-客户不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getAllHarbour() {
      this.$cache.getAllHarbour().then(h => {
        this.portsMap = h.reduce((pre, val) => {
          pre[(val.name || '').toLowerCase()] = val.port_code
          pre[val.name_cn] = val.port_code
          pre[(val.port_code || '').toLowerCase()] = val.port_code
          return pre
        }, {})
      })
    },
    selectPort(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = d.text.trim().toLowerCase()
        if (this.portsMap[t]) {
          Vue.set(d, 'value', this.portsMap[t])
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该港口不存在')
          err.push(d.text + '-港口不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    cleanError(i, key, rowIndex) {
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        item.data[i] && Vue.set(item.data[i], 'error', '')
        if (checkAll && index < this.tempModel.startIndex - 1) return
        let d = item.data[i] || {}
        if (d.text && this.numberField[key]) d.text = (parseFloat(d.text) || '').toFixed(7) * 1 || ''
      })
    },
    getAllProdsFields() {
      this.titleDatas = window._g.getImportProdFields('pm').concat(custProds, gradePrices)
      this.getNumberField()
    },
    getNumberField() {
      let v = this.titleDatas.filter(f => f.type === 'number')._object('key')
      let extend = {
        '$mg_pkgs.carton_nw': 1,
        '$mg_pkgs.carton_gw': 1,
        '$mg_pkgs.carton_size_length': 1,
        '$mg_pkgs.carton_size_width': 1,
        '$mg_pkgs.carton_size_height': 1,
        '$mg_pkgs.inner_pkg_pcs': 1,
        '$mg_pkgs.outer_pkg_pcs': 1,
        '$mg_pkgs.cbm': 1,
        '$mg_pkgs.gp20': 1,
        '$mg_pkgs.gp40': 1,
        '$mg_pkgs.hc40': 1,
        '$mg_pkgs.pkg_size_length': 1,
        '$mg_pkgs.pkg_size_width': 1,
        'mg_prod_size.btm_diam': 1,
        'mg_prod_size.diam': 1,
        'mg_prod_size.height': 1,
        'mg_prod_size.length': 1,
        'mg_prod_size.top_diam': 1,
        'mg_prod_size.width': 1,
      }
      this.numberField = { ...v, ...extend }
    },
    async onSave() {
      let text = await this.doValidate()
      await this.$confirm(text || '确定导入？', this.$t('dialog_tip'), {
        confirmButtonText: '导入',
        cancelButtonText: '放弃',
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: true,
      })
      this.uploadProds()
    },
    onAdd() {
      this.$Promise
        .when([this.doValidate(), this.checkProdIsExit('add')])
        .then((text, { add, arr }) => {
          text = text + '<br>' + add
          this.$confirm(text, this.$t('dialog_tip'), {
            confirmButtonText: '全部导入',
            cancelButtonText: '存在不导入',
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
          }).then(() => {
            this.uploadProds()
          }).catch(() => {
            if (arr.length) {
              arr.forEach(j => {
                this.datas[j - 1] && (this.datas[j - 1].no_save = true)
              })
            }
          })
        })
    },
    onUpdate() {
      this.$Promise
        .when([this.doValidate(), this.checkProdIsExit('update')])
        .then((text, { update, noarr }) => {
          text = text + '<br>' + update
          this.$confirm(text, this.$t('dialog_tip'), {
            confirmButtonText: '全部更新',
            cancelButtonText: '不存在不更新',
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
          }).then(() => {
            this.uploadProds()
          }).catch(() => {
            if (noarr.length) {
              noarr.forEach(j => {
                this.datas[j - 1] && (this.datas[j - 1].no_save = true)
              })
            }
          })
        })
    },
    isImgUrl(string = '') {
      return (
        (string + '').match(/\.(jpeg|jpg|gif|png)$/) !== null ||
        /^http[s]?:/.test(string)
      )
    },
    doValidate(tip) {
      // store.dispatch('RE_INCREASE', 1)
      let message = ''
      let max = this.getMaxTitleLength
      let titleMap = (this.datas[this.tempModel.headIndex - 1] || {}).data || []
      let list = this.tempModel.keyList
      let ps = []
      for (var i = 0; i < max; i++) {
        if (!list[i]) {
          if (tip !== 'fast') {
            message +=
              '第' +
              (i + 1) +
              '列-' +
              titleMap[i].text +
              '-未指定字段，将省略<br>'
          }
        } else {
          let mess = this.handlerCol(i)
          if (mess && typeof mess === 'string') {
            message += mess + '<br>'
          } else if (mess && mess.then) {
            ps.push(mess.then(r => (message += r + '<br>')))
          }
          for (var j = i + 1; j < max; j++) {
            if (list[i] === list[j]) {
              message +=
                '第' +
                (i + 1) +
                '列-' +
                titleMap[i].text +
                '-和第' +
                (j + 1) +
                '列-' +
                titleMap[j].text +
                '-选用了相同的字段，请检查，确保一个字段对应一列<br>'
              break
            }
          }
        }
      }
      return this.$Promise.when(ps).then(() => {
        // store.dispatch('RE_INCREASE', -1)
        if (tip === 'tip') {
          return this.$confirm(message || '暂无错误数据', this.$t('dialog_tip'), {
            dangerouslyUseHTMLString: true,
          })
        }
        return message
      })
    },
    async uploadProds(id) {
      // let i = Math.max((this.tempModel.startIndex * 1 - 1) || 0, 0)
      for (let i = 0; i < this.datas.length; i++) {
        if (i < this.tempModel.startIndex - 1) continue
        const m = this.datas[i]
        for (let j = 0; j < m.data.length; j++) {
          const f = m.data[j]
          let key = this.tempModel.keyList[j]
          if (!f.error && key) {
            f.field = key
            this.handlerValue(key, f)
          }
        }
        // if (this.tempModel.type) m.data.push({field: 'type', text: this.tempModel.type})
      }
      this.saveKeyListatLocal && this.saveKeyListatLocal()

      let ws = await this.$ws.addEvent('/socket/setPmProd', this.onmessage)
      this.ws = ws
      this.$post(
        '/api/excel/setPmProd',
        {
          data: this.datas,
          mongo_id: id || this.payload.imp_id,
          import_rule: this.tempModel,
          ws
        },
        { loading: true }
      ).then(() => {
        // this.timedRefresh && this.timedRefresh()
        this.$message({
          type: 'info',
          message:
            '正在后台导入，你可以离开此页面，稍后可点‘查看’按钮查看导入结果',
        })
        this.isOver = false
      })
    },
    onmessage (d) {
      let row = this.datas[d.index]
      if (row) {
        this.$set(row, 'prod_id', d.prod_id)
        this.$set(row, 'error', d.error)
        this.currentImportIndex = d.index
      }
      if (d.isOver) {
        this.refresh().then(() => {
          this.$message({message: '导入完成', type: 'success'})
        })
      }
    },
    handlerValue(key, f) {
      let m = this.keyMap[key]
      if (m) {
        switch (m.type) {
          case 'number':
            f.text = Number(f.text) || null
            break
          case 'date':
            f.text = new Date(f.text) || null
            break
        }
      }
    },
    autoMatch(type, exitReturn, notMatch, handlerCol) {
      type = type || 'vague'
      let list = window.localStorage.getItem('excel_import_rule')
      let config = this.exp_pm_prod || {}
      if (list) list = JSON.parse(list).keyList
      if (!list) list = {}
      // 取头部文字
      let j = this.tempModel.headIndex - 1
      let map = ((this.datas[j] || {}).data || []).map(m => m.text)
      let fChar = f => f.replace(/'|\s|‘|“|’|”|\(|\)|（|）|/g, '')
      let {keyList} = this.tempModel
      for (let i = 0; i < this.getMaxTitleLength; i++) {
        // exitReturn决定存在不匹配
        if (exitReturn && keyList[i]) continue
        if (!(i in keyList)) Vue.set(keyList, i, '')
        if (notMatch) continue
        let vv
        if (map[i]) {
          // 头部存在，精准匹配
          vv =
            list[i + '-' + map[i]] || // 匹配序号加头部文字
            config[map[i]] || // 匹配系统配置
            list[map[i]] || // 匹配头部文字
            (this.textMap[map[i]] || {}).key || // 匹配系统字段prod.js,
            defalutRule[map[i]] || // 匹配系统默认头部
            keyList[i] || // 存在的话，等于自己
            '' // 没有匹配到清空
          if (!vv) {
            for (const key in config) {
              if (key in config) {
                if (fChar(map[i]) === fChar(key)) vv = config[key]
              }
            }
          }
          Vue.set(keyList, i, vv)
        }
        // 模糊匹配，没匹配到，去除特殊字符匹配
        if (type === 'vague' && !keyList[i]) {
          for (const key in list) {
            if (key in config) {
              if (fChar(map[i]) === fChar(key)) vv = config[key]
            }
          }
        }
        // 进行每列的校验
        handlerCol && this.handlerCol(i)
      }
    },
    getAllStaff() {
      this.$cache.getAllStaff().then(s => {
        this.staffMap = s.reduce((pre, val) => {
          let m = { owner_id: val.user_id, busi_group_id: val.busi_group_id }
          pre[val.user_name] = m
          pre[val.user_name_en] = m
          return pre
        }, {})
      })
    },
    selectStaff(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = this.staffMap[(d.text || '').trim()]
        if (t) {
          Vue.set(d, 'map', t)
          d.error = ''
        } else {
          Vue.set(item.data[i], 'error', '该员工不存在')
          err.push(d.text + '-员工不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getTitleConfig() {
      let field = 'exp_pm_prod'
      this.$configure.getValue(field, this.$state('me').com_id).then(res => {
        if (res[field]) {
          this[field] = res[field].reduce((pre, val) => {
            if (val.title) {
              pre[val.title.trim()] = val.value.key
            }
            return pre
          }, {})
        }
      })
    },
    getSalePacking() {
      let field = 'prod_setting'
      this.$cache.getPackings().then(res => {
        let packing = res
        this.packMap = packing.reduce((pre, val) => {
          let rst = {
            sale_pkg_en: val.en,
            sale_pkg: val.cn,
          }
          pre[val.en] = rst
          pre[val.cn] = rst
          let f = (val.en || '').toLowerCase().replace(/\s/g, '')
          pre[f] = rst
          return pre
        }, {})

        let prodUnits =
          (res[field] || {}).prodUnits || this.$constant('pieceworkUnit')
        this.unitMap = prodUnits.reduce((pre, val) => {
          // let rst = {
          //   prod_unit: val.en,
          // }
          pre[val.en] = val.en
          pre[val.cn] = val.en
          let f = (val.en || '').toLowerCase().replace(/\s/g, '')
          pre[f] = val.en
          return pre
        }, {})
      })
    },
    selectSalePacking(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = this.packMap[d.text.trim()]
        if (!t) t = this.packMap[d.text.toLowerCase().replace(/\s/g, '')]
        if (t) {
          Vue.set(d, 'map', t)
          d.error = ''
        } else {
          // Vue.set(d, 'map', {
          //   sale_pkg_en: d.text,
          //   sale_pkg: d.text
          // })
          d.error = '该包装方式不存在'
          err.push(d.text + '-包装方式不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    selectProdUnit(i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let t = this.unitMap[d.text.trim()]
        if (!t) t = this.unitMap[d.text.toLowerCase().replace(/\s/g, '')]
        if (t) {
          Vue.set(d, 'value', t)
          d.error = ''
        } else {
          d.error = '该个数单位不存在'
          err.push(d.text + '-个数单位不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getCurrency () {
      this.$cache.getCurrency().then(d => {
        this.currencyMap = d.reduce((pre, val) => {
          pre[val.key.toLowerCase()] = val.key
          if (val.text) pre[val.text] = val.key
          if (val.text_en) pre[val.text_en] = val.key
          if (val.symbol) pre[val.symbol] = val.key
          return pre
        }, {})
      })
    },
    selectCurrency (i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        d.text = d.text + ''
        let t = this.currencyMap[d.text.trim()]
        if (!t) t = this.currencyMap[d.text.toLowerCase().replace(/\s/g, '')]
        if (t) {
          Vue.set(d, 'value', t)
          d.error = ''
        } else {
          d.error = '该币种不存在'
          err.push(d.text + '-币种不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    selectPriceRule (i, rowIndex) {
      let err = []
      let arr = this.datas
      let checkAll = true
      if (this.datas[rowIndex]) {
        arr = [this.datas[rowIndex]]
        checkAll = false
      }
      arr.forEach((item, index) => {
        if (checkAll && index < this.tempModel.startIndex - 1) {
          item.data[i] && (item.data[i].error = '')
          return
        }
        let d = item.data[i] || {}
        if (!d.text) return
        let text = d.text + ''
        let t = this.priceRulesMap[text.trim()]
        if (!t) t = this.priceRulesMap[text.toLowerCase().replace(/\s/g, '')]
        if (t) {
          Vue.set(d, 'value', t)
          d.error = ''
        } else {
          d.error = '该价格方式不存在'
          err.push(d.text + '-该价格方式不存在')
        }
      })
      return [...new Set(err)].join('<br>')
    },
    getPriceRule () {
      this.priceRulesMap = [
        {text: '数量阶梯价', expect: 'qty_grade', unexpect: ''},
        {text: '客户专属价', expect: 'cust_own', unexpect: ''},
        {text: '客户等级系数 × 售价', expect: 'cust_level', unexpect: ''},
        {text: '采购价 ÷ 客户等级价格系数', expect: 'cust_pu', unexpect: ''},
        {text: '售价', expect: 'fob', unexpect: ''},
      ].reduce((pre, val) => {
        return {
          ...pre,
          [val.expect]: val.expect,
          [val.text]: val.expect,
        }
      }, {})
    },
    getCheckData() {
      this.getAllProdsFields()
      this.getAllBrands()
      this.getAllSorts()
      this.getAllApplier()
      this.getAllStaff()
      this.getAllProdTypes()
      this.getAllHarbour()
      this.getProdLevel()
      this.getAllBuyer()
      this.getSalePacking()
      this.getCurrency()
      this.getPriceRule()
    },
  },
  computed: {
    textMap() {
      return this.titleDatas._object('text')
    },
    keyMap() {
      return this.titleDatas._object('key')
    },
  },
  created() {
    this.getTitleConfig()
    setTimeout(() => {
      // 所有的产品字段
      this.getCheckData()
    })
  },
  beforeDestroy () {
    this.$ws.removeEvent(this.ws)
  }
}
