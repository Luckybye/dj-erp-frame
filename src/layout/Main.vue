<template>
 <!-- v-drag="{el: '.main-tabs>.el-tabs__header .el-tabs__nav', filter: '#tab-Home'}" -->
  <el-main class="dj-main">
    <!-- currentTabIndex计算属性，store会监听自动随之变化 -->
    <el-tabs
      :value="currentTabIndex"
      @input="onOpen"
      type="card"
      @tab-remove="close"
      @tab-click="showTab" ref="tabs"
      class="main-tabs">
      <el-tab-pane
        v-for="item in openedTabs"
        :key="item.tab_id"
        :name="item.tab_id"
        :closable="item.tab_id !== homeTab.tab_id"
        tabindex="-1"
        :ref="item.tab_id"
        class="tab-pane-wrap">
        <div @contextmenu="contextmenu($event, item)" slot="label" class="tab--item">
          <i
            v-if="item.tab_id === homeTab.tab_id"
            class="el-icon-s-home"
          ></i>
          <template v-else>
            <x-icon :icon="item.icon_code" class="tab-icon" size="14px" v-if="item.icon_code"></x-icon>
            <span class="tab-icon text-icon" v-else-if="(menus[item.show] || {}).icon_text">
              <span class="text">{{(menus[item.show] || {}).icon_text}}</span>
            </span>
            <span class="tab-icon ali-icon" v-else-if="getIcon(item)">
              <i class="iconfont" :class="getIcon(item)"></i>
            </span>
            <div class="tab--title">{{ $tt(item, 'title') }}</div>
          </template>
        </div>

        <div class="tab-pane-content" :class="[(item.show || item.path) + '-wrap', item.x_mode]" v-if="showMap[item.tab_id]">
          <dj-tab :tab="item" :tabId="item.tab_id" @load-mode-menu="v => loadModeMenu(item, v)" :actived="currentTabIndex===item.tab_id"></dj-tab>
        </div>
      </el-tab-pane>
      <!-- <div class="loading-tab-pane"></div> -->
    </el-tabs>
    <div style="display:none">触发语言变化{{$t('language_trigger')}}</div>
  </el-main>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
export default {
  name: "Main",
  components: {
    DjTab: require("./Tab").default,
  },
  data () {
    return {
      showMap: {}
    }
  },
  methods: {
    refreshTab(item) {
      this.$tab.refresh()
    },
    contextmenu (e, tab) {
      // console.log('contextmenucontextmenu', e)
      // if (tab.tab_id === this.homeTab.tab_id) return
      if (e.button === 2) {
        e.preventDefault();
        this.$dialog.RightClick({event: e, tab, homeTab: this.homeTab})
      }
    },
    onOpen (n) {
      // console.log(n, 'nnnnnnnnnnnn', this.currentTabIndex)
      n && Vue.set(this.showMap, n, true)
    },
    close (menuId) {
      // console.log(this, 'menuIdmenuIdmenuId')
      this.$tab.close(menuId)
    },
    showTab ({name}) {
      if (name === this.currentTabIndex) return
      this.$tab.showTab(name)
      // if (this.showMap[name]) this.$event.$emit(name)
      // console.log(this.showMap[name], 666666666)
      // if (!this.showMap[name]) return
      // setTimeout(() => {
      //   this.$nextTick(() => {
      //     let v = (this.$refs[name] || [])[0]
      //     v && v.$broadcast('active-tab')
      //   })
      // }, 500)
    },
    loadModeMenu (item, v) {
      Vue.set(item, 'x_mode', v)
    },
    getIcon (item) {
      let icon = (this.menus[item.show] || {}).icon
      if (typeof icon === 'function') return icon(item.query || {})
      return icon
    }
  },
  computed: {
    openedTabs() {
      return this.$store.getters.GetOpenedTabs;
    },
    homeTab() {
      return this.$store.getters.GetHomeTab;
    },
    menus() {
      return this.$store.getters.GetMenus;
    },
    currentTabIndex() {
      return this.$store.getters.GetCurrentTabIndex;
    },
  },
  created() {
    window.addEventListener("popstate", this.$tab.reShow);
    this.onOpen(this.currentTabIndex)
  },
  mounted () {
    this.$nextTick(() => {
      this.onOpen(this.currentTabIndex)
      let tabs = this.$refs.tabs.$el
      if (!tabs) return
      let el = tabs.querySelector('.el-tabs__content')
      el.addEventListener('scroll', (e) => {
        this.$event.$emit('scroll', e)
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.$tab.reShow);
  },
};
</script>
<style lang="scss">
.dj-main {
  --tab-active-color: var(--bg-color);
  // height: 100%;
  padding: 0 !important;
  background: var(--bg-color);
  &>.main-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    &>.el-tabs__header {
      margin-bottom: 0;
      // border-bottom: 0;
      background: var(--tab-header-color);
      color: var(--tab-font-color);
      border-color: var(--tab-border-color);
      .el-tabs__nav {
        border-color: var(--tab-header-color);
        border-right-color: var(--tab-border-color);
        // border: 0;
      }
      .el-tabs__item {
        color: inherit;
        padding-left: 0 !important;
        // border-bottom: 0;
        border-left-color: var(--tab-border-color);
        &:focus {
          box-shadow: none !important;
        }
        .tab--item {
          padding-left: 15px;
          display: inline-flex;
          vertical-align: middle;
          position: relative;
          white-space: nowrap;
        }
        .tab--title {
          max-width: 150px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tab-icon {
          margin-right: 5px;
          align-self: center;
          &.ali-icon {
            height: auto;
            text-align: center;
            display: inline-block;
            position: relative;
            transform: scale(0.7);
            &:before {
              content: "";
              position: absolute;
              left: -3px;
              height: 25px;
              // padding-top: calc(100% + 8px);
              width: calc(100% + 8px);
              top: calc(50% - 0px);
              transform: translateY(-50%) rotate(-15deg);
              border-radius: 50%;
              // background: #0d47a1;
              background: linear-gradient(#0d47a1, #87ecf1);
              z-index: -1;
              // box-shadow: 2px 2px 3px #87ecf1;
            }
            .iconfont {
              font-size: 12px;
              color: white;
              font-style: oblique;
            }
          }
          &.text-icon {
            @extend .ali-icon;
            color: white;
            // font-weight: 600;
            font-style: italic;
            font-family:iconfont;
            // text-shadow:6px 2px 2px #333;
            // color:deeppink
          }
        }
      }
      .el-tabs__item.is-active {
        background: var(--tab-active-color);
        color: var(--tab-active-font-color);
        border-bottom-color: var(--tab-active-color);
      }
    }
    &>.el-tabs__content {
      flex: 1;
      background: var(--bg-color);
      padding: 20px 0;
      height: calc(100% - 41px);
      position: relative;
      &>.tab-pane-wrap {
        // min-height: 80%;
        height: 100%;
        overflow: auto;
        // padding-bottom: 1px;
        // padding-top: 20px;
        &>.tab-pane-content {
          max-width: 1500px;
          margin: 0 auto;
        }
      }
    }
  }
  .loading-tab-pane {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.tab-pane-content {
  padding: 0 40px;
  // max-width: 1500px;
  // margin: 0 auto;
  // padding-top: 0;
  .tab-page {
    // min-height: calc(100vh - 150px);
    min-height: 80px;
    padding: 15px;
    padding-top: 5px;
    padding-bottom: 0;
    background: var(--tab-content-color);
    border-radius:2px;
    // background-color: #fafafa;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &+.tab-part {
      // @extend .tab-page;
    }
    .fixed-bottom {
      bottom: 15px;
    }
    // .fixed-top {
    //   top: 5px;
    // }
    &>.page-shadow {
      // display: none;
      height: 15px;
      margin-left: -15px;
      margin-right: -15px;
      bottom: 0;
      border-radius: 0 0 2px 2px;
      overflow: hidden;
      background: linear-gradient(var(--tab-content-color) 95%, #eee);
      // margin-bottom: -3px;
      z-index: 99;
      &._top {
        display: none;
        bottom: unset;
        top: 0;
        height: 5px;
        background: var(--tab-content-color);
        border-top: 1px solid rgb(245, 241, 241);
        border-radius: 2px 2px 0 0;
        margin-bottom: 0;
        // width: calc(100% + 2px);
      }
    }
  }
  .tab-part:not(.tab-page) {
    &>div>.tab-part--header {
      padding: 0 15px;
    }
  }
  // &.list>.dj-tab, &.timeline>.dj-tab{
  //   padding: 0;
  //   background: transparent;
  //   border-radius:0px;
  //   box-shadow: none;
  //   &>.tab-wrap>.tab-part {
  //     padding-top: 0;
  //   }
  // }
}
.tab-dropdown-menu {
  margin: 0 !important;
  .el-dropdown-menu__item {
    &:hover {
      background: white;
      color: initial;
    }
  }
  .m-item {
    &:hover {
      color: #409eff;
    }
  }
  .el-divider {
    height: auto;
  }
}
</style>
