<template>
  <div class="menu-edit">
    <div class="me-item flex-b" v-for="(item, i) in subMenus" :key="i">
      <div class="d-title">
        <div :class="['d-icon flex center middle' ,'custom-color color-' + i % 13]">
          <x-icon :icon="item.icon_code" type="sys" size="16px" v-if="item.icon_code"></x-icon>
          <span v-else>{{item.title[0] || ''}}</span>
        </div>
        <div class="ml10">{{$tt(item, 'title')}}</div>
      </div>
      <div class="right-menus flex-1 pt10 pr20">
        <div round v-for="(sub, ii) in item.sub" :key="ii" class="menu-button mb10 ml10" @click="$tab.open(sub)">
          <span class="line-1">{{$tt(sub, 'title')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data () {
    return {
      subMenus: []
    }
  },
  methods: {
  },
  computed: {
  },
  watch: {
  },
  created () {
    let subMenus = this.$h.filterDeep(this.$store.getters.GetUserMenus, 'sub', d => d.menu_id === this.payload.menu_id)[0]
    if (!subMenus) return false
    let v = {...subMenus, sub: []}
    let sub = []
    subMenus.sub.forEach(f => {
      if (!f.sub || !f.sub.length) {
        v.sub.push(f)
      } else sub.push({...f, sub: f.sub._flat('sub')})
    })
    this.subMenus = [...sub]
    if (v.sub.length) this.subMenus.unshift(v)
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.MenuEdit.tab-page {
  box-shadow: none;
  background-color:transparent;
  padding:0;
  .page-shadow {
    display: none;
  }
}
.menu-edit {
  .me-item {
    width: 100%;
    margin-bottom: 20px;
    margin-right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 2px 2px 8px #888888;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
  }
  .d-title {
    font-size: 16px;
    border-right: 1px solid #eee;
    padding: 0 20px;
    display: flex;
    align-items: center;
    color: #333;
    width: 150px;
    flex-shrink: 0;
  }
  .d-icon {
    border-radius: 50%;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    line-height: 28px;
    text-align: center;
    background: var(--color);
    color: #fff;
  }
}
</style>