<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title">
      <x-select :result="sort" field="field" :source="sortFields" :map="{label: 'text', value: 'field'}" width="300px" labelWidth="100px" @change="setSortType">
        <t slot="label" path="select_sort_field" colon>选择排序属性</t>
      </x-select>
    </div>
    <div class="d-content">
      <div class="mb10">
        <x-select :result="sort" field="type" :source="sortTypes" :map="{label: 'value', value: 'key'}" width="150px" class="mr10"></x-select>
        <x-input width="150px" field="rule" :result="sort" class="mr10"></x-input>
        <el-button type="primary" @click="onSort()">
          <t path="sort">排序</t>
        </el-button>
        <el-button type="primary" @click="onSort('reverse')">
          <t path="reverse_order">倒序</t>
        </el-button>
      </div>
      <x-table :data="datas" draggable row-key="bill_prod_id">
        <x-table-column width="100">
          <t slot="header" path="original_seq">原来顺序</t>
          <template slot-scope="{row}">
            {{row.pre_no}}
            <!-- {{row.seq_pi || row.seq_qu || (datas.length - $index)}} -->
          </template>
        </x-table-column>
        <x-table-column prop="prod_no">
          <t slot="header" path="">商品名称</t>
          <template slot-scope="{row}">
            <span class="line-4">
              {{row.prod_name_en}}
            </span>
            <div class="text-grey">
              {{row.sell_prod_no || row.prod_no}}
            </div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="">客户货号/PO/型号</t>
          <template slot-scope="{row}">
            <div class="" title="客户货号">{{row.cust_prod_no || '-'}}</div>
            <div class="text-grey" title="客户PO">{{row.cust_po_no || '-'}}</div>
            <div class="" title="型号">{{row.model || '-'}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="sort_field">排序属性</t>
          <template slot-scope="{row}">
            {{dealSortText(row[sort.field]) || '-'}}
          </template>
        </x-table-column>
        <x-table-column v-if="sort.type==='input'">
          <t slot="header" path="edit_seq_no">修改顺序</t>
          <template slot-scope="{row}">
            <x-input width="50px" field="x_seq_pi" :result="row"></x-input>
          </template>
        </x-table-column>
      </x-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm()">{{
        $t("confirm")
      }}</el-button>
      <el-button type="primary" @click="onConfirm('save')" v-if="!disableSave">{{
        $t("save")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      sortFields: [],
      sort: {field: 'model', type: 'letter', rule: 'letter'},
      disableSave: false,
      sortTypes: [
        {key: 'letter', value: '按字母排序', rule: 'letter'},
        {key: 'size', value: '按大小排序', rule: 'size'},
        {key: 'rule1', value: '提取括号数字排序', rule: '\\(([^\\)^\\(]+)\\)'},
        {key: 'rule2', value: '提取数字排序', rule: '[0-9]+'},
        {key: 'rule3', value: '提取字母排序', rule: '[a-zA-Z]+'},
        {key: 'input', value: '手动输入顺序', rule: 'input'},
        {key: 'rule4', value: '自定义排序', rule: ''}
      ]
    };
  },
  computed: {},
  methods: {
    onConfirm(type) {
      let datas = this.datas
      let f = this.type === 'qu' ? 'seq_no' : 'seq_pi'
      if (this.sort.type === 'input') {
        datas = datas.map(m => {
          m[f] = m.x_seq_pi || 0
          return m
        })
        datas.sort((a, b) => a[f] - b[f])
      }
      this.onCallback(datas, type).then(() => {
        this.onClose()
      })
    },
    onSort (type) {
      if (type === 'reverse') return this.datas.reverse()
      if (this.sort.type === 'input') {
        this.datas.sort((a, b) => a.x_seq_pi - b.x_seq_pi)
        return
      }
      let f = this.sort.field
      let deal = (n) => {
        n = this.dealSortText(n)
        if (/size|rule1|rule2/.test(this.sort.type)) n = parseFloat(n) || 0
        return n
      }
      this.datas.sort((a, b) => {
        if (deal(a[f]) > deal(b[f])) return -1
        return 1
      })
    },
    dealSortText (text) {
      let type = this.sort.type
      if (type === 'size') {
        return parseFloat(text)
      } else if (/letter|input/.test(type)) {
        return text
      } else {
        let reg = text.match(new RegExp(this.sort.rule, 'i'))
        if (!reg) return ''
        return reg[1] || reg[0]
      }
    },
    setSortType (item) {
      this.sort.rule = item.rule
    }
  },
  created() {
    this.datas.forEach((f, i) => {
      f.pre_no = i + 1
    })
    this.sortFields = window._g.getVerifyFields('prod', this.type || 'sc').filter(m => {
      return !/^mg_/.test(m)
    })
  },
};
</script>
<style lang="scss">
</style>
