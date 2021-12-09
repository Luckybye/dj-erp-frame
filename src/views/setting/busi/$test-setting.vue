<template lang="html">
  <div>
    <div class="">
      <div class="flex between mb10">
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="onEdit()"
          ></el-button>
        </div>
      </div>
      <x-table :data="datas">
        <x-table-column label="No." width="50" type="index"></x-table-column>
        <x-table-column label="中文" width="">
          <div slot-scope="{ row }">
            <x-input
            @change="onEdit(row, 'cfg_value')"
            :result="row"
            field="cfg_value"
            width="100%"
            :readonly="!isOperate"></x-input>
          </div>
        </x-table-column>
        <x-table-column label="英文" width="">
          <div slot-scope="{ row }">
            <x-input
            @change="onEdit(row, 'cfg_code')"
            :result="row"
            field="cfg_code"
            width="100%"
            :readonly="!isOperate"></x-input>
          </div>
        </x-table-column>
        <x-table-column label="操作" width="150" v-if="isOperate">
          <template slot-scope="{ row }">
            <i
              class="el-icon-delete text-red delete"
              @click="onDelete(row)"
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
    return {
      datas: []
    }
  },
  methods: {
    initialize () {
      this.queryBusiCfg()
    },
    onEdit (row, field) {
      if (!row) {
        this.datas.push({
          cfg_value: '',
          cfg_code: ''
        })
      } else {
        let para = {cfg_id: row.cfg_id, [field]: row[field]}
        this.$request2('/api/system/editBusiCfg', para._trim()).then(() => {
          if (!row.cfg_id) this.queryBusiCfg()
        })
      }
    },
    queryBusiCfg () {
      this.$request2('/api/system/queryBusiCfg', {}, {loading: true}).then(d => {
        this.datas = d.busi_config || []
      })
    },
    onDelete (row) {
      this.$request2('/api/system/deleteBusiCfg', {cfg_id: row.cfg_id}).then(d => {
        this.queryBusiCfg()
      })
    }
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
