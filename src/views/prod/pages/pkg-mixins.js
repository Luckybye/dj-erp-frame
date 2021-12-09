
export default {
  data () {
    return {
    }
  },
  computed: {
    pkg () {
      let arr = this.viewModel.mg_pkgs || []
      if (arr.length <= 1) {
        let v = arr[0] || {}
        v.carton_qty = (v.inner_pkg_pcs * 1 || 1) * (v.outer_pkg_pcs * 1 || 1)
        return v
      }
      let v = arr.reduce((pre, val) => {
        pre.carton_qty += ((val.inner_pkg_pcs * 1 || 1) * (val.outer_pkg_pcs * 1 || 1))
        pre.cbm += (val.cbm * 1 || 0)
        pre.gp20 += (val.gp20 * 1 || 0)
        pre.gp40 += (val.gp40 * 1 || 0)
        pre.hc40 += (val.hc40 * 1 || 0)
        pre.carton_gw += (val.carton_gw * 1 || 0)
        pre.carton_nw += (val.carton_nw * 1 || 0)
      }, {...arr[0], carton_qty: 0, cbm: 0, gp20: 0, gp40: 0, hc40: 0, carton_gw: 0, carton_nw: 0})
      v.cbm = v.cbm.toFixed(6) * 1
      v.carton_gw = v.carton_gw.toFixed(6) * 1
      v.carton_nw = v.carton_nw.toFixed(6) * 1
      return v
    }
  },
  methods: {
  },
  created () {
  },
  mixins: []
}