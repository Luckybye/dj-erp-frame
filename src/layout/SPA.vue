<template>
  <div class="SPA" :class="{'ph40 pv20': !inIframe}">
    <dj-tab :tab="currentTab" class="tab-pane-content"></dj-tab>
  </div>
</template>

<script>
import init from '@/views/init'
import { Base64 } from "js-base64";
export default {
  name: 'SPA',
  mixins: [init],
  components: {
    DjTab: require("./Tab").default,
  },
  props: {
    path: String,
  },
  data () {
    return {
      inIframe: window.self !== window.top,
      show: true
    }
  },
  computed: {
    currentTab () {
      return this.$store.getters.GetCurrentTab
    },
  },
  methods: {
    open () {
      let [path, query] = this.path.split('/')
      // console.log(path, 'pathpath', this.$route.query, query)
      query = Base64.decode(window.decodeURIComponent(query || '')) || '{}'
      let para = this.$route.query
      window.new_tab = para.new_tab
      delete para.new_tab
      this.$tab.open({
        title: 'SPA',
        tab_id: 'SPA',
        path,
        query: {
          ...para,
          ...JSON.parse(query),
          SPA: true
        },
        hash: false
      })
    }
  },
  created () {
    window.SPA = true
    this.open()
    if (window.history && window.history.pushState) {
      window.onpopstate = (e) => {
        this.open()
      }
    }
    if (this.inIframe) {
      document.body.classList.add('body-in-iframe')
    }
  }
}
</script>
<style lang="scss">
.body-in-iframe {
  overflow-x: hidden;
  .tab-pane-content .tab-page>.page-shadow {
    display: none;
  }
}
.SPA {
  --top-fixed-height: 60px;
  .tab-pane-content {
    padding: 0;
  }
  .x-timeline{
    max-height: 100vh;
  }
}
</style>