<template lang="html">
  <div class="pm-prod-info">
    <div v-tr-dom class="nowrap">
      <el-dropdown>
        <el-button type="primary">
          二维码
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <iframe :src="qrcode" frameborder="0" width="400" height="400"></iframe>
            <div class="text-center">
              <el-button type="primary" @click="onCreatQrcode">打印</el-button>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <i class="el-icon-view"></i> -->
      <el-button type="primary" @click="previewScanPage" icon="el-icon-view" class="ml10"></el-button>
      <el-button type="primary" @click="switchLang">{{isCn ? 'English' : '中文'}}</el-button>
    </div>
    <prod-info :view-model="viewModel" @on-save="onSaveInner" :is-cn="isCn" ref="prodInfo" :bill-id="payload.prod_id" :bill-type="payload.status === 'research' ? 'ps' : 'pm'" collection="prod_infos" :readonly="readonly" :payload="payload" :extend-arr="natures" :actived="actived"></prod-info>
  </div>
</template>

<script>
import ProdInfo from "@/views/prod/prod-page.vue";
let fmt = {
  ...window._g.getFmtFields("prod", "pm"),
  x_prod_sort_en: "",
  x_prod_sort: "",
  x_busi_group_id: '',
  x_owner_id: '',
  x_owner_id_en: '',
};
function initialize() {
  let ps = []
  ps = [this.$pull.queryProdInfo({prod_id: this.payload.prod_id})]
  ps.push(this.$pull.queryNature({prod_id: this.payload.prod_id}))
  return this.$Promise.when(ps).then((p, n) => {
    p = p.prod_info || p.inq_prod || {}
    this.viewModel = {...this.viewModel, ...p}
    this.natures = n.prod_natures || []
    setTimeout(() => {
      this.$tab.emit('prod-load-over', this.viewModel)
    })
  })
}

export default {
  data() {
    return {
      viewModel: this.$h.cloneDeep(fmt),
      isCn: this.$i18n.locale === 'cn',
      natures: [],
      scanPageUrl: ''
    };
  },
  components: {
    ProdInfo,
  },
  methods: {
    initialize,
    onSaveInner (v) {
      v = {...v, prod_id: this.viewModel.prod_id}
      if (this.viewModel.status === 'initial') {
        if (this.payload.sort_type) v.type = 'materiel'
      }
      delete v.mg_pkgs // 包装有自己的保存
      return this.$pull.upsertProduct(v).then(data => {
        if (data.prod_no) this.viewModel.prod_no = data.prod_no
        if ('prod_sort' in v) this.$tab.emit('change-prod-sort')
      })
    },
    onCreatQrcode () {
      window.open(this.qrcode)
    },
    switchLang () {
      // let self = this.$refs.prodInfo
      // console.log(self, 'prodInfoprodInfo')
      // let {locale} = self.$i18n
      // self.$i18n.locale = locale === 'en' ? 'cn' : 'en'
      this.isCn = !this.isCn
    },
    previewScanPage () {
      let url = this.scanPageUrl
      let p = this.$Promise.as(url)
      // let win = window.open('')
      if (!url) {
        let uri = `/api/support/getQrcode.json?domain=${encodeURIComponent(this.$getHost)}&field=qrcode_prod&prods=${encodeURIComponent(JSON.stringify([this.viewModel.prod_id]))}&com_id=${this.viewModel.com_id}`
        p = this.$get(uri, {}, {loading: true}).then(d => {
          this.scanPageUrl = (d.prods[0] || {}).qrcode
          console.log(this.scanPageUrl, 'this.scanPageUrl')
          return this.scanPageUrl
        })
      }
      p.then(u => {
        // win.location.href = u
        window.open(u)
      })
    }
  },
  watch: {
    '$i18n.locale': {
      handler (n) {
        this.isCn = n === 'cn'
      }
    }
  },
  computed: {
    qrcode () {
      // return this.$getHost + '/x/' + this.payload.prod_id + '/p.html'
      let prods = JSON.stringify([this.payload.prod_id])
      return `${this.$getHost}/api/support/getQrcode.pdf?domain=${encodeURIComponent(this.$getHost)}&field=qrcode_prod&prods=${encodeURIComponent(prods)}&com_id=${this.$state('me').com_id}`
    },
    readonly () {
      let row = this.viewModel
      let {edit} = this.prodAuth
      let me = this.$state('me')
      return !(edit === 'all' ||
              (edit === 'self' && row.owner_id === me.user_id) ||
              (edit === 'group' && (me.busi_groups || []).indexOf(row.busi_group_id) >= 0))
    },
    prodAuth () {
      return this.$store.getters.user_auth.prod_auth || {}
    }
  },
  created() {
    this.initialize();
  },
  beforeDestroy() {},
};
</script>
