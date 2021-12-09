<template lang="html">
  <el-form-item :label="tm.label" class="extend-nature" :labelWidth="labelWidth">
    <slot v-if="!tm.label" name="label" slot="label"></slot>
    <template v-if="/text|textarea/.test(nMap.nature_type)">
      <x-input width="100%" :field="tm.field" :result="vm" @blur-change="onSaveText" :disabled="readonly" clearable :type="nMap.nature_type">
        <div @click="onTranslate('option_name_en', 'option_name', vm, onSaveText)" slot="append" class="translate-icon" v-if="nMap.is_single !== 'yes' && billId">
          <x-icon icon="translate" colorClass="primary" title="translate" type="svg"></x-icon>
        </div>
      </x-input>
    </template>

    <template v-else-if="isMultiple">
      <x-select width="100%" :field="tm.field" :result="tempVm" :source="options" :disabled="readonly" @change="onSaveSelect" :map="{label: tm.stext,value: tm.svalue}" multiple clearable></x-select>
    </template>

    <template v-else-if="!multiple && /single/.test(nMap.nature_type)">
      <x-select width="100%" :field="tm.field" :result="vm" :source="options" :disabled="readonly" @change="onSaveSelect" :map="{label: tm.stext,value: tm.svalue}" clearable></x-select>
    </template>

    <!-- <div style="display:none">触发语言变化{{$t('language_trigger')}}</div> -->
  </el-form-item>
</template>
<script>
import { getNatures } from '@/lib/fields/prod-extend.js'
import Vue from 'vue'
import Mixins from "../mixins";

function initialize () {
  let id = this.natureid
  // console.log(getNatures(), id, 'getNatures()getNatures()')
  this.nMap = getNatures()[id] || this.natureMap || {}
  // 高级搜索是多选
  this.setVm(this.extendArr)
  if (/single|check/.test(this.nMap.nature_type) && !this.isEdit) {
    this.$get('/api/system/queryNatureOption', {nature_id: id}, {loading: false}).then(res => {
      this.options = res.sys_nature_option || []
      this.setOption()
    })
  }
}
let fmt = {option_name: '', option_name_en: ''}
export default {
  props: ['type', 'natureMap', 'multiple'],
  mixins: [Mixins],
  data () {
    return {
      nMap: {},
      vm: {...fmt},
      tempVm: {option_name: [], option_name_en: []},
      options: []
    }
  },
  methods: {
    initialize,
    onSaveText () {
      this.$nextTick(() => {
        if (this.nMap.is_single === 'yes') this.vm[this.tm.field_en] = this.vm[this.tm.field]
        this.save()
      })
    },
    onSaveSelect (v) {
      if (Array.isArray(v)) {
        this.vm.option_name = v.map(m => m.option_name).join(';')
        this.vm.option_name_en = v.map(m => m.option_name_en).join(';')
      } else {
        this.vm.option_name = v.option_name
        this.vm.option_name_en = v.option_name_en
      }
      this.save()
    },
    save () {
      let t = this.tm
      let v = this.vm
      let para = {
        nature_id: this.nMap.nature_id,
        nature_name: this.nMap.nature_name.replace(/^\+/, ''),
        nature_name_en: this.nMap.nature_name_en.replace(/^\+/, ''),
        is_single: this.nMap.is_single,
        [t.prod_id]: this.billId,
        [t.nature_id]: v[t.nature_id],
        option_name: v.option_name || '',
        option_name_en: v.option_name_en || '',
        prod_type: (this.billType || '').toUpperCase(),
        nature_type: this.nMap.nature_type,
        nature_kind: this.nMap.nature_kind
      }
      this.$emit('change', para)
      if (!this.billId) return
      this.$post(t.url, para, {loading: !v[t.nature_id]}).then(res => {
        res = res.prod_nature || res.pi_nature || {}
        Vue.set(this.vm, t.nature_id, res[t.nature_id])
      })
    },
    setOption () {
      if (!this.isMultiple) return
      if (!this.vm.option_name || !this.vm.option_name_en) return
      this.tempVm.option_name = this.vm.option_name.split(';')
      this.tempVm.option_name_en = this.vm.option_name_en.split(';')
    },
    setVm (n) {
      // if (!this.this.natureid) return
      let map = n.find(m => m.nature_id === this.natureid) || fmt
      Object.assign(this.vm, map)
      if (this.isMultiple && this.options.length && map.option_name_en) {
        this.setOption()
      }
    }
  },
  computed: {
    tm () {
      let b = this.isCn
      let m = this.nMap
      let t = /pm|ps/.test(this.billType)
      return {
        label: (b ? m.nature_name : m.nature_name_en) + ':',
        field: b ? 'option_name' : 'option_name_en',
        stext: b ? 'option_name' : 'option_name_en',
        svalue: b ? 'option_name' : 'option_name_en',
        field_en: b ? 'option_name_en' : 'option_name',
        prod_id: t ? 'prod_id' : 'bill_prod_id',
        url: t ? '/api/product/upsertNature' : '/api/business/upsertNature',
        nature_id: t ? 'prod_nature_id' : 'pi_nature_id'
      }
    },
    isMultiple () {
      return this.multiple || this.nMap.nature_type === 'check'
    }
  },
  watch: {
    extendArr: {
      deep: true,
      handler (n) {
        this.setVm(n)
      }
    }
  },
  mounted () {
    this.initialize()
  },
}
</script>
<style lang="scss">
.extend-nature {
}
</style>
