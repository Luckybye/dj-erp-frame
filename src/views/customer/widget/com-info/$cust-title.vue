<template>
  <div class="cust-title">
    <div class="clearfix" v-tr-dom>
      <div class="float-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onEdit()"
          v-if="!disabled"
          size="mini"
          ></el-button>
      </div>
    </div>
    <x-table :data="vm.mg_titles">
      <x-table-column type="index">
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust.short_name">简称</t>
        <template slot-scope="{row}">
          <span class="a-link" :class="{'dd-link': disabled}" @click="onEdit(row)">{{row.short_name || '--'}}</span>
        </template>
      </x-table-column>
      <x-table-column prop="title">
        <t slot="header" path="cust.title">抬头</t>
      </x-table-column>
      <x-table-column prop="consignee">
        <t slot="header" path="cust.consignee">收货人</t>
      </x-table-column>
      <x-table-column prop="title">
        <t slot="header" path="cust.unport">目的港</t>
        <template slot-scope="{row}">
          {{(row.port || {}).port_name}}
        </template>
      </x-table-column>
      <x-table-column v-if="!disabled">
        <t slot="header" path="oprate">操作</t>
        <template slot-scope="scope" width="80">
          <el-button
            type="text"
            class="text-danger"
            @click="onDelete(scope.$index)"
            >{{ $t("delete") }}</el-button>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
import Mixins from "../../pages/mixins";
export default {
  mixins: [Mixins],
  components: {},
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    init() {
    },
    onEdit (row) {
      this.$dialog.EditCrmCustTitle({vm: row || {}}, (data) => {
        if (!row) {
          data.id = this.$nextId
          this.vm.mg_titles.push(data)
        } else Object.assign(row, data)
        this.onSave('mg_titles')
      })
    },
    onDelete (index) {
      this.vm.mg_titles.splice(index, 1)
      this.onSave('mg_titles')
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss">
</style>
