export async function queryCustCompany () {
  let {cust_com_id} = this.payload
  if (!cust_com_id) return
  let v = await this.$pull.queryCustCompany({cust_com_id})
  this.vm = this.$h.defaultsDeep(v.cust_company, this.vm)
}

export async function updateCustCompany (v, vm) {
  vm = vm || this.vm
  if (typeof v === 'string') v = {[v]: vm[v]}
  v.cust_com_id = vm.cust_com_id
  return await this.$pull.updateCustCompany(v)
}

export async function queryApprove () {
  let field
  if (this.payload.cust_type === '2') field = 'approve_customer'
  if (this.payload.cust_type === '4') field = 'approve_supplier'
  if (!field) return
  this.approve = await this.$configure.getValue(field, this.$state("me").com_id)
}

export function getCustInfo () {
  let {cust_id} = this.payload
  if (!cust_id) return
  return this.$pull.queryCustUser({cust_id, need_mg: 1}).then(user => {
    this.vm = {...this.vm, ...user.cust_user}
  })
}