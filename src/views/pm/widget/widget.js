/**
 * Created by wangmin on 16/12/30.
 */

export function initialize (fmt) {
  let self = this
  let p = self.$pull.queryProdInfo({prod_id: self.payload.prod_id}).then(function (data) {
    self.viewModel = self.$helper.format(fmt, data.prod_info)
    self.modelReset(self.viewModel, 200)
  })
  return p
}

export function onChangePriority (v) {
  console.log(v)
  this.viewModel.mall_priority = v
  this.onSaveInner()
}
export function onSave () {
  let self = this
  self.onSaveInner().then(function (data) {
    if (data) self.$message('保存成功')
  }).catch(function () {
    self.$message('保存出错')
  })
}

export function onSaveInner (v) {
  v = {...v, prod_id: this.viewModel.prod_id}
  if (this.viewModel.status === 'initial') {
    if (this.payload.sort_type) v.type = 'materiel'
  }
  delete v.mg_pkgs // 包装有自己的保存
  return this.$pull.upsertProduct(v).then(data => {
    if (data.prod_no) this.viewModel.prod_no = data.prod_no
  })
}

export async function exportExcel (type) {
  let field = 'exp_pm_prod'
  let {exp_config: config} = this
  if (!config) {
    config = await this.$configure.getValue(field, this.$state('me').com_id).then(res => res[field] || [])
    this.exp_config = config
  }
  if (!config.length) return this.$message('请添加导出配置')
  config = config._assign({x_checked: true})
  this.$dialog.ExportExcelConfig({config}, (head) => {
    let para = this.$h.cloneDeep(this.searchModel || {});
    para = para._trim();
    para.get_para = 'yes'
    if (!para.prod_types || para.prod_types.length === 0) delete para.type
    para = this.$api.queryProdList(para)
    let {page_size, page_index} = para
    let pages = [
      {page_size, page_index}
    ]
    if (type === 'all') {
      // let isHaveImg = head.find(f => f.value && f.value.key === 'main_pic')
      pages = []
      let size = 1000
      // if (isHaveImg) size = 200
      let l = Math.ceil(para.count / size)
      for (let i = 0; i < l; i++) {
        pages.push({
          page_size: size,
          page_index: i + 1
        })
      }
    }
    if (type === 'select') para.prod_ids = this.checkboxValue.map(m => m.prod_id)
    let index = 0
    function exported (page, i) {
      let flag = ((page.page_index - 1) * page.page_size + 1) + '-' + Math.min((page.page_index * page.page_size), para.count)
      if (type === 'select') flag = '-选中-' + para.prod_ids.length
      let name = '公司商品' + flag + '.xlsx'
      this.$post('/x/r.json', {
        para: {...para, page},
        field: 'stats_pm_prod',
        bill_id: 'stats_pm_prod',
        file_name: name,
        head,
      }, {loading: true}).then(async d => {
        let url = `/x/${d.render_id}/r.xlsx`
        await this.$h.download(url, name)
      }).finally(() => {
        index++
        if (index < pages.length) exported.call(this, pages[index], index + 1)
        // window.open(url)
      })
      // .catch(() => {
      //   // this.$message('当数量太多的时候，下载可能会超时；请控制下载数量，看看窗口是否拦截文件下载')
      // })
    }
    exported.call(this, pages[index], index + 1)
  })
}