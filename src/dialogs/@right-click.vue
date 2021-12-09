<template>
  <div :style="style" v-clickoutside2="onClose">
    <div class="click-item" @click="closeTab" :class="{'dd-link text-grey': homeTab.tab_id === tab.tab_id}">关闭</div>
    <div class="click-item" @click="closeOtherTab">关闭其他</div>
    <div class="click-item" @click="closeAllTab">关闭全部</div>
    <el-divider></el-divider>
    <div class="click-item" @click="requestFullScreen">全屏</div>
    <el-divider></el-divider>
    <div class="click-item" @click="openBlank">从新标签页打开此页签</div>
    <el-divider></el-divider>
    <div class="click-item" @click="refreshTab">刷新</div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
export default {
  components: {},
  data() {
    return {
      style: {},
      reloadInstance: true
    }
  },
  computed: {},
  methods: {
    closeTab () {
      this.$tab.close(this.tab.tab_id)
      this.onClose()
    },
    closeOtherTab () {
      this.$tab.closeOthers(this.tab)
      this.onClose()
    },
    closeAllTab () {
      this.$tab.closeAll()
      this.onClose()
    },
    refreshTab () {
      // console.log(this.tab, 22222222222)
      this.$tab.refresh(this.tab)
      this.onClose()
    },
    openBlank () {
      this.$router.open({
        path: '/tab/' + this.tab.show + '/' + window.encodeURIComponent(Base64.encode(JSON.stringify(this.tab.query || {}))),
        query: {
          window_name: this.tab.tab_id,
        }
      })
      this.onClose()
    },
    requestFullScreen () {
      this.$tab.fullScreen()
      this.onClose()
    },
  },
  created() {
    let e = this.event
    let w = window.innerWidth
    let popperW = 150
    let left = e.pageX
    if (left + popperW >= w) left = w - popperW - 5
    this.style = {
      left: left + 'px',
      top: e.pageY + 'px',
      display: 'inline-block'
    }
  },
};
</script>

<style lang="scss">
.right-click-dialog {
  display: none;
  position: fixed;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: .3s;
  box-shadow: 2px 2px 12px 0 rgba(0,0,0,.3);
  z-index: 5000;
  .click-item {
    line-height: normal;
    padding: 8px 20px;
    width: 150px;
    &:hover {
      background: #eee;
      cursor: pointer;
    }
  }
  .el-divider--horizontal {
    margin: 5px 0;
  }
}
</style>
