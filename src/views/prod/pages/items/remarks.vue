<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.remark" colon>备注:</t>
    <div class="flex">
      <x-input :result="remark" field="remark_info" @save="saveRemark" :disabled="readonly" class="flex-1" type="textarea">
      </x-input>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      remark: {
        remark_info: ''
      }
    }
  },
  methods: {
    queryRemarks (vm) {
      if (!this.billId) return
      this.$get('/api/support/queryAllAttach', {
        collection: this.collection,
        id: this.billId,
        field: 'remarks',
      }).then(d => {
        this.remark = {...this.remark, ...(d.remarks || [])[0]}
      })
    },
    saveRemark () {
      this.$post('/api/support/editAttachment', {
        collection: this.collection,
        id: this.billId,
        field: 'remarks',
        ...this.remark
      }).then(d => {
        if (!this.remark.attach_id) this.queryRemarks()
      })
    }
  },
  created () {
    this.queryRemarks()
  },
  mixins: []
}
</script>
<style>
</style>
