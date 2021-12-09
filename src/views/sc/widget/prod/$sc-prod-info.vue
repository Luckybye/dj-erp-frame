<template lang="html">
  <div class="sc-prod-info">
    <div class="nowrap" v-tr-dom>
      <el-button type="primary" @click="switchLang">{{isCn ? 'English' : '中文'}}</el-button>
    </div>
    <prod-info
      :view-model.sync="viewModel"
      @on-save="onSaveInner"
      :is-cn.sync="isCn"
      :bill-type="payload.isSuite ? 'sc-bom' : 'sc'"
      :payload="payload"
      :bill-id="payload.bill_prod_id"
      :approving="payload.approving"
      :extend-arr="natures"
      :actived="actived"
    ></prod-info>
  </div>
</template>

<script>
import ProdInfo from "@/views/prod/prod-page.vue";
let fmt = {
  ...window._g.getFmtFields("prod", "sc"),
  x_prod_sort_en: "",
  x_prod_sort: "",
  x_seller_id: ''
};
function initialize() {
  let id = this.payload.bill_prod_id;
  if (!id) return;
  let v = {
    bill_prod_id: id,
    need_mg: 1,
  };
  if (!this.payload.isSuite) v.need_suite = 1;
  let ps = [this.$pull.queryPiProd(v)];
  ps.push(this.$pull.queryPiNature({ bill_prod_id: id }));
  return this.$Promise.when(ps).then((data, n) => {
    this.viewModel = { ...this.viewModel, ...data.pi_prod };
    this.natures = n.pi_natures || [];
    // this.$h.formatPort(this.viewModel, 'x_load_port')
    // this.modelReset(this.viewModel)
    // this.pageEventer.emit('prod-load-over', this.viewModel)
  });
}

export default {
  data() {
    return {
      viewModel: this.$h.cloneDeep(fmt),
      isCn: this.$i18n.locale === 'cn',
      natures: [],
    };
  },
  components: {
    ProdInfo,
  },
  methods: {
    initialize,
    onSaveInner(v) {
      let para = {...v, bill_prod_id: this.viewModel.bill_prod_id}
      this.$pull.updatePiProd(para).then((data) => {
        console.log(data, '更新')
        if (data.prod_no) this.viewModel.prod_no = data.prod_no
      })
    },
    switchLang () {
      this.isCn = !this.isCn
    },
  },
  watch: {
    '$i18n.locale': {
      handler (n) {
        this.isCn = n === 'cn'
      }
    }
  },
  created() {
    this.initialize();
    this.$tab.on('refresh-prod', this.initialize)
  },
  beforeDestroy() {
    this.$tab.remove('refresh-prod', this.initialize)
  },
};
</script>
