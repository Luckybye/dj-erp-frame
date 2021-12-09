<template lang="html"><div class="pm-can-sell">
    <div class="mb15 clearfix">
      <div class="text-16 lh-30  inline-block">
        配置当前产品可销国家/地区（未配置则适销所有国家）
      </div>
      <div class="float-right">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <select-country
      :selected="selected"
      ref="selectCountry"
      @on-save="onSave"
      :readonly="readonly"
    ></select-country>
  </div>
</template>
<script>
import selectCountry from "./select-country";
export default {
  options: { title: "可销" },
  data() {
    return {
      canSellCountrys: {},
      selected: [],
      readonly: false
    };
  },
  methods: {
    initialize() {},
    save() {
      this.$refs.selectCountry.save();
    },
    onSave({ add, del }) {
      let para = { prod_id: this.payload.prod_id };
      let ps = [];
      if (add.length) {
        ps.push(
          this.$post2("/api/b2b/addProdSell", { ...para, countries: add })
        );
      }
      if (del.length) {
        ps.push(
          this.$post2("/api/b2b/deleteProdSell", {
            prod_sell_ids: del.map((m) => {
              return this.canSellCountrys[m].prod_sell_id;
            }),
          })
        );
      }
      this.$Promise.when(ps).then(() => {
        this.getProdSell();
        this.$message.success("保存成功");
      });
    },
    getProdSell() {
      this.$get2("/api/b2b/queryProdSell", {
        prod_id: this.payload.prod_id,
      }).then((res) => {
        this.selected = (res.prod_sells || []).map((m) => m.country_id);
        this.canSellCountrys = (res.prod_sells || [])._object("country_id");
      });
    },
  },
  components: {
    selectCountry,
  },
  created() {
    this.getProdSell();
  },
};
</script>
