<template lang="html">
  <el-form class="prod-page" :label-width="labelWidth" label-position="left" :class="'mode--'+prodSetting2.prod_show_mode">
    <el-menu :default-active="showTab" :mode="getMode()" v-if="module2tabs" class="fixed-top prod-module-tab-header" v-tr-dom>
      <el-menu-item v-for="page in datas" :index="page.x_id" :key="page.x_id" @click="onShowTab(page)">
        {{ isCn ? page.title : page.title_en }}
      </el-menu-item>
    </el-menu>
      <template v-for="(page) in datas">
        <div
          :key="page.x_id"
          class="basic-info part-1" v-if="!module2tabs || showTabMap[page.x_id]" v-show="!module2tabs || page.x_id === showTab">
          <div class="prod-title" v-if="(page.title || page.title_en) && !module2tabs">
            {{ isCn ? page.title : page.title_en }}
          </div>
          <div class="prod-panel" :style="{'--panel-bg-color': page.bg_color || 'white'}">
            <div
              v-for="(row) in page.parts"
              :key="row.x_id"
              class="part-2">
              <el-row type="flex" :gutter="30">
                <el-col
                  :span="col.span * 1 || 24"
                  v-for="(col) in row['parts'] || row"
                  class="part-3"
                  :key="col.x_id">
                  <div
                    class="part-4"
                    v-for="(cell) in col.parts"
                    :key="cell.x_id">
                    <!-- 商品模块 -->
                    <component
                      :is="cell.x_part"
                      :view-model="viewModel"
                      :is-cn="isCn"
                      @on-save="onSaveInner"
                      :bill-id="billId"
                      :payload="payload"
                      :readonly="readonly"
                      :approving="approving"
                      :extend-arr="extendArr"
                      :natureid="cell.x_natureid"
                      :bill-type="billType"
                      :collection="collection"
                      :prod-setting="prodSetting2"
                      :disabledMap="payload.disabledMap">
                    </component>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </template>
  </el-form>
</template>
<script>
import Mixins from "./pages/mixins.js";
import Components from "./pages";

export default {
  mixins: [Mixins],
  components: Components,
  props: {
    custType: {
      type: String,
      defulat: ''
    },
    actived: Boolean,
  },
  data() {
    return {
      datas: [],
      showTab: '',
      showTabMap: {},
      tabMode: 'horizontal'
    };
  },
  watch: {
    actived (n) {
      if (!n) {
        this.lastShow = this.showTab
        this.showTab = ''
      } else {
        this.showTab = this.showTab || this.lastShow
      }
    }
  },
  computed: {
    module2tabs () {
      return (this.prodSetting2.prod_show_mode + '').indexOf('tabs') >= 0
    },
  },
  methods: {
    getMode () {
      let v = this.prodSetting2
      let mode = 'horizontal'
      if (this.tabMode === 'vertical' && v.prod_show_mode === 'top_tabs') mode = 'vertical'
      return mode
    },
    onShowTab (page) {
      if (!page) return;
      this.showTab = page.x_id
      this.showTabMap[page.x_id] = true
      if (this.tabWrap) {
        let v = this.tabWrap.tab.parts.find(f => f.path === this.$parent.componentName)
        this.tabWrap.showTab && this.tabWrap.showTab(v)
      }
    },
    handlerTabHeader () {
      if (this.prodSetting2.prod_show_mode !== 'top_tabs') return
      this.$on('transfer-dom', ({cb, scope}) => {
        let parent = (this.$parent || {}).$parent
        if (!parent || !parent.$refs || !parent.$refs.trLeft) return

        this.tabWrap = parent
        this.tabMode = parent.tab.mode
        let tab = this.$store.getters.GetCurrentTab
        tab = (tab.parts[0].parts || []).find(m => this.$parent.componentName === m.path)
        tab && this.$set(tab, 'hidden', true)

        parent = parent.$refs.trLeft
        if (parent.querySelector('div[data-type=prod_module_tab]')) return
        let div = document.createElement('div')
        div.setAttribute('data-type', 'prod_module_tab')
        parent.prepend(div)
        cb(div)
      })
    },
    async init () {
      let type = this.custType || this.$root.cust_type || ''
      this.$cache.getProdPage(this.billType, type).then(d => {
        this.datas = d.pages || []
        this.onShowTab(this.datas[0])
      })
      await this.queryProdSetting();
      this.handlerTabHeader()
    }
  },
  created() {
    this.init()
  },
};
</script>
<style lang="scss">

.PmInfo, .QuProdInfo, .ScProdInfo, .PuProdInfo, .OrderProdInfo, .SdProdInfo {
  // --tab-content-color: #eefdf8;
  // padding-top: 15px;
  // box-shadow: none;
  &.tab-page {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    .page-shadow._bottom {
      display: none;
    }
    .tab-part--header {
      padding: 0 15px;
      .prod-title {
        top: 50px !important;
      }
    }
  }
  &.list, &.vertical {
    .prod-title {
      top: 50px !important;
    }
  }
}
.prod-page {
  &.mode--tabs, &.mode--top_tabs {
    .prod-panel {
      margin-top: 10px;
    }
  }
  &.mode--tabs {
    &>.el-menu {
      margin-bottom: 10px;
    }
  }
  .basic-info {
    font-size: 13px;
    color: #44495e;
    .prod-title {
      color: #8b8fa1;
      line-height: 30px;
      position: relative;
      margin-left: 15px;
      padding-left: 15px;
      position: sticky;
      top: 40px;
      background: var(--bg-color);
      z-index: 1;
      &:before {
        content: "";
        border-left: 3px solid #409EFF;
        position: absolute;
        left: 0;
        height: 60%;
        top: 20%;
      }
    }
    .prod-panel {
      --panel-bg-color: white;
      background: var(--panel-bg-color);
      padding: 15px;
      // padding-bottom: 0;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,.05);
      margin-bottom: 10px;
      input, textarea, .el-input-group__append, .el-input-group__prepend, .el-table {
        background: transparent !important;
      }
      .select-close {
        background: var(--panel-bg-color);
      }
    }
    .flex-line {
      white-space: nowrap;
      display: flex !important;
      justify-content: space-between;
    }
    .font-limit {
      font-size: 12px;
      color: dimgray;
      align-items: flex-end;
      display: inline-flex;
      position: absolute;
      right: 0px;
      bottom: 0px;
      .ideal-icon-btn {
        padding: 0 !important;
      }
      .translate-icon {
        padding: 0 !important;
        position: relative;
        top: 5px;
        .icon-translate {
          font-size: 30px !important;
        }
      }
    }
    .prod-unit {
      line-height: 30px;
      color: #409EFF;
      margin-left: 5px;
    }
    .el-input-group__append {
      padding: 0 5px;
    }
    .translate-icon {
      font-size: 0;
      vertical-align: middle;
      .x-icon {
        font-size: 28px;
      }
    }
  }
}
.prod-module-tab-header {
  border-width: 0 !important;
}
</style>
