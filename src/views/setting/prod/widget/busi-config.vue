<template lang="html">
  <div>
    <div class="flex between mb10">
      <span class="left-border-title" v-if="componentName">{{$t('cmpt.'+componentName)}}</span>
      <div>
        <el-button
          type="danger"
          v-if="isOperate"
          @click="onDefault()"
        >默认设置</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="isOperate"
          @click="onAdd()"
        ></el-button>
      </div>
    </div>
    <x-table :data="datas">
      <x-table-column label="No." width="50" type="index"></x-table-column>
      <x-table-column label="Code" width="">
        <template slot-scope="{ row }">
          <x-input :result="row" field="cfg_code" @blur-change="onSave(row)" :disabled="!isOperate||/^(product|sparepart)$/.test(row.cfg_code)" rule="text_en" class="mv10"></x-input>
        </template>
      </x-table-column>
      <x-table-column label="中文" width="">
        <template slot-scope="{ row }">
          <x-input :result="row" field="cfg_value" @blur-change="onSave(row)"></x-input>
        </template>
      </x-table-column>
      <x-table-column label="英文" width="">
        <template slot-scope="{ row }">
          <x-input :result="row" field="cfg_value_en" @blur-change="onSave(row)"></x-input>
        </template>
      </x-table-column>
      <x-table-column label="操作" width="150" v-if="isOperate">
        <template slot-scope="{ row, $index }">
          <!-- <el-switch
            class="vm"
            v-model="row.status"
            active-value="normal"
            inactive-value="stop"
            @change="changeStatus(row)">
          </el-switch>
          <span class="text-grey vm ml5">{{row.status === 'stop' ? '已禁用' : '已启用'}}</span> -->
          <i class="el-icon-delete text-17 text-red" @click="onDelete(row, $index)"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
let fmt = {
  cfg_value: '',
  cfg_value_en: '',
  cfg_code: '',
  cfg_id: '',
  status: 'normal'
}
function initialize() {
  this.onQuery()
}
export default {
  props: {
    field: {
      type: String,
      required: true
    },
    componentName: String
  },
  data() {
    return {
      datas: [],
    }
  },
  methods: {
    async onDefault () {
      await this.$confirm('确定加入默认设置？', this.$t('dialog_tip'), {type: 'warning'})
      let arr = this.$constant(this.field)
      let obj = this.datas._object('cfg_code')
      arr.forEach(m => {
        let v = obj[m.key]
        let row = {
          cfg_value: m.text,
          cfg_value_en: m.text_en,
          cfg_code: m.key,
        }
        if (v) {
          Object.assign(v, row)
        } else {
          v = row
          this.datas.push(v)
        }
        this.onSave(v)
      })
    },
    async onQuery(opt) {
      let v = await this.$get('/api/system/queryBusiCfg', { cfg_kind: this.field }, opt)
      this.datas = v.busi_config || []
    },
    async onSave(row) {
      if (!row.cfg_code) return
      if (this.datas.find(f => f.cfg_id !== row.cfg_id && f.cfg_code === row.cfg_code)) return this.$message('Code重复')
      let para = Object._merge(fmt, row)._trim()
      para.cfg_kind = this.field
      await this.$post2('/api/system/editBusiCfg', para)
      row.cfg_id || this.onQuery({loading: false})
    },
    onAdd() {
      this.datas.push({...fmt})
    },
    async onDelete ({cfg_id}, i) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/system/deleteBusiCfg', {cfg_id})
      // this.onQuery({loading: false})
      this.datas.splice(i, 1)
    },
  },
  computed: {
    isOperate () {
      return this.$state('isAdmin')
    }
  },
  created() {
    initialize.call(this)
  },
}
</script>
