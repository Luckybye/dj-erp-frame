<template>
<div class="x-menu">
  <div class="menu-search fixed-top flex-b" v-if="mode === 'vertical' && !collapse">
    <x-input v-model="searchText" clearable placeholder="菜单检索" @clear="scrollIntoView" @enter2="searchEnter" class="flex-1"></x-input>
    <i class="iconfont icon-windows ml10 text-20 pointer self-center" @click="openDashboard"></i>
  </div>
  <el-menu
    :default-active="active"
    :mode="mode"
    menu-trigger="click"
    :collapse="collapse"
    :default-openeds="openeds"
    @select="select">
    <template v-for="item in menus2">
      <el-menu-item
        :index="item.tab_id"
        :key="item.tab_id"
        v-if="!item.sub || !item.sub.length"
        :tab-id="item.tab_id"
        @click="openTab(item)"
      >
        <b class="menu-icon">
          <x-icon :icon="item.icon_code" type="sys" v-if="item.icon_code"></x-icon>
          <b v-else class="f-icon">{{(item.title + '').slice(0, 1)}}</b>
        </b>
        <span class="title-text">
          {{$tt(item, 'title')}}
        </span>
        <i class="iconfont icon-dev x-dev-icon" v-if="isDevloping(item)"></i>
      </el-menu-item>

      <el-submenu
        :index="item.tab_id"
        :key="item.tab_id"
        :popper-class="showSub?'':'hide-submenu'"
        :tab-id="item.tab_id"
        v-else>
        <div slot="title" @click="openSubMenu(item)" :id="item.menu_id" class="menu-title-text">
          <b class="menu-icon">
            <x-icon :icon="item.icon_code" type="sys" v-if="item.icon_code"></x-icon>
            <b v-else class="f-icon">{{(item.title + '').slice(0, 1)}}</b>
          </b>
          <span class="title-text" :title="$tt(item, 'title')">
          {{$tt(item, 'title')}}</span>
        </div>

        <template v-for="child in item.sub">
          <el-menu-item
            :index="child.tab_id"
            v-if="!child.sub || !child.sub.length"
            :key="child.tab_id"
            @click="openTab(child)"
          >
            <x-icon :icon="child.icon_code" type="sys"  v-if="child.icon_code"></x-icon>
            <span class="title-text">
            {{$tt(child, 'title')}}
            </span>
            <i class="iconfont icon-dev x-dev-icon" v-if="isDevloping(child)"></i>
            <!-- <div class="devloping" v-if="isDevloping(child)">开发中</div> -->
          </el-menu-item>
          <el-submenu
            :index="child.tab_id"
            :key="child.tab_id"
            v-else
          >
            <div slot="title" @click="openSubMenu(child)">
              <x-icon :icon="child.icon_code" type="sys" v-if="child.icon_code"></x-icon>
              <span class="title-text">
              {{$tt(child, 'title')}}</span>
            </div>
            <template v-for="son in child.sub">
              <el-menu-item
                :index="son.tab_id"
                v-if="!son.sub || !son.sub.length"
                :key="son.tab_id"
                @click="openTab(son)"
              >
                <x-icon :icon="son.icon_code" type="sys" v-if="son.icon_code"></x-icon>
                <span class="title-text">
                {{$tt(son, 'title')}}
                </span>
                <i class="iconfont icon-dev x-dev-icon" v-if="isDevloping(son)"></i>
                <!-- <div class="devloping" v-if="isDevloping(son)">开发中</div> -->
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</div>
</template>

<script>
// import { menus } from "@/lib/menus";
export default {
  name: 'Menu',
  components: {},
  props: {
    active: [String],
    menus: {
      type: Array,
      default () {
        return []
      }
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    showSub: {
      type: Boolean,
      default: true
    },
    collapse: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      searchText: '',
      unWatchVmodel: null
    }
  },
  watch: {
  },
  computed: {
    menus2 () {
      let text = this.searchText
      if (!text) return this.menus
      // text = `([^~]*)(${text.split('').join(')([^~]*)(')})([^~]*)`
      let menus = this.$h.cloneDeep(this.menus)
      let reg = new RegExp(text, 'i')
      let arr = []
      let menusMap = this.$store.getters.GetMenus
      let isExist = v => {
        let val = [v.title, v.title_en, v.path]
        if (menusMap[v.path] && menusMap[v.path].desc) val.push(menusMap[v.path].desc)
        return reg.test(val.join('~'))
      }
      let filter = f => {
        f.visible = isExist(f)
        if (f.sub) f.sub.forEach(m => filter(m))
        if (!f.visible && f.sub && f.sub.length) {
          f.visible = f.sub.some(s => s.visible)
        }
      }
      menus.forEach(m => filter(m))

      let filter2 = f => {
        if (f.visible && f.sub) f.sub = f.sub.filter(ff => filter2(ff))
        return f.visible
      }
      arr = menus.filter(f => filter2(f))
      return arr
    },
    openeds () {
      if (!this.searchText) return []
      let arr = []
      let add = list => {
        list.forEach(f => {
          if (f.sub && f.sub.length) {
            arr.push(f.tab_id)
            add(f.sub)
          }
        })
      }
      add(this.menus2)
      return arr
    }
  },
  methods: {
    select () {
      this.unWatchVmodel && this.unWatchVmodel()
      this.$nextTick(this.addWatch)
    },
    scrollIntoView () {
      this.$nextTick(() => {
        if (!this.$el) return
        let activeEl = this.$el.querySelector('.el-menu-item.is-active')
        // console.log(activeEl, 'activeElactiveElactiveElactiveEl')
        setTimeout(() => {
          activeEl && activeEl.parentNode.scrollIntoView(false)
        }, 500)
      })
    },
    isDevloping (v) {
      let obj = this.$store.getters.GetMenus
      return !obj[v.path]
    },
    searchEnter () {
      if (!this.menus2.length) return
      let firstOption = ''
      let find = v => {
        if (!v) return
        if (!v.path) {
          find(v.sub[0])
        } else firstOption = v
      }
      find(this.menus2[0])
      if (!firstOption) return
      this.openTab(firstOption)
    },
    openTab(item) {
      if (!item) return
      this.$emit('menu-click', item)
      if (item.path) this.$tab.open(item)
    },
    openSubMenu (item) {
      this.$emit('menu-click', item)
    },
    activeMenu (d, f) {
      // console.log(d, f, 66666666)
    },
    addWatch (immediate) {
      this.unWatchVmodel = this.$watch('active', this.scrollIntoView, {immediate})
    },
    openDashboard () {
      this.$tab.open({
        title: '功能',
        path: 'Dashboard',
        tab_id: 'Dashboard',
        icon_code: 'icon-windows'
      })
    }
  },
  created () {
    this.addWatch(true)
  },
  mounted () {
    // setTimeout(() => {
    //   this.menusMap = menus._object('id')
    // })
  }
}
</script>
<style lang="scss">
.x-menu {
  background: inherit;
  .menu-search {
    background: inherit;
    padding: 5px;
  }
  .el-input__inner {
    // background: transparent;
  }
}
.nav-menu {
  .el-menu {
    background: transparent;
    border-right: 0;
    .el-menu-item {
      position: relative;
      color: inherit;
      .x-dev-icon {
        font-size: 15px;
        color: var(--aside-font-color);
      }
      &.is-active {
        background:var(--aside-active-bg-color);
        .title-text {
          color: var(--aside-active-font-color);
        }
        .x-dev-icon {
          color: var(--aside-active-font-color);
        }
        // .devloping {
        //   background: transparent;
        //   color: orange;
        // }
      }
    }
    .x-icon {
      margin-right: 5px;
      vertical-align: middle;
      font-size: 16px;
      &>* {
        vertical-align: initial;
      }
    }
    .f-icon {
      color: var(--aside-bg-color);
      font-size: 12px;
      position: relative;
      z-index: 1;
      text-align: center;
      width: 20px;
      display: inline-block;
      transform: scale(0.9);
      &:after {
        content: "";
        background-color: var(--aside-font-color);
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        width: 20px;
        height: 20px;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
      }
    }
    .menu-title-text {
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 10px;
      color: var(--aside-font-color);
      // display: flex;
      // align-items: center;
    }
    .title-text {
      color: var(--aside-font-color);
      // vertical-align: sub;
      // display: inline-block;
    }
  }
  .el-submenu__title:hover, .el-submenu__title:focus, .el-menu-item:hover, .el-menu-item:focus {
    .title-text, .x-icon, .menu-icon {
      color: #333;
    }
  }
  .el-menu--collapse {
    .menu-title-text {
      padding-right: 0;
      width: 30px;
      text-align: center;
    }
    .el-submenu__title {
      padding: 0 10px !important;
    }
    .x-icon {
      margin-right: 0;
    }
  }
}
.hide-submenu {
  display: none !important;
}
</style>
