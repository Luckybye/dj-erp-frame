<template>
  <div class="prod-search-config">
    <div class="flex between mb10">
      <span class="left-border-title" v-if="componentName">{{$t('cmpt.'+componentName)}}</span>
      <div>
        <x-input
          v-model="searchText"
          placeholder="输入名称"
          :maxlength="100"
          prefix-icon="el-icon-search"
          width="200px"
          clearable
          ></x-input>
      </div>
    </div>
    <table class="sample-table check">
      <thead>
        <tr>
          <th width="10%"></th>
          <th width="30%">名称</th>
          <th width="60%">说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in fields2" :key="row.key">
          <td @click="onSelectField(row)">
            <span class="radio" :class="{ selected: findIndex(row) >= 0 }">
              {{ findIndex(row) + 1 || '' }}</span
            >
          </td>
          <td>{{ row.text }}/{{ row.text_en }}</td>
          <td>
            {{ row.desc }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getQuery } from '@/views/setting/prod/prod-query.js'
export default {
  options: { title: 'Web产品高级搜索配置' },
  props: {
    prodType: {
      type: String,
      default: 'web',
    },
  },
  data() {
    return {
      instance: '',
      natures: [],
      datas: [],
      fieldsMap: {
        web: 'web_prod_extend_query_config',
        app: 'app_prod_extend_query_config',
        mall: 'mall_prod_extend_query_config',
      },
      searchText: ''
    }
  },
  methods: {
    onSave(field) {
      field = field || this.field
      return this.$configure
        .setValue(field, { [field]: this.datas }, this.instance)
        .then(res => {
          console.log(res)
        })
    },
    getConfig(field) {
      field = field || this.field
      return this.$configure.getValue(field, this.instance).then(res => {
        this.datas = res[field] || []
      })
    },
    querySysNature() {
      return this.$request('/api/system/querySysNature', {
        status: 'normal',
        nature_kind: 'prod',
      }).then(d => {
        this.natures = (d.sys_natures || []).map(m => {
          return {
            text: m.nature_name,
            text_en: m.nature_name_en,
            key: m.nature_id,
            desc: '自定义属性',
          }
        })
      })
    },
    onSelectField(row) {
      let i = this.findIndex(row)
      if (i >= 0) {
        this.datas.splice(i, 1)
      } else this.datas.push(row)
      this.onSave()
    },
    findIndex(row) {
      return this.datas.findIndex(m => m.key === row.key)
    },
  },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
    field() {
      return this.fieldsMap[this.prodType] || this.fieldsMap.web
    },
    fields() {
      return getQuery(this.prodType).concat(this.natures)
    },
    fields2 () {
      let text = this.searchText
      if (!text) return this.fields
      let reg = new RegExp(text, 'i')
      return this.fields.filter(f => {
        return reg.test(f.text) || reg.test(f.text_en) || reg.test(f.desc)
      })
    }
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.getConfig()
    this.querySysNature()
  },
}
</script>

<style scoped lang="scss">
.check {
  line-height: 28px;
  .radio {
    display: inline-block;
    border: 1px solid #c0ccda;
    width: 18px;
    height: 18px;
    // border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    line-height: 18px;
    text-align: center;
    &.selected {
      color: white;
      background: #6d78e7;
    }
  }
}
</style>
