<template>
  <el-header class="dj-header" height="50px">
    <div class="h-left logo flex-middle ph20 text-center">
      <img
        :src="comInfo.card_pic"
        alt=""
        v-if="comInfo.card_pic"
        @click="$tab.showHome()"
      />
    </div>

    <div class="h-center h-nav flex-1 hidden nav-menu" ref="topMenu">
      <x-menu
        :menus="menus"
        :active="activeIndex"
        mode="horizontal"
        v-if="menuType !== 'left'"
        @menu-click="showLeftSubMenus"
        :show-sub="false"
      ></x-menu>
    </div>

    <div class="h-right h-user flex-center pr20 pl10">
      <div class="language-switch inline-block a-link">
        <span v-if="$i18n.locale === 'en'" @click="onSwitchLang('cn')"
          >中文</span
        >
        <span v-if="$i18n.locale === 'cn'" @click="onSwitchLang('en')"
          >English</span
        >
      </div>
      <el-divider direction="vertical" style="height: 40px"></el-divider>
      <el-dropdown placement="bottom" @command="handleCommand">
        <div class="avator flex" @click="viewUserInfo">
          <el-badge :value="unread" :hidden="!unread">
            <img
              v-if="((userInfo.mg_avatar || [])[0] || {}).url"
              :src="(userInfo.mg_avatar || [])[0].url"
              alt=""
              class="vm"
            />
            <span class="iconfont icon-avatar vm" v-else></span>
          </el-badge>
          <div class="self-center ml5">
            <span class="text-12 text-grey">{{
              $tt(userInfo, 'user_name')
            }}</span>
            <!-- <i class="el-icon-arrow-down ml10"></i> -->
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="viewUserInfo">基本信息</el-dropdown-item>
          <el-dropdown-item command="changeTheme">主题</el-dropdown-item>
          <el-dropdown-item command="onChat">聊天</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <x-theme v-model="showTheme" v-if="showTheme"></x-theme>
      <i class="el-icon-full-screen text-18 a-link ml10" @click="requestFullScreen"></i>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    XMenu: require('./Menu').default,
    XTheme: require('./theme').default,
  },
  data() {
    return {
      comInfo: {},
      userInfo: {},
      currentTabIndex: '',
      menuList: [],
      clickTimes: 0,
      showTheme: false,
      haveUnDeal: false,
    }
  },
  computed: {
    activeIndex() {
      this.setLeftNav()
      return this.$store.getters.GetCurrentTabIndex
    },
    menus() {
      return this.$store.getters.GetUserMenus
    },
    menuType() {
      return this.$store.getters.menuType
    },
    unread() {
      return this.$store.getters.unread
    },
  },
  methods: {
    async getUserInfo() {
      this.userInfo = this.$state('me')
      // this.$store.dispatch('UserLogin', this.userInfo)
    },
    async getComInfo() {
      this.comInfo = await this.$cache.getComInfo()
    },
    changeTheme () {
      this.showTheme = true
    },
    viewUserInfo() {
      this.$tab.open({
        title: '基本信息',
        title_en: 'User Info',
        tab_id: this.$state('me').user_id,
        path: 'UserInfo',
      })
    },
    async logout() {
      this.$get('/api/system/signoff', null, { warning: false }).finally(() =>
        location.reload()
      )
    },
    handleCommand(fun) {
      this[fun] && this[fun]()
    },
    showLeftSubMenus(d) {
      this.$event.$emit('linkage-nav', d.sub)
    },
    setLeftNav() {
      this.$nextTick(() => {
        if (this.menuType !== 'linkage') return
        if (!this.menus.length) return
        let ref = this.$refs.topMenu
        if (!ref) return
        let el = ref.querySelector('.el-submenu.is-active')
        if (!el) return
        let id = el.getAttribute('tab-id')
        let d = this.menus.find(f => f.tab_id === id)
        d && this.showLeftSubMenus(d)
      })
    },
    onSwitchLang(lang) {
      this.$i18n.locale = lang
      window.localStorage.setItem('dj_language', lang)
    },
    viewApprove () {
      this.$tab.open({
        title: '审批列表',
        title_en: 'Approve list',
        tab_id: 'approve_list',
        path: 'ApproveList',
      })
    },
    requestFullScreen () {
      this.$h.requestFullScreen(document.body, (isFull) => {
        let cls = ['full-screen-body', 'hidden-header', 'hidden-aside']
        isFull && document.body.classList.add(...cls)
        isFull || document.body.classList.remove(...cls)
      })
    },
    editTheme () {
    },
    onChat () {
      this.$tab.open({
        title: '聊天',
        tab_id: 'chat_page',
        path: 'ChatPage',
      })
    },
    viewNotices () {
      this.$dialog.NoticesList({
        title: '通知中心',
        tab_id: 'notice_list',
        path: 'NoticesList',
      })
    },
    async getUnDeal () {
      let d = await this.$get('/api/system/queryMsgRecord', {status: 'uncommit', page_index: 1, page_size: 1}, {loading: false})
      d = d.sys_msg_records || []
      this.haveUnDeal = !!d.length
    },
  },
  created() {
    this.getUserInfo()
    this.getComInfo()

    setTimeout(() => {
      this.getUnDeal()
    }, 10 * 1000);
    this.$event.$on('updateSysNotices', this.getUnDeal)
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.dj-header {
  background: var(--header-bg-color);
  display: flex;
  justify-content: space-between;
  // border-bottom: 1px solid #eee;
  padding: 0px !important;
  height: auto;
  .a-link {
    color: var(--header-font-color, #409EFF);
  }
  .h-left {
    width: 200px;
  }
  .logo {
    img {
      max-height: 40px;
      max-width: 100%;
      object-fit: contain;
    }
  }
  .avator {
    .el-badge__content {
      top: 12px;
    }
    img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #eee;
    }
    .icon-avatar {
      font-size: 39px;
      vertical-align: middle;
      margin-top: -6px;
    }
  }
  .el-submenu__title {
    height: 50px !important;
    line-height: 50px !important;
  }
  .el-menu-item {
    height: 50px !important;
    line-height: 50px !important;
  }
  .el-menu--horizontal {
    height: 50px;
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    &:hover {
      &::-webkit-scrollbar {
        display: inline-block;
        height: 10px;
      }
      // &::-webkit-scrollbar-track {
      //   background: #faf5f5;
      // }

      // &::-webkit-scrollbar-thumb {
      //   background: #C1C1C1;
      //   border-radius: 2px;
      // }
    }
  }
}
</style>
