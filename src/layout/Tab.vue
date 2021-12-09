<template>
  <div class="dj-tab">
    <!-- 返回按钮 -->
    <el-page-header @back="onBack(tab)" content="" v-if="(tab.push || tab.parts.length > 1) && !tab.show_menus" class="fixed-top">
      <template slot="content">
        <div class="text-right tr-dom-wrap" ref="trDom"></div>
      </template>
    </el-page-header>
    <!-- 菜单展示模式mode:  horizontal vertical timeline list anchor-->
    <div class="tab-wrap" :class="[tab.mode ? 'mode--' + tab.mode : '']">
      <!-- 菜单 -->
      <div class="tab-nav-menu fixed-top" v-if="tab.show_menus && tab.parts.length && tab.mode !== 'list'">
        <!-- 菜单-时间轴 -->
        <timeline :type="tab.show_menus" :show="tab.show" v-if="tab.mode === 'timeline'" @show-tab="showTab" :datas="tab.parts" :tab="tab"></timeline>
        <!-- 菜单-锚点 -->
        <anchor v-else-if="tab.mode === 'anchor'" :links="tab.parts" :parent="$el" @show-tab="showTab" :mapper="{href: 'path'}" :tabId="tabId" @scroll-bottom="scrollBottom" @scroll-top="scrollTop">
          <span slot="title" slot-scope="{item}">{{getTitle(item)}}</span>
        </anchor>
        <!-- 菜单-页签 -->
        <div class="h-nav" :class="{'flex bettween': tab.mode !== 'vertical'}" v-else-if="tab.show_menus === true">
          <div class="n-left flex" ref="trLeft">
            <el-menu :default-active="tab.show" :mode="tab.mode || 'horizontal'">
              <template v-for="item in tab.parts">
                <el-menu-item :index="item.path" :key="item.path" @click="showTab(item)" :disabled="item.disabled" v-show="!item.hidden">
                  {{getTitle(item)}}
                </el-menu-item>
              </template>
            </el-menu>
          </div>
          <div class="n-right auto-height self-center flex-1 text-right tr-dom-wrap" ref="trDom" v-show="showTrDom" v-if="tab.mode !== 'vertical'"></div>
        </div>
      </div>
      <!-- 页面内容 -->
      <div class="tab-part-wrap">
        <template v-for="item in tab.parts">
          <div class="tab-part" :key="item.path" v-if="showMap[item.path]" v-show="tab.show === item.path || listMode" :class="{'list': listMode, [tab.mode]: tab.mode, 'tab-page': !item.parts || !item.parts.length, [item.path]: item.path}">
            <!-- 页面上边缘阴影 -->
            <div>
              <div class="fixed-top page-shadow _top"></div>
              <!-- list-mode时，的页面title -->
              <div class="tab-part--header fixed-top" v-if="havePartHeader">
                <div class="n-center auto-height self-center">
                  <span class="mode-list--title text-primary border-primary">{{getTitle(item)}}</span>
                </div>
                <div class="n-right auto-height self-center flex-1 text-right pl20" :ref="item.path"></div>
              </div>

              <!-- 没有edit页面包含的多菜单页面 -->
              <Tab :tab="getItem(item)" v-if="!item.slot && item.parts && item.parts.length" @transfer-dom="transferDom" ref="subTab" :tabId="tabId" @load-mode-menu="loadModeMenu" :actived="componentActived(item, true)"></Tab>
              <!-- 有edit页面包含的多菜单页面或单页面 -->
              <component v-else v-show="!item.push" :is="menus[item.path] ? item.path : 'NotFound'" :payload="{...tab.query, ...item.query}" :parent="tab.path" :component-name="item.path" :tabId="tabId" :ref="item.path" @transfer-dom="transferDom" :actived="componentActived(item, !item.push)">
                <Tab :tab="item" v-if="item.slot" :tabId="tabId" @load-mode-menu="loadModeMenu" :actived="componentActived(item, true)" @transfer-dom="transferDom"></Tab>
              </component>
            </div>

            <!-- 页面下边缘阴影 -->
            <div class="fixed-bottom page-shadow _bottom"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'Tab',
  props: {
    tab: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    },
    tabId: {
      type: String,
      default: ''
    },
    actived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showMap: {},
      trDomsScope: ''
    }
  },
  components: {
  },
  methods: {
    scrollBottom (i) {
      // console.log(i, 'scrollBottomscrollBottom')
      let m = this.tab.parts[i]
      if (!m) return
      Vue.set(this.showMap, m.path, !m.disabled)
      if (this.showMap[m.path]) return
      if (m.disabled) return this.scrollBottom(++i)
      // this.showTab(m)
    },
    scrollTop (i) {
      // console.log(i, 'scrollTopscrollTopscrollTop')
      let m = this.tab.parts[i]
      if (!m) return
      if (this.showMap[m.path]) return
      Vue.set(this.showMap, m.path, !m.disabled)
      if (m.disabled) return this.scrollTop(--i)
      // this.showTab(m)
    },
    showTab (item, cb) {
      if (item.disabled) return
      this.tab.show = item.path
      Vue.set(this.showMap, item.path, true)
      this.$nextTick(() => {
        this.$store.commit('SetHash', {replace: true})

        let ref = this.$refs[this.tab.show] || (this.$refs.subTab || [])[this.tab.show] || []
        let page = ref[0]
        page && page.tabShow && page.tabShow()
        setTimeout(() => {
          cb && cb()
        })
      })
    },
    getItem (item) {
      item.query = item.query || this.tab.query
      return item
    },
    handlerParts () {
      let {tab} = this
      if (!tab.parts) return
      if (tab.mode === 'list' || tab.show_all) {
        tab.parts.forEach((m, i) => {
          setTimeout(() => {
            Vue.set(this.showMap, m.path, !m.disabled)
          }, i * 100)
        })
        return
      }
      if (this.showMap[tab.show]) return
      let curr = tab.parts.find(f => f.path === tab.show) || tab.parts[0]
      if (!curr) return
      Vue.set(this.showMap, curr.path, true)
      tab.show = curr.path
      // this.$forceUpdate()
    },
    onBack (tab) {
      let lastPage = (this.$parent.$refs[tab.path] || [])[0] || (this.$refs[tab.show] || [])[0]
      let v
      lastPage && lastPage.beforeBack && (v = lastPage.beforeBack())
      this.$tab.back(tab)
      let page = (this.$parent.$refs[tab.path] || [])[0] || (this.$refs[tab.show] || [])[0]
      page && page.tabBack && page.tabBack(v)
    },
    transferDom ({scope, cb}) {
      this.$nextTick(() => {
        let parent = this.$refs.trDom || this.$parent.$refs.trDom || this.$parent.$parent.$refs.trDom
        if (this.havePartHeader) parent = (this.$refs[scope] || {})[0]
        if (!this.havePartHeader && this.tab.show !== scope) return
        this.trDomsScope = scope
        // console.log(parent, this, 'parentparentparentparent')
        cb && cb(parent)
      })
    },
    loadModeMenu (v) {
      v && this.$emit('load-mode-menu', v)
    },
    componentActived (item, bool) {
      return this.actived && (this.tab.show === item.path || this.listMode) && bool
    },
    getTitle (item) {
      return item.x_title || item.title || this.$t((this.menus[item.path] || {}).title) || ''
    }
  },
  watch: {
    tab: {
      deep: true,
      handler () {
        // console.log('handlerhandlerhandler')
        this.handlerParts()
        // this.$forceUpdate()
      }
    },
    // currentTab: {
    //   deep: true,
    //   handler () {
    //     console.log('currentTabcurrentTabcurrentTabcurrentTab')
    //   }
    // }
  },
  computed: {
    menus () {
      return this.$store.getters.GetMenus
    },
    // currentTab () {
    //   return this.$store.getters.GetCurrentTab
    // },
    listMode () {
      let {mode} = this.tab
      return mode === 'list' || mode === 'anchor'
    },
    havePartHeader () {
      let {mode} = this.tab
      return mode === 'list' || mode === 'anchor' || mode === 'vertical'
      //  || mode === 'timeline'
    },
    showTrDom () {
      // return true
      return this.trDomsScope === this.tab.show
    },
    // showTabParts () {
    //   return this.tab.parts.filter(f => !f.from)
    // }
  },
  created () {
    this.handlerParts()
    this.loadModeMenu(this.tab.mode)
  },
  mounted() {
  },
}
</script>
<style lang="scss">
.dj-tab {
  .tab-nav-menu {
    height: fit-content;
  }
  .h-nav {
    border-bottom: solid 1px #e6e6e6;
    // margin-left: -15px;
    // margin-right: -15px;
    padding-left: 15px;
    padding-right: 15px;
    background: inherit;
    .el-menu.el-menu--horizontal {
      // border: 0;
      margin-bottom: -1px;
    }
  }
  &>.el-page-header {
    // line-height: normal;
    background: #CFD8DC;
    padding: 5px 15px;
    border-bottom: 1px dotted #e1e1e1;
    .el-page-header__content {
      font-size: 14px;
      flex: 1;
    }
    .el-page-header__title {
      align-self: center;
      height: auto;
    }
  }
  .tab-wrap {
    &.mode--vertical, &.mode--timeline, &.mode--anchor {
      display: flex;
      justify-content: space-between;
      &>.tab-part-wrap {
        width: calc(100% - 170px);
      }
    }
    &.mode--vertical {
      .tab-nav-menu {
        max-height: calc(100vh - 110px);
        overflow-y: auto;
        overflow-x: hidden;
        width: 130px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        padding-bottom: 35px;
      }
      .n-left {
        flex-direction: column;
      }
      .el-menu:not(.el-menu--horizontal) {
        border-right: 0;
        .el-menu-item {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #eee;
          // border-bottom: 0;
          border-left: 5px solid transparent;
          &.is-active {
            border-left: 5px solid var(--color-primary);
          }
        }
      }
      .h-nav {
        padding: 0;
        border-bottom: 0;
      }
      &>.tab-part-wrap {
        width: calc(100% - 150px);
      }
    }
    &.mode--anchor {
      flex-direction: row-reverse;
      &>.tab-part-wrap {
        width: calc(100% - 120px);
      }
      .tab-nav-menu {
        top: unset;
        bottom: 0;
        background: transparent;
        align-self: flex-end;
      }
    }
  }

  .tab-part--header {
    display: flex;
    justify-content: space-between;
    min-height: 50px;
    border-bottom: 1px dotted #e1e1e1;
    margin-bottom: 10px;
  }
  .tab-part {
    // padding-top: 15px;
    // &.list, &.timeline {
    //   padding: 15px;
    //   padding-top: 5px !important;
    //   background: white;
    //   border-radius:2px;
    //   box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    // }
    &+.list {
      margin-top: 15px;
    }
    .mode-list--title {
      padding-left: 10px;
      border-left: 3px solid #000;
    }
  }
  .tr-dom-wrap {
    .tab-page-header {
      margin-bottom: 0;
      border-bottom: 0;
    }
  }
}
</style>
