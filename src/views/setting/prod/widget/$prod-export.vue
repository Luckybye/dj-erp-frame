<template lang="html">
  <div class="prod-export">
    <div class="flexed-top flex">
      <el-menu :default-active="active" mode="horizontal" class="flex-1" @select="v => active = v">
        <el-menu-item
          v-for="item in exportTypes"
          :key="item.key"
          :index="item.key"
        >
          {{ $tt(item, 'text') }}
        </el-menu-item>
      </el-menu>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onEdit"
        ></el-button>
      </div>
    </div>

    <x-table :data="datas" draggable @on-drop="onDrop()" rowKey="key">
      <x-table-column type="index" width=""> </x-table-column>
      <x-table-column label="导出内容" width="">
        <span slot-scope="{ row }">{{ row.value.text }}</span>
      </x-table-column>
      <x-table-column label="Excel标题" width="">
        <template slot-scope="{ row }">
          <x-input
            width=""
            field="title"
            :result="row"
            @blur-change="onSave()"
          ></x-input>
        </template>
      </x-table-column>
      <x-table-column label="操作" width="">
        <template slot-scope="{ $index }">
          <i
            class="el-icon-edit-outline text-17 text-blue"
            @click="onEdit()"
          ></i>
          <i
            class="el-icon-delete text-17 text-red ml10"
            @click="onDelete($index)"
          ></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: { title: '产品导出' },
  data() {
    return {
      instance: '',
      exp_cust_prod: [],
      exp_pm_prod: [],
      active: 'exp_pm_prod',
      exportTypes: [
        {
          text: '公司产品导出',
          text_en: 'Company Product Export',
          key: 'exp_pm_prod',
        },
        {
          text: '客户产品导出',
          text_en: 'Customer Product Export',
          key: 'exp_cust_prod',
        },
      ],
    }
  },
  methods: {
    initialize() {
      this.getDisplay('exp_cust_prod')
      this.getDisplay('exp_pm_prod')
    },
    onDrop(field) {
      field = this.active
      this.onSave(field, this[field])
    },
    onDelete(i) {
      let field = this.active
      this[field].splice(i, 1)
      this.onSave(field, this[field])
    },
    onEdit(field) {
      field = this.active
      this.$dialog.SelectProdField(
        { selected: this[field], need_cust: true },
        data => {
          this[field] = data
          this.onSave(field, this[field])
        }
      )
    },
    onSave(field, data) {
      console.log(data, field, 111111)
      field = this.active
      data = data || this[field]
      if (!data) return
      return this.$configure
        .setValue(field, { [field]: data }, this.instance)
        .then(res => {
          console.log(res)
        })
    },
    getDisplay(field) {
      this.$configure.getValue(field, this.instance).then(res => {
        this[field] = (res[field] || []).map(m => {
          m.key = m.value.key
          return m
        })
      })
    },
  },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
    datas () {
      return this[this.active]
    }
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.initialize()
  },
}
</script>
<style lang="scss" scoped></style>
