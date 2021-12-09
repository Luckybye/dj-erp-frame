<template>
  <div class="stock-process-setting">
    <div class="flex-b">
      <div class="h-left">
      </div>
      <div class="h-right">
        <el-button type="primary" @click="onAddBtn">
            <t path="add">添加</t>
        </el-button>
      </div>
    </div>
    <x-table :data="datas" class="mt10">
      <x-table-column width="50" type="index">
      </x-table-column>
      <x-table-column>
        <t slot="header" path="set.process_name">进度中文</t>
        <template slot-scope="{row}">
          <x-input v-model="row.process_name" @blur-change="onSave(row)"></x-input>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="set.process_name_en">进度英文</t>
        <template slot-scope="{row}">
          <x-input v-model="row.process_name_en" @blur-change="onSave(row)"></x-input>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="set.process_type">进度类型</t>
        <template slot-scope="{row}">
          <div class="flex">
            <el-radio :label="m.key" v-model="row.process_type" v-for="m in process_types" :key="m.key" @change="onSave(row)">
              {{$tt(m, 'text')}}
            </el-radio>
            <div style="display:none">触发语言变化{{$t('language_trigger')}}</div>
          </div>
        </template>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row, $index}">
          <span class="d-link" @click="onDelete(row, $index)"><t path="delete">删除</t></span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      datas: [],
      searchModel: {
        page_index: 1,
        page_size: 15,
      },
      process_types: [
        {text: '开始', text_en: 'Start', key: 'start'},
        {text: '过程', text_en: 'On going', key: 'ongoing'},
        {text: '完成', text_en: 'End', key: 'end'},
      ]
    };
  },
  methods: {
    init() {
      this.refresh()
    },
    refresh () {
      return this.$get2('/api/manage/queryStockProcess').then(data => {
        this.datas = data.stock_processs || []
        return data
      })
    },
    onAddBtn() {
      this.datas.push({
        seq_no: this.datas.length,
        process_name: '',
        process_name_en: '',
        process_type: 'ongoing'
      })
    },
    onSave(row) {
      if (row) {
        console.log(row)
        if (row.process_type === 'start') {
          this.datas.forEach(item => {
            if (item !== row && item.process_type === 'start') {
              item.process_type = 'ongoing'
              this.editStockProcess(item)
            }
          })
          row.process_type = 'start'
        }
        this.editStockProcess(row)
      }
    },
    editStockProcess (row) {
      if (!row.process_name && !row.process_name_en && !row.process_id) return
      this.$post2('/api/manage/editStockProcess', row).then(res => {
        row.process_id = row.process_id || (res.stock_process || {}).process_id
      })
    },
    onDelete(row, index) {
      if (!row.process_id) return this.datas.splice(index, 1)
      this.$get2('/api/manage/deleteStockProcess', {process_id: row.process_id}).then(res => {
        this.datas.splice(index, 1)
      })
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped></style>
