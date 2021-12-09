<template lang="html">
    <div class="bottom">
      <div v-part-render="{layout: 'right'}">
        <ideal-button skin="blue" icon="tianjia" width="80px" @click="_self.addFactory" v-pre></ideal-button>
        <ideal-icon-btn skin="blue" icon="refresh" @click="_self.refresh()" v-pre class="lh-30"></ideal-icon-btn>
      </div>

      <div class="text-blod mb10 text-grey text-16">Supplier Info</div>
      <prod-factory :view-model.sync="viewModel" @on-save="onSaveInner" v-ref:prod-factory :payload="payload"></prod-factory>
    </div>

    <div class="div mt20">
      <div class="text-blod mb10 text-grey text-16">Historical inquiry</div>
      <prod-inq-log :payload="payload" v-ref:prod-inq-log></prod-inq-log>
    </div>
</template>
<script>
  import {onSaveInner} from './widget.js'
  import ProdFactory from 'views/common/prod/prod-factory.vue'
  import ProdInqLog from 'views/common/prod/prod-inq-log.vue'
  function initialize () {
    let self = this
    let ps = []
    ps.push(self.$pull.queryProdInfo({prod_id: self.payload.prod_id}))
    return self.$Promise.when(ps).then(function (p) {
      self.viewModel = p.prod_info
      self.modelReset(self.viewModel, 200)
    })
  }
  export default {
    options: {title: 'Supplier'},
    data () {
      return {
        viewModel: {}
      }
    },
    methods: {
      onSaveInner,
      initialize,
      addFactory () {
        this.$refs.prodFactory.onEditSupplier({})
      },
      onActive () {
        this.$refs.prodFactory.initialize && this.$refs.prodFactory.initialize()
        this.$refs.prodInqLog.initialize && this.$refs.prodInqLog.initialize()
      },
      refresh () {
        this.onActive()
        this.initialize()
      }
    },
    components: {
      ProdFactory,
      ProdInqLog
    },
    created () {
      this.pageEventer.on('changeProdNature', this.initialize)
      initialize.call(this)
    },
    beforeDestroy () {
      this.pageEventer.remove('changeProdNature', this.initialize)
    }
  }
</script>
