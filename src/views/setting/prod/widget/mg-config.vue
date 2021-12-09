<template lang="html">
  <div>
    <div class="flex between mb10">
      <span class="left-border-title" v-if="componentName">{{ $t('cmpt.' + componentName) }}</span>
      <div>
        <el-button type="danger" v-if="isOperate && defaultOptions" @click="onDefault()"
          >默认设置</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="isOperate"
          @click="addOptions()"
        ></el-button>
      </div>
    </div>
    <x-table :data="prod_setting[field]">
      <x-table-column label="No." width="50" type="index"></x-table-column>
      <x-table-column label="中文" width="">
        <template slot-scope="{ row }">
          <x-input :result="row" field="cn" @blur-change="onSave()"></x-input>
        </template>
      </x-table-column>
      <x-table-column label="英文" width="">
        <template slot-scope="{ row }">
          <x-input :result="row" field="en" @blur-change="onSave()"></x-input>
        </template>
      </x-table-column>
      <x-table-column label="操作" width="150" v-if="isOperate">
        <template slot-scope="{ $index }">
          <i
            class="el-icon-delete text-17 text-red"
            @click="onDelete($index)"
          ></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
let fmt = {
  materials: [],
  packings: [],
  prodUnits: [],
}
function initialize() {
  this.$cache.getProdSetting(true).then(res => {
    this.prod_setting = { ...this.prod_setting, ...res }
  })
}
export default {
  props: {
    field: {
      type: String,
      required: true
    },
    defaultOptions: Array,
    componentName: String
  },
  data() {
    return {
      instance: '',
      prod_setting: this.$h.clone2(fmt),
    }
  },
  methods: {
    async onDefault() {
      await this.$confirm('确定变更为默认设置？', this.$t('dialog_tip'), {
        type: 'warning',
      })
      this.prod_setting[this.field] = this.defaultOptions
      this.onSave()
    },
    addOptions() {
      this.prod_setting[this.field].push({ en: '', cn: '' })
    },
    onSave(field, data) {
      field = field || 'prod_setting'
      return this.$configure
        .setValue(field, { [field]: data || this[field] || '' }, this.instance)
    },
    async onDelete(i) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {
        type: 'warning',
      })
      this.prod_setting[this.field].splice(i, 1)
      this.onSave()
    },
  },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
  },
  created() {
    this.instance = this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
