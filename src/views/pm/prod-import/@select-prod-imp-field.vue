<template>
  <el-drawer
    ref="drawer"
    :visible="true"
    direction="btt"
    @close="onClose"
    :size="450"
    :show-close="false">
    <div slot="title">
      <div class="flex-b">
        <span>选择系统字段</span>
        <div>
          <el-button @click="onClose2">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
      </div>
      <div class="mt10">
        <x-input placeholder="输入字段名、属性名" v-model="searchText" class="text-center" clearable></x-input>
      </div>
    </div>
    <div class="pb40">
      <div class="flex-wrap ph20">
        <div class="p-item text-overflow" :class="{'active': selected === item.key, 'dd-link text-grey': disabled[item.key]}" v-for="item in datas2" :key="item.key" @click="onSelect(item)">
          <span class="text-grey" v-if="/cust_prod/.test(item.table)">Cust-</span>
          <span class="text-grey" v-if="/mg_pkgs/.test(item.key)">包装-</span>
          {{item.text}}/{{item.text_en}}
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {},
  components: {},
  data () {
    return {
      datas: [],
      selected: '',
      searchText: '',
      disabled: {}
    }
  },
  methods: {
    onSelect (item) {
      this.selected = item.key
      // this.onCallback(this.selected).then(this.onClose)
    },
    onConfirm () {
      this.onCallback(this.selected).then(this.onClose2)
    },
    onClose2 () {
      this.$refs.drawer.closeDrawer()
    }
  },
  computed: {
    datas2 () {
      let text = this.searchText
      if (!text) return this.datas
      let reg = new RegExp(text, 'i')
      return this.datas.filter(f => reg.test([f.text, f.text_en].join('~')))
    }
  },
  watch: {
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.select-prod-imp-field-dialog {
  .el-drawer__header {
    margin-bottom: 10px;
    position: sticky;
    top: 0;
    background-color: #fff;
  }
  .p-item {
    width: 240px;
    line-height: 30px;
    border: 1px solid transparent;
    padding: 0 10px;
    cursor: pointer;
    &.active {
      background-color: var(--color-primary);
      color: white !important;
    }
  }
  .el-drawer {
    overflow: auto;
  }
}
</style>