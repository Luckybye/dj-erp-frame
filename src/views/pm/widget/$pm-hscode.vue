<template lang="html">
  <div class="pm-hscode">
    <div v-tr-dom>
      <el-button type="primary" @click="onAdd()" icon="el-icon-plus">
      </el-button>
    </div>
    <div class="country-hscode">
      <x-table :data="datas" tooltip-effect="dark" :page="searchModel" @page-change="refresh">
        <x-table-column width="50">
          <t slot="header" path="no">序号</t>
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.country">国家</t>
          <template slot-scope="{row}">
            <div>
              <el-button type="text" @click="onEdit(row)">{{row.x_country_id}}</el-button>
            </div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.hs_code">海关码</t>
          <template slot-scope="{row}">
            <div>{{row.hs_code}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.tariff">关税率</t>
          <template slot-scope="{row}">
            <div>{{row.tariff}}%</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.vat">增值税率</t>
          <template slot-scope="{row}">
            <div>{{row.vat}}%</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.decl_name">清关名</t>
          <template slot-scope="{row}">
            <div>{{row.decl_name}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.decl_factor">申报要素</t>
          <template slot-scope="{row}">
            <div>{{row.decl_factor}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="action">操作</t>
          <template slot-scope="{row}">
            <el-button type="text" @click="onDelete(row, row.$index)">
              <t path="delete">删除</t>
            </el-button>
          </template>
        </x-table-column>
      </x-table>
    </div>
  </div>
</template>
<script>
export default {
  options: { title: "PmHscode" },
  data() {
    return {
      datas: [],
      searchModel: {
        page_index: 1,
        page_size: 15,
        count: 0,
      }
    };
  },
  methods: {
    onAdd() {
      this.$dialog.EditCountryHscode({prod_id: this.payload.prod_id}, data => {
        this.refresh();
      });
    },
    onEdit(row) {
      this.$dialog.EditCountryHscode({ tempModel: row, prod_id: this.payload.prod_id }, data => {
        this.refresh();
      });
    },
    onDelete(row, i) {
      this.$post2("/api/product/deleteProdCountry", {
        prod_country_id: row.prod_country_id,
      }).then((d) => {
        this.datas.splice(i, 1);
      });
    },
    refresh() {
      this.$get("/api/product/queryProdCountrys", {
        prod_id: this.payload.prod_id,
        ...this.searchModel
      }).then((d) => {
        this.datas = d.prod_countrys || [];
        if ('count' in d) this.searchModel.count = d.count
      });
    },
  },
  created() {
    this.refresh();
  },
};
</script>
<style lang="scss">
.rela-prod-list {
  display: flex;
  flex-wrap: wrap;
  .r-item {
    width: calc(100% / 7);
    padding: 15px;
    position: relative;
    .del-icon {
      position: absolute;
      right: 13px;
      top: 20px;
      cursor: pointer;
      z-index: 1;
    }
    .img {
      width: 100%;
      padding-top: 100%;
      position: relative;
      border: 1px solid #eee;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>