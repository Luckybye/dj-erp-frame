<template>
  <!-- 65px -->
  <el-aside
    class="dj-aside nav-menu"
    :class="{'dj-aside--collapse': !showMenu}"
    v-if="menus.length">
      <!-- 自定义侧边栏 -->
      <div class="aside-menus flex column" v-show="asideMenus.length && !showMenu" v-if="loadOver">
        <div class="flex-1 flex column between">
          <div v-for="(arr, i) in asideMenus" :key="i">
            <div class="m-item line-1" :class="{'active': onActive(item)}" v-for="(item) in arr" :key="item" @click="openTab(item)">
              <x-icon :icon="getMenuCode(item)" type="sys" size="20px" v-if="getMenuCode(item)"></x-icon>
              <span class="line-1 text-12" :title="getMenuName(item)">{{getMenuName(item)}}</span>
            </div>
          </div>
        </div>
        <div class="m-item" :class="{'active': activeIndex === 'Dashboard'}" @click="openDashboard()">
          <i class="iconfont icon-windows text-20 pointer"></i>
        </div>
      </div>
      <!-- 用户全部菜单 -->
      <x-menu :menus="menus" :active="activeIndex" :collapse="!showMenu" v-show="showMenu || !asideMenus.length" v-if="loadOver"></x-menu>

      <!--左侧 隐藏菜单按钮 开始-->
      <!-- <transition name="hideMenu"> -->
        <div class="hideMenuButton" :class="{'menu-hide': !showMenu}" @click="switchAside">
          <i class="el-icon-arrow-left" v-if="showMenu"></i>
          <i class="el-icon-arrow-right" v-else></i>
        </div>
      <!-- </transition> -->
      <!--左侧 隐藏菜单按钮 结束-->
  </el-aside>
</template>

<script>
export default {
  name: 'Aside',
  components: {
    XMenu: require('./Menu').default
  },
  data () {
    return {
      linkageMenus: [],
      showMenu: !!window.localStorage.getItem('dj_show_menu'),
      asideMenus: [],
      loadOver: false
    }
  },
  watch: {
    showMenu: {
      handler: function (n) {
        document.body.style.setProperty('--aside-width', n ? '201px' : '50px')
      },
      immediate: true
    }
  },
  computed: {
    activeIndex() {
      return this.$store.getters.GetCurrentTabIndex
    },
    menus () {
      let show = this.menuType === 'linkage'
      return show ? this.linkageMenus : this.$store.getters.GetUserMenus
    },
    menuType() {
      return this.$store.getters.menuType
    }
  },
  methods: {
    setMenus (d) {
      this.linkageMenus = d
      this.hideMenu()
    },
    // 显示/隐藏 主菜单
    showHideMenu (bool) {
      this.showMenu = Boolean(bool)
    },
    hideMenu () {
      let w = window.innerWidth
      w > 1000 || this.showHideMenu(false)
    },
    async getConfigure (field) {
      if (!field) return
      let instance = this.portalId
      let v = await this.$post('/api/support/getConfigures', {instance, field}, {loading: true})
      return v[field]
    },
    async getAsideMenu () {
      let {top, bottom} = await this.$cache.getAsideMenu()
      this.loadOver = true
      if (!top && !bottom) return
      this.menuMap = (await this.$cache.getUserMenus()).pre._object('menu_id')
      top = top.filter(f => this.menuMap[f])
      bottom = bottom.filter(f => this.menuMap[f])
      if (!top.length && !bottom.length) return
      this.asideMenus = [top, bottom]
    },
    getMenuName (k) {
      return this.$tt(this.menuMap[k], 'menu_name')
    },
    onActive (id) {
      return this.activeIndex === id
    },
    getMenuCode (k) {
      return (this.menuMap[k] || {}).icon_code
    },
    openTab(item) {
      if (!item) return
      item = this.menuMap[item]
      let {menu_id: tab_id, query, path, menu_name: title, menu_name_en: title_en, icon_code} = item
      if (!path) query = {menu_id: tab_id}
      path = path || 'MenuEdit'
      // console.log(tab_id, title, path, query, 'tab_id, title, path, query')
      this.$tab.open({tab_id, title, title_en, path, query, icon_code})
    },
    openDashboard () {
      this.$tab.open({
        title: '功能',
        path: 'Dashboard',
        tab_id: 'Dashboard',
        icon_code: 'icon-windows'
      })
    },
    switchAside () {
      this.showMenu = !this.showMenu
      window.localStorage.setItem('dj_show_menu', this.showMenu || '')
    }
  },
  created () {
    this.$event.$on('linkage-nav', this.setMenus)
    window.addEventListener('resize', this.$h.debounce(this.hideMenu, 200))
    this.getAsideMenu()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$h.debounce(this.hideMenu, 200))
  }
}
</script>
<style lang="scss">
.dj-aside {
  // height: 100%;
  // border-right: 1px solid #eee;
  background:var(--aside-bg-color);
  color:var(--aside-font-color);
  box-shadow:-10px 0px 30px 10px rgba(85,99,159,0.02);
  transition: all .5s;
  width: var(--aside-width) !important;
  &::-webkit-scrollbar-track {
    background:var(--aside-bg-color);
  }
  &.dj-aside--collapse {
    overflow-x: hidden;
  }

  /*隐藏菜单 按钮*/
  .hideMenuButton {
    width: 12px;
    height: 50px;
    position: fixed;
    top: 50%;
    left: 188px;
    transform: translate(0, -50%);

    background: var(--aside-font-color);
    border-radius: 10px 0 0 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: var(--aside-bg-color);
    z-index: 99;
    transition: left 0.5s;
    opacity: 0.8;
    z-index: 1;
    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
  .menu-hide {
    left: 50px;
    border-radius: 0 10px 10px 0;
  }

  .aside-menus {
    height:100%;
    text-align: center;
    .m-item {
      cursor: pointer;
      padding: 10px 0;
      &+.m-item {
        margin-top: 5px;
      }
      &:hover {
        background:var(--aside-active-bg-color);
        color: var(--aside-active-font-color);
      }
      &.active {
        background:var(--aside-active-bg-color);
        color: var(--aside-active-font-color);
      }
    }
  }
}
</style>
