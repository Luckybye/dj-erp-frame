<template lang="html"><div class="pm-can-view">
    <div class="mb15 clearfix">
      <div class="text-16 lh-30 inline-block">
        配置当前产品可见客户或国家/地区（单选）
      </div>
      <!-- <div class="float-right">
        <ideal-button text="保存" skin="blue" @click="save"></ideal-button>
      </div> -->
    </div>
    <div v-for="(item, i) in prod_sees" :key="i" class="mb10">
      <el-row>
        <el-col :span="2">
          <el-checkbox
            border
            v-model="tempModel.prod_see"
            :disabled="readonly || payload.is_publish === 'yes'"
            @change="onChangeType"
            :true-label="item.expect"
            :false-label="item.unexpect"
          ></el-checkbox>
        </el-col>
        <el-col :span="6">
          {{ item.text }}
        </el-col>
        <el-col :span="16">
          {{ item.content }}
        </el-col>
      </el-row>
    </div>
    <div class="mt25" v-if="tempModel.prod_see === 'country'">
      <div class="flex-b mb5">
        <div class="text-16 lh-30">
          配置当前产品可见国家/地区（未配置则所有国家客户均可见）
        </div>
        <div class="">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <select-country
        :selected="selected"
        ref="selectCountry"
        @on-save="onSave"
      ></select-country>
    </div>
  </div>
</template>
<script>
import selectCountry from "./select-country";
export default {
  options: { title: "可见" },
  data() {
    return {
      canSeeCountrys: {},
      selected: [],
      prod_sees: [
        {
          expect: "normal",
          unexpect: "login",
          text: "所有客户(默认)",
          content: "所有客户可见，不论是否登录",
        },
        {
          expect: "login",
          unexpect: "normal",
          text: "登录客户",
          content: "所有客户登录后可见，游客不可见",
        },
        {
          expect: "cust",
          unexpect: "normal",
          text: "指定客户",
          content:
            "指定客户登录可见（即设置此产品为客户专属产品，可在Customer页签直接创建客户产品或为指定客户创建报价/订单），游客不可见",
        },
        {
          expect: "country",
          unexpect: "normal",
          text: "根据国家/地区配置",
          content: "已配置的国家/地区的客户，登录后可见，游客可见",
        },
      ],
      tempModel: {
        prod_see: "normal",
      },
      readonly: false
    };
  },
  methods: {
    initialize() {},
    save() {
      this.$refs.selectCountry.save();
    },
    onSave({ add, del, all }) {
      console.log(add);
      console.log(del);
      console.log(all);
      // let para = { prod_id: this.payload.prod_id };
      // let ps = []
      // if (add.length) ps.push(this.$request2('/api/b2b/addProdSee', {...para, countries: add}))
      // if (del.length) {
      //   ps.push(this.$request2('/api/b2b/deleteProdSee', {prod_see_ids: del.map(m => {
      //     return this.canSeeCountrys[m].prod_see_id
      //   })}))
      // }
      all = all.map((item) => {
        return { country_id: item };
      });
      console.log(all);
      this.$post2("/api/b2b/editProdSee", {
        prod_id: this.payload.prod_id,
        prod_see: all,
      }).then((res) => {
        this.getProdSee();
        this.$message({ message: "保存成功", type: "success" });
      });
    },
    onChangeType() {
      console.log(this.tempModel.prod_see);
      this.$post("/api/product/upsertProduct", {
        prod_id: this.payload.prod_id,
        prod_see: this.tempModel.prod_see,
      }, {loading: false}).then((res) => {
        if (this.tempModel.prod_see === "country") {
          this.getCountry();
        }
      });
    },
    getProdSee() {
      this.$get(
        "/api/product/queryProdInfo",
        { prod_id: this.payload.prod_id },
        { loading: true }
      ).then((res) => {
        this.tempModel.prod_see = res.prod_info.prod_see || "normal";
        if (this.tempModel.prod_see === "country") {
          this.getCountry();
        }
      });
    },
    getCountry() {
      this.$get2("/api/b2b/queryProdSee", {
        prod_id: this.payload.prod_id,
      }, { loading: false }).then((res) => {
        this.selected = (res.prod_sees || []).map((m) => m.country_id);
        this.canSeeCountrys = (res.prod_sees || [])._object("country_id");
      });
    },
  },
  components: {
    selectCountry,
  },
  created() {
    this.getProdSee();
  },
};
</script>
