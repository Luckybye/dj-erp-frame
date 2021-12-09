<template lang="html">
  <div>
    <div class="">
      <div class="flex between mb10">
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addReason()"
          ></el-button>
        </div>
      </div>
      <x-table :data="prod_batch_reasons">
        <x-table-column label="No." width="50" type="index"></x-table-column>
        <x-table-column label="描述" width="">
          <div slot-scope="{ row }">
            <x-input
            @change="saveReason(row)"
            :result="row"
            field="reason"
            width="100%"
            :readonly="!isOperate"></x-input>
          </div>
        </x-table-column>
        <x-table-column label="操作" width="150" v-if="isOperate">
          <template slot-scope="{ row, $index }">
            <i
              class="el-icon-delete text-red delete"
              @click="deleteReason(row, $index)"
            ></i>
          </template>
        </x-table-column>
      </x-table>
    </div>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    const self = this
    let me = self.$state('me')
    return {
      instance: me.com_id,
      prod_batch_reasons: []
    }
  },
  methods: {
    initialize () {
      let ps = []
      ps.push(this.$configure.getValue('prod_batch_reasons', this.instance))
      Promise.all(ps).then(([reasons]) => {
        this.prod_batch_reasons = reasons.prod_batch_reasons || []
      });
    },
    onSave (field, data) {
      return this.$configure.setValue(field, {[field]: data || this[field]}, this.instance).then(res => {
        console.log(res)
      })
    },
    addReason () {
      this.prod_batch_reasons.push({
        reason: ''
      })
    },
    saveReason (row) {
      this.onSave('prod_batch_reasons')
    },
    deleteReason (row, index) {
      this.prod_batch_reasons.splice(index, 1)
      this.onSave('prod_batch_reasons')
    },
  },
  computed: {
    isOperate () {
      let role = this.$state('me').role
      return role === '1' || role === '2'
    }
  },
  created() {
    this.initialize()
  },
}
</script>
