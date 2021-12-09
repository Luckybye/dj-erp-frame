<template>
  <el-container direction="vertical" class="Frame">
    <dj-header></dj-header>
    <el-container class="hidden">
      <dj-aside></dj-aside>
      <dj-main></dj-main>
      <!-- <dj-main ref="djMain2"></dj-main> -->
      <!-- <div class="el-main dj-main">
        <iframe :src="url" frameborder="0" style="height:100%;width:100%"></iframe>
      </div> -->
    </el-container>
    <dj-footer></dj-footer>
  </el-container>
</template>

<script>

export default {
  name: 'Frame',
  components: {
    DjHeader: require('./Header').default,
    DjAside: require('./Aside').default,
    DjFooter: require('./Footer').default,
    DjMain: require('./Main').default
  },
  data () {
    return {
      // url: location.href
    }
  },
  methods: {
    // startObserver () {
    //   const targetNode = this.$refs.djMain1.$el
    //   const config = { characterData: true, characterDataOldValue: true, childList: true, subtree: true, attributes: true };
    //   const observer = new MutationObserver(this.handlerObserver);
    //   observer.observe(targetNode, config);
    // },
    // handlerObserver (mutationsList, observer) {
    //   // console.log(mutationsList, observer, 'mutationsList, observer')
    //   mutationsList.forEach(m => {
    //     if (m.type === 'characterData') {
    //       // let a = m.target
    //       // this.$refs.djMain2.$el.querySelector(m.target)
    //       console.log(m, 1111111)
    //     }
    //   })
    // }
  },
  mounted () {
    // setTimeout(() => {
    //   this.startObserver()
    // }, 10000)
    // boolean childList = false;
    // boolean attributes;
    // boolean characterData;
    // boolean subtree = false;
    // boolean attributeOldValue;
    // boolean characterDataOldValue;
  }
}
</script>

<style lang="scss">
  .Frame {
    height: 100vh;
  }
</style>
