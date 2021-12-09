<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose2"
    :close-on-click-modal="false"
    :modal="false"
    class="sys-update-tip"
  >
    <div
      class=""
      slot="title"
    >
      {{$t('版本更新提示')}}
    </div>
    <div class="d-content">
      <div class="update-info">
        本次更新***
      </div>
      <div class="text-red text-12 mt20">更新完成后会自动刷新</div>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="onConfirm"
        v-if="!updateStatus"
      >{{$t('更新')}}</el-button>
      <span
        class="text-blue"
        v-else
      >{{updateStatus}}</span>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      updateStatus: '',
      timer: null
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      this.updateStatus = '更新中'
      // let [key] = await caches.keys()
      // await caches.delete(key)
      await navigator.serviceWorker
        .getRegistrations()
        .then(function(registrations) {
          let ps = []
          for (let registration of registrations) {
            ps.push(registration.unregister())
          }
          return Promise.all(ps)
        })
      let time = 10
      this.timer = setInterval(() => {
        if (time === 0) {
          clearInterval(this.timer);
          this.onClose();
          location.reload();
        }
        this.updateStatus = `${time--}s后自动刷新`;
      }, 1000);
    },
    onClose2() {
      clearInterval(this.timer);
      this.onClose();
    },
  },
  created() {},
};
</script>

<style lang="scss">
.sys-update-tip {
  width: 500px;
  display: inline-block;
  height: auto;
  top: auto;
  left: auto;
  right: 5px;
  bottom: 5px;
  background-color: rgba(24, 139, 141, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s,
    bottom 0.3s;
  .el-dialog {
    // background: transparent;
    margin: 0;
  }
}
</style>
