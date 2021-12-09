<template lang="html">
  <div class="pm-price">
    <div class="lh-30">
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="ml20">
        <span class="text-16">配置产品官网价格规则</span>
      </el-checkbox>

      <span class="text-red ml10 text-14">不配置时，默认官网价格配置</span>
    </div>
    <div>

      <el-checkbox-group v-model="vm.x_rules" @change="onUpdateProd">
        <div class="p-item" :key="item.expect" v-for="item in priceRules">
          <el-checkbox
            :label="item.expect"
            :disabled="readonly">
            {{item.text}}
          </el-checkbox>

          <template v-if="item.expect === 'qty_grade'">
            <span class="float-right">
              <el-button type="primary" @click="onAdd()" icon="el-icon-plus">
              </el-button>
            </span>
            <x-table :data="datas">
              <x-table-column label="级别" width="">
                <div slot-scope="{row, $index}">
                  {{ row.seq_no || $index + 1 }}
                </div>
              </x-table-column>
              <x-table-column label="数量区间" width="">
                <div slot-scope="{row, $index}">
                  <x-input
                    width="80px"
                    field="qty_b"
                    :result="row"
                    :disabled="true"
                  ></x-input>
                  <span>—</span>
                  <x-input
                    width="80px"
                    field="qty_e"
                    :result="row"
                    :disabled="readonly"
                    @blur-change="onSave(row, $index)"
                  ></x-input>
                </div>
              </x-table-column>
              <x-table-column label="价格" width="">
                <div slot-scope="{row, $index}">
                  <x-input
                    width="100px"
                    field="price"
                    :result="row"
                    :disabled="readonly"
                    @blur-change="onSave(row, $index)"
                  ></x-input>
                </div>
              </x-table-column>
              <x-table-column label="操作" width="">
                <div slot-scope="{row, $index}">
                  <i
                    class="el-icon-delete text-17 text-red"
                    @click="onDelete($index, row)"
                    v-if="datas.length - 1 === $index"
                  ></i>
                </div>
              </x-table-column>
            </x-table>
          </template>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  options: { title: "价格" },
  data() {
    return {
      datas: [],
      vm: { price_rule: "", x_rules: [] },
      readonly: false,
      checkAll: false,
      priceRules: [
        {text: '数量阶梯价', expect: 'qty_grade', unexpect: ''},
        {text: '客户专属价', expect: 'cust_own', unexpect: ''},
        {text: '客户等级系数 × 售价', expect: 'cust_level', unexpect: ''},
        {text: '采购价 ÷ 客户等级价格系数', expect: 'cust_pu', unexpect: ''},
        {text: '售价', expect: 'fob', unexpect: ''},
      ].reverse()
    };
  },
  methods: {
    initialize() {
      this.$pull.queryProdInfo({ prod_id: this.payload.prod_id }).then((p) => {
        Object.assign(this.vm, p.prod_info || {});
        this.vm.x_rules = this.vm.price_rule._split(',')
      });
    },
    handleCheckAllChange(val) {
      this.vm.x_rules = val ? this.priceRules.map(f => f.expect) : [];
      this.onUpdateProd()
    },
    onUpdateProd() {
      let para = {
        price_rule: this.vm.x_rules.join(','),
        prod_id: this.payload.prod_id,
      };
      this.$pull.upsertProduct(para);
    },
    onAdd() {
      let last = this.datas[this.datas.length - 1];
      if (last && !last.qty_e) return this.$message("请填写完整上一级截至数量");
      this.datas.push({
        price: "",
        qty_b: last ? last.qty_e * 1 + 1 : 0,
        qty_e: "",
      });
    },
    onSave(row, i) {
      if (
        row.qty_e * 1 < row.qty_b * 1 &&
        (i < this.datas.length - 1 || row.qty_e)
      ) return this.$message("截至数量必须大于起始数量");
      if (typeof i === "number") {
        let next = this.datas[i + 1];
        if (next) {
          if (row.qty_e * 1 > next.qty_e * 1) return this.$message("当前截至数量不能大于下一级截至数量");
          next.qty_b = row.qty_e * 1 + 1;
        }
      }
      let p = null;
      let para = {
        prod_id: this.payload.prod_id,
        seq_no: i + 1,
        price: row.price,
        qty_b: row.qty_b,
        qty_e: row.qty_e,
        price_level_id: row.price_level_id,
      };
      if (row.price_level_id) this.$post2("/api/b2b/updateProdPrice", para);
      if (!row.price_level_id) p = this.$post2("/api/b2b/addProdPrice", para);
      p && p.then(this.queryProdPrice);
    },
    onDelete(i, row) {
      let p = this.$Promise.as();
      if (row.price_level_id) {
        p = this.$post2("/api/b2b/deleteProdPrice", {
          price_level_id: row.price_level_id,
        });
      }
      p.then(() => this.datas.splice(i, 1));
    },
    queryProdPrice() {
      this.$get2(
        "/api/b2b/queryProdPrice",
        { prod_id: this.payload.prod_id },
        { loading: false }
      ).then((res) => {
        this.datas = res.prod_prices || [];
      });
    },
  },
  components: {},
  created() {
    this.initialize();
    this.queryProdPrice();
  },
};
</script>
<style lang="scss">
.pm-price {
  .p-item {
    padding: 10px 20px;
    border-top: 1px solid #eee;
  }
}
</style>
