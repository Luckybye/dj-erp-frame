<template lang="html">
  <div class="select-country mb30">
    <div class="s-area" v-for="item in areas" :key="item.area_id">
      <div class="title" @click="selectAll(item)">
        <span class="mr10">{{ $tt(item, 'area_name') }}</span>
        <el-checkbox
          v-model="item.x_checked"
          @change="selectAll(item)">
        </el-checkbox>
      </div>
      <div class="options">
        <el-checkbox
          v-for="country in item.countrys"
          :key="country.id"
          v-model="country.x_checked"
          :disabled="readonly">
          <span class="inline-block text-overflow vt" style="width:100px" :title="country.country_name + ' / ' + country.country_name_en">{{$tt(country, 'country_name')}}</span>
        </el-checkbox>
      </div>
    </div>
    <div style="display:none">触发语言变化{{$t('language_trigger')}}</div>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  props: {
    selected: {
      type: Array,
      default() {
        return [];
      },
    },
    readonly: Boolean
  },
  data() {
    return {
      countrys: [],
      areas: [],
    };
  },
  methods: {
    init() {
      this.$get2("/api/b2b/queryCompanyCountries", {
        country_type: "sell",
      }).then((res) => {
        this.countrys = res.company_countries || [];
        this.handlerAreas();
      });
    },
    selectAll(item) {
      item.x_checked = !item.x_checked;
      item.countrys.forEach((m) => (m.x_checked = item.x_checked));
    },
    save() {
      let pre = this.selected;
      let add = [];
      let del = [];
      let all = [];
      this.countrys.forEach((m) => {
        if (m.x_checked) all.push(m.country_id);
        if (m.x_checked && pre.indexOf(m.country_id) < 0) add.push(m.country_id);
        if (!m.x_checked && pre.indexOf(m.country_id) >= 0) del.push(m.country_id);
      });
      this.$emit("on-save", { add, del, all });
    },
    handlerAreas() {
      let map = {};
      for (let i = 0; i < this.countrys.length; i++) {
        const m = this.countrys[i];
        Vue.set(m, "x_checked", this.selected.indexOf(m.country_id) >= 0);
        if (!map[m.area_name]) map[m.area_name] = { area_name: m.area_name, countrys: [] };
        map[m.area_name].countrys.push(m);
      }
      this.areas = Object.values(map).map((m) => {
        m.x_checked = m.countrys.every((f) => f.x_checked);
        return m;
      });
    },
  },
  computed: {},
  watch: {
    selected() {
      this.handlerAreas();
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss">
.select-country {
  .s-area {
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 10px;
    &:first-child {
      border-top: 1px solid #e1e1e1;
    }
    .title {
      font-size: 14px;
      line-height: 40px;
      font-weight: 600;
      cursor: pointer;
    }
    .options {
      .ideal-radio {
        width: 150px;
        margin-left: 20px;
        .ideal-radio-text {
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          width: calc(100% - 10px);
          white-space: nowrap;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
