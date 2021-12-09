<template lang="html">
  <div class="extend-attribute">
    <div class="text-right mb5">
      <i class="el-icon-circle-plus a-link text-18" @click="addNature"></i>
    </div>
    <x-table :data="showNatures">
      <x-table-column width="50">
        <t slot="header" path="no">序号</t>
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </x-table-column>
      <x-table-column width="200">
        <t slot="header" path="prod.attr_name">参数名称</t>
        <template slot-scope="{row}">
          {{row[tm.nature_name]}}
          <!-- <x-input type="number" :result="scope.row" field="sell_quantity" width="100%" :disabled="isTaotai"></x-input> -->
        </template>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="prod.impt_attr">重要参数</t>
        <template slot-scope="{row}">
          {{row.is_important}}
        </template>
      </x-table-column>
      <x-table-column min-width="200">
        <t slot="header" path="prod.attr_val">参数值</t>
        <div slot-scope="{row}" class="flex">
          <span class="text-red inline-block" style="width:6px">{{row.is_value === 'yes' ? '*' : ''}}</span>

          <x-select width="calc(100% - 10px)" @on-save="onSaveSingle" :source="options[row.nature_id] || []" :map="{label:tm.stext,value:tm.svalue}" v-if="row.nature_type === 'single'" :result="row" :field="tm.field" filter="text"></x-select>
          <x-input width="width:calc(100% - 10px)" :field="tm.field" :result="row" @blur-change="onSaveText(row)" :disabled="readonly" clearable v-else>
            <div @click="onTranslate('option_name_en', 'option_name', row, onSaveText)" slot="append" class="translate-icon" v-if="row.is_single !== 'yes' && billId">
              <x-icon icon="translate" colorClass="primary" title="translate" type="svg"></x-icon>
            </div>
          </x-input>
        </div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="operation">操作</t>
        <template slot-scope="scope">
          <div><t class="d-link" path="delete" @click="onDelete(scope.row, scope.$index)" v-if="!scope.row.x_sort">删除</t></div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  data () {
    return {
      showNatures: [],
      options: {},
      natures: ''
    }
  },
  methods: {
    querySortNature () {
      let id = this.viewModel.prod_sort
      // console.log(id, 'querySortNaturequerySortNaturequerySortNature')
      let p = this.$Promise.as({})
      if (id) p = this.$get('/api/product/querySortAttr', {sort_id: id}, {loading: false})
      p.then(res => {
        let sortNatures = res.sys_natures || []
        let obj = {}
        let n = this.natures || this.extendArr || []
        n.sort((a, b) => (a.seq_no || 1000) - (b.seq_no || 1000))
        for (let i = 0; i < n.length; i++) {
          const f = n[i]
          if (f.nature_kind === 'attribute') {
            obj[f.nature_id] = f
          }
        }
        let arr = sortNatures.map(m => {
          let {nature_id, is_important, nature_name, nature_name_en, seq_no, nature_type, is_single, is_value} = m
          /* eslint-disable */
          let {option_name = '', option_name_en = '', prod_nature_id} = obj[nature_id] || {}
          delete obj[nature_id]
          return {
            nature_id, is_important, nature_name, nature_name_en, seq_no, nature_type, is_single,
            option_name, option_name_en, prod_nature_id, is_value,
            x_sort: true
          }
        })
        arr.push(...Object.values(obj))
        this.showNatures = arr
        this.queryNatureOptions()
      })
    },
    addNature () {
      this.$dialog.AddExtendAttribute({selected: this.showNatures}, data => {
        let lastOne = (this.showNatures[this.showNatures.length] || {}).seq_no * 1  || 1000
        let arr = data.map(m => {
          Vue.set(m, 'option_name', '')
          Vue.set(m, 'option_name_en', '')
          // m.option_name = ''
          // m.option_name_en = ''
          m.seq_no = lastOne + 1
          return m
        })
        this.showNatures.push(...arr)
        this.queryNatureOptions()
      })
    },
    onSaveSingle (row, _, item) {
      this.$nextTick(() => {
        row[this.tm.field_en] = item[this.tm.field_en]
        this.save(row)
      })
    },
    onSaveText (row) {
      this.$nextTick(() => {
        if (row.is_single === 'yes') row[this.tm.field_en] = row[this.tm.field]
        this.save(row)
      })
    },
    save (v) {
      let t = this.tm
      let para = {
        nature_id: v.nature_id,
        nature_name: v.nature_name.replace(/^\+/, ''),
        nature_name_en: v.nature_name_en.replace(/^\+/, ''),
        is_single: v.is_single,
        [t.prod_id]: this.billId,
        [t.nature_id]: v[t.nature_id],
        option_name: v.option_name,
        option_name_en: v.option_name_en,
        prod_type: (this.billType || '').toUpperCase(),
        nature_type: v.nature_type,
        nature_kind: v.nature_kind,
        seq_no: v.seq_no
      }
      this.$emit('on-select', para)
      if (!this.billId) return
      this.$post(t.url, para, {loading: !v[t.nature_id]}).then(res => {
        res = res.prod_nature || res.pi_nature || {}
        Vue.set(v, t.nature_id, res[t.nature_id])
      })
    },
    onDelete (row, i) {
      let id = row[this.tm.nature_id]
      let p = this.$Promise.as()
      if (id) p = this.$get2('/api/product/deleteProdNature', {[this.tm.nature_id]: id}, {loading: false})
      p.then(() => {
        this.showNatures.splice(i, 1)
      })
    },
    queryNatureOption ({nature_id}) {
      if (this.options[nature_id]) return
      this.$get('/api/system/queryNatureOption', {nature_id}, {loading: false}).then(res => {
        res = (res.sys_nature_option || []).map(m => {
          m.text = m.option_name + '~' + m.option_name_en
          return m
        })
        res.sort((a, b) => a.option_name_en > b.option_name_en ? 1 : -1)
        Vue.set(this.options, nature_id, res)
      })
    },
    queryNatureOptions () {
      this.$nextTick(() => {
        this.showNatures.forEach(m => {
          if (m.nature_type === 'single') this.queryNatureOption(m)
        })
      })
    },
    queryNature () {
      let t = this.tm
      this.$get(t.query_url, {[t.prod_id]: this.billId}, {loading: false}).then(n => {
        this.natures = n.prod_natures  || n.pi_natures || []
        this.querySortNature()
      })
    }
  },
  computed: {
    tm () {
      let b = this.isCn
      let t = /pm|ps/.test(this.billType)
      return {
        nature_name: b ? 'nature_name' : 'nature_name_en',
        field: b ? 'option_name' : 'option_name_en',
        stext: b ? 'option_name' : 'option_name_en',
        svalue: b ? 'option_name' : 'option_name_en',
        field_en: b ? 'option_name_en' : 'option_name',
        prod_id: t ? 'prod_id' : 'bill_prod_id',
        url: t ? '/api/product/upsertNature' : '/api/business/upsertNature',
        query_url: t ? '/api/product/queryNature' : '/api/business/queryPiNature',
        nature_id: t ? 'prod_nature_id' : 'pi_nature_id'
      }
    }
  },
  created () {
    console.log('extend-attribute')
    this.querySortNature()
    this.$tab.on('prod-load-over', this.querySortNature)
    this.$tab.on('change-prod-sort', this.queryNature)
  },
  mixins: [],
  beforeDestroy () {
    this.$tab.remove('prod-load-over', this.querySortNature)
    this.$tab.remove('change-prod-sort', this.queryNature)
  }
}
</script>
<style>
</style>
