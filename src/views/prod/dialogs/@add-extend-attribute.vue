<template>
  <el-dialog
    :visible="true"
    width="700px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title" class="flex-b">
      <span class="text-18">增加商品参数</span>
      <span class="mr25">
        <x-input
          :result="searchModel"
          field="fuzzy_value"
          width="200px"
          @blur-change="querySysNature"
          clearable
          prefix-icon="el-icon-search"
        ></x-input>
      </span>
    </div>

    <x-table :data="natures" rowKey="nature_id">
      <x-table-column label="" type="selection">
        <el-checkbox
          v-model="row.x_checked"
          :disabled="row.x_disabled"
          slot-scope="{row}"
        ></el-checkbox>
      </x-table-column>
      <x-table-column label="序号" type="index"></x-table-column>
      <x-table-column label="参数中文" prop="nature_name"> </x-table-column>
      <x-table-column label="参数英文" prop="nature_name_en"> </x-table-column>
    </x-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      natures: [],
      searchModel: {
        fuzzy_value: '',
        status: 'normal',
        nature_kind: 'attribute',
      },
    }
  },
  methods: {
    onConfirm() {
      let selected = this.natures.filter(f => f.x_checked && !f.x_disabled)
      if (!selected.length) return this.onClose()
      this.onCallback(selected).then(() => {
        this.onClose()
      })
    },
    querySysNature() {
      let para = {...this.searchModel}._trim()
      this.$get('/api/system/querySysNature', para).then(res => {
        let map = this.selected._object('nature_id')
        this.natures = (res.sys_natures || []).map(m => {
          m.x_checked = !!map[m.nature_id]
          m.x_disabled = !!map[m.nature_id]
          return m
        })
      })
    },
  },
  computed: {},
  created() {
    this.querySysNature()
  },
}
</script>
