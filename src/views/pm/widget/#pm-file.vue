<template lang="html">
    <div class="bottom">
      <div v-part-render>
        <ideal-button v-pre skin="blue" icon="tianjia" @click="_self.addComment" width="80px"></ideal-button>
      </div>
      <bill-file
        :bill-id="payload.prod_id || payload.bill_prod_id"
        :collection="payload.bill_prod_id ? 'pi_prods' : 'prod_infos'"
        field="attachment"
        @preview="onPreviewHandle"
        :payload="payload"
        :typeable="true"
        v-ref:bill-file
      ></bill-file>
    </div>
</template>
<script>
  import BillFile from 'views/common/bill-file'
  export default {
    options: {title: 'Document'},
    data () {
      let self = this
      return {
      }
    },
    methods: {
      initialize () {
        this.$refs.billFile.refresh()
      },
      addComment () {
        this.$refs.billFile.addExtraFileAndComment()
      },
      onPreviewHandle (item) {
        let v = {
          ...this.payload,
          ...item
        }
        this.changePart('BillPreview', v)
      }
    },
    components: {
      BillFile
    },
    created () {
    }
  }
</script>
