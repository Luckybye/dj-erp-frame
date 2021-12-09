<template lang="html">
  <div class="prod-package">
    <div class="pkg-titles" v-if="showTab">
      <span
        v-for="(pack, i) in cartons"
        :key="i"
        @click.stop="onShowPack(i)"
        class="pkg-title"
        :class="{ 'current-pkg bg-primary': currentIndex === i }"
      >
        {{ pack.pkg_name || "Carton" + (i + 1) }}
        <span class="close-pkg" v-if="cartons.length > 1 && !readonly2">
          <i
            @click.stop="onClosePack(i)"
            class="icon beed-iconfont icon-close"
          ></i>
        </span>
      </span>
      <i
        class="el-icon-circle-plus-outline text-primary text-bold text-18"
        @click.stop="onAddcarton"
        v-if="!readonly2"
      ></i>
    </div>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item :label="isCn ? '包装材料:' : 'Carton Material:'">
          <div class="flex">
            <x-input
              class="flex-1"
              field="pkg_name"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              rule="require"
            ></x-input>
          </div>
        </el-form-item>

        <el-form-item :label="isCn ? '内盒尺寸:' : 'Inner Size:'">
          <div class="flex">
            <span class="text-primary width-15 lh-30 mr5">L:</span>
            <x-input
              width="calc(33% - 30px)"
              field="pkg_size_length"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              type="number"
              class="flex-1"
            ></x-input>
            <span class="text-primary width-15 text-right lh-30 mr5 ml10">W:</span>
            <x-input
              width="calc(33% - 30px)"
              field="pkg_size_width"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              type="number"
              class="flex-1"
            ></x-input>
            <span class="text-primary width-15 text-right lh-30 mr5 ml10">H:</span>
            <x-input
              width="calc(34% - 34px)"
              field="pkg_size_height"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              type="number"
              class="flex-1"
            ></x-input>
            <span class="prod-unit">cm</span>
          </div>
        </el-form-item>

        <el-form-item :label="isCn ? '外箱尺寸:' : 'Outer Size:'">
          <div class="only-one">
            <div class="flex-line">
              <span class="text-primary width-15 lh-30 mr5">L:</span>
              <x-input
                width="calc(33% - 30px)"
                field="carton_size_length"
                :result="carton"
                @blur-change="calcCbm"
                rule="require"
                type="number"
                :disabled="readonly2"
                class="flex-1"
              ></x-input>
              <span class="text-primary width-15 text-right lh-30 mr5 ml10">W:</span>
              <x-input
                width="calc(33% - 30px)"
                field="carton_size_width"
                :result="carton"
                @blur-change="calcCbm"
                rule="require"
                type="number"
                :disabled="readonly2"
                class="flex-1"
              ></x-input>
              <span class="text-primary width-15 text-right lh-30 mr5 ml10">H:</span>
              <x-input
                width="calc(34% - 34px)"
                field="carton_size_height"
                :result="carton"
                @blur-change="calcCbm"
                rule="require"
                type="number"
                :disabled="readonly2"
                class="flex-1"
              ></x-input>
              <span class="prod-unit">cm</span>
            </div>
            <div
              class="text-grey text-12 absolute flex-line"
              style="width:100%"
              v-if="isAnHua"
            >
              <span class="width-15">L:</span>
              <span class="inline-block" style="width:calc(33% - 30px)">{{
                (carton.carton_size_length / 2.54 || 0).toFixed(2)
              }}</span>
              <span class="width-15">W:</span>
              <span class="inline-block" style="width:calc(33% - 30px)">{{
                (carton.carton_size_width / 2.54 || 0).toFixed(2)
              }}</span>
              <span class="width-15">H:</span>
              <span class="inline-block" style="width:calc(33% - 34px)">{{
                (carton.carton_size_height / 2.54 || 0).toFixed(2)
              }}</span>
              <span>inch</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item
          :label="isCn ? '整箱装量:' : 'Carton quantity:'"
        >
          <div class="flex">
            <span class="text-primary lh-30">{{
              isCn ? "内盒装量: " : "Inner: "
            }}</span>
            <x-input
              width="calc(50% - 90px)"
              field="inner_pkg_pcs"
              :result="carton"
              @blur-change="calcCartonNw"
              :disabled="readonly2"
              type="number"
              rule="integer"
              class="flex-1 ml5"
            ></x-input>
            <span class="text-primary lh-30 ml10">{{
              isCn ? "整箱内盒数: " : "Outer: "
            }}</span>
            <x-input
              width="calc(50% - 90px)"
              field="outer_pkg_pcs"
              :result="carton"
              type="number"
              @blur-change="calcCartonNw"
              :disabled="readonly2"
              rule="integer"
              class="flex-1 ml5"
            ></x-input>
            <span class="prod-unit"
              >{{
                (carton.inner_pkg_pcs * 1 || 1) *
                  (carton.outer_pkg_pcs * 1 || 1)
              }}
              {{ viewModel.prod_unit }}</span
            >
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="isCn ? '箱净重:' : 'N.W.:'">
          <div class="flex">
            <x-input
              class="flex-1"
              field="carton_nw"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              type="number"
            ></x-input>
            <span class="prod-unit">KGS</span>
          </div>
        </el-form-item>

        <el-form-item :label="isCn ? '箱毛重:' : 'G.W.:'">
          <div class="flex">
            <x-input
              class="flex-1"
              field="carton_gw"
              :result="carton"
              @blur-change="onSave"
              :disabled="readonly2"
              rule="require"
              type="number"
            ></x-input>
            <span class="prod-unit">KGS</span>
          </div>
        </el-form-item>

        <el-form-item class="ver-t relative loading-qty">
          <span class="auto-carton-btn" title="自动赋值" @click="autoCarton" slot="label">
            {{ isCn ? "排柜数量:" : "Loading Qty:" }}</span
          >
          <div class="flex">
            <div>
              <span class="text-title mb15">20GP: </span>
              <br />
              <span class="text-title">40HC: </span>
            </div>

            <div class="flex-1">
              <x-input
                width="100%"
                field="gp20"
                :result="carton"
                @blur-change="onSave"
                :disabled="readonly2"
                type="number"
                rule="integer"
                class="mb15"
              ></x-input>
              <br />
              <x-input
                width="100%"
                field="hc40"
                :result="carton"
                @blur-change="onSave"
                :disabled="readonly2"
                type="number"
                rule="integer"
              ></x-input>
            </div>

            <div class="prod-unit">
              <div class="text-primary lh-30 mb15">{{ cartonCbm.g20 }}</div>
              <div class="text-primary lh-30">{{ cartonCbm.h40 }}</div>
            </div>

            <div class="ml10">
              <span class="text-title mb15">40GP: </span>
              <br />
              <span class="text-title">CBM: </span>
              <br />
              <span class="text-12 text-grey absolute" v-if="isAnHua"
                >CUFT:
              </span>
            </div>

            <div class="flex-1">
              <x-input
                width="100%"
                field="gp40"
                :result="carton"
                @blur-change="onSave"
                :disabled="readonly2"
                type="number"
                rule="integer"
                class="mb15"
              ></x-input>
              <br />
              <x-input
                width="100%"
                field="cbm"
                :result="carton"
                @blur-change="onSave"
                :disabled="readonly2"
                type="number"
                class=""
              ></x-input>
              <br />
              <span class="text-12 text-grey absolute" v-if="isAnHua"
                >{{ (carton.cbm * 35.3147 || 0).toFixed(3) }}
              </span>
            </div>

            <div class="prod-unit">
              <div class="text-primary lh-30 mb15">{{ cartonCbm.g40 }}</div>
              <div class="text-primary lh-30">{{ cartonCbm.cbm.toFixed(4) }}</div>
            </div>
          </div>

          <div
            class="text-grey text-12">
            (此装柜量为参考数据，请输入实际数据)
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {Formula} from 'dj-model'
let fmt = {
  pkg_name: "",
  inner_pkg_pcs: "",
  outer_pkg_pcs: "",
  carton_weight_unit: "KGS",
  carton_nw: "",
  carton_gw: "",
  prod_size_unit: "cm",
  carton_size_length: "",
  carton_size_width: "",
  carton_size_height: "",
  pkg_size_length: "",
  pkg_size_width: "",
  pkg_size_height: "",
  include_prod: "",
  pkg_id: "",
  gp20: "",
  gp40: "",
  hc40: "",
  cbm: "",
};
function initialize() {
  let self = this;
  if (!self.billId) return;
  let v = {
    id: self.billId,
    collection: self.collection,
    field: "mg_pkgs",
  };
  self.$pull.queryMgbField(v, {loading: false}).then((data) => {
    self.cartons = data.mg_pkgs || [];
    if (!self.cartons.length) {
      self.onAddcarton("no");
    } else {
      self.onShowPack(0);
    }
  });
}
export default {
  data() {
    return {
      carton: { ...fmt },
      cartons: [],
      currentIndex: 0,
    };
  },
  props: {
    showTab: {
      type: Boolean,
      default: true,
    },
    immediateSave: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    initialize,
    calcCbm() {
      let v = this.carton;
      let cbm =
        v.carton_size_length * v.carton_size_width * v.carton_size_height;
      if (cbm) {
        let c = (cbm / 1000000).toFixed(4) * 1;
        v.cbm = v.cbm * 1 || c;
        if (this.prodSetting.calc_cbm) v.cbm = c;
      }
      this.onSave();
    },
    onSave(field) {
      if (!this.immediateSave) return this.$emit("on-change", this.carton);
      return this.save(field);
    },
    async save(field) {
      let params = {
        id: this.billId,
        collection: this.collection,
        key_name: "pkg_id",
        field: "mg_pkgs",
        ...this.carton,
      };
      field === "delete" && (params.$delete = "1");
      await this.$pull.upsertMgbFieldArray(params)
      this.$nextTick(() => {
        this.$set(this.viewModel, 'mg_pkgs', this.cartons)
      })
    },
    onAddcarton(type) {
      if (this.cartons.length) {
        if (!this.$refs.idealForm.doValidate()) {
          this.$message("验证没有通过");
          return;
        }
      }
      let item = { ...fmt, ...this.cartons[0] };
      item.pkg_id = this.$nextId;
      item.include_prod = this.billId;
      item.pkg_name =
        this.viewModel.prod_name_en || this.viewModel.prod_name || "Carton";
      this.cartons.push(item);
      this.currentIndex = this.cartons.length - 1;
      this.onShowPack(this.currentIndex);
      type === "no" || this.onSave();
    },
    onClosePack(i) {
      this.onShowPack(i);
      return this.onSave("delete").then(() => {
        this.cartons.splice(i, 1);
        this.currentIndex = i ? --i : i;
        this.onShowPack(this.currentIndex);
      });
    },
    onShowPack(i) {
      this.currentIndex = i;
      // if (typeof this.cartons[i].cbm === 'undefined') Vue.set(this.cartons[i], 'cbm', '')
      this.cartons[i] = { ...fmt, ...this.cartons[i] };
      this.carton = this.cartons[i] || this.carton;
    },
    // onSelectPackingProd () {
    //   this.$dialog.SelectPackingProd({bill_id: this.billId, select_id: this.carton.include_prod}, (data) => {
    //     this.carton.include_prod = data.bill_prod_id
    //     this.onSave()
    //   })
    // },
    autoCarton() {
      if (this.readonly2) return;
      let v = this.carton;
      let carton = this.cartonCbm;
      v.gp20 = carton.g20;
      v.gp40 = carton.g40;
      v.hc40 = carton.h40;
      v.cbm = carton.cbm;
      this.onSave();
    },
    calcCartonNw() {
      let v = this.viewModel;
      let c = this.carton;
      let nw =
        v.net_weight * (c.inner_pkg_pcs * 1 || 1) * (c.outer_pkg_pcs * 1 || 1);
      if (v.net_weight_unit === "g") nw = nw / 1000;
      if (v.net_weight_unit === "T") nw = nw * 1000;
      nw && (this.carton.carton_nw = nw);
      this.onSave();
    },
  },
  computed: {
    cartonCbm() {
      let v = this.carton;
      let carton = Formula.calcCarton(v);
      // v.gp20 || (v.gp20 = carton.g20)
      // v.gp40 || (v.gp40 = carton.g40)
      // v.hc40 || (v.hc40 = carton.h40)
      return carton;
    },
    isAnHua() {
      return this.$state("me").isAnHua;
    },
    readonly2 () {
      return this.readonly || this.payload.pkg_readonly
    }
  },
  watch: {
    cartons: {
      deep: true,
      handler(n) {
        this.viewModel.mg_pkgs = n;
      },
    },
  },
  created() {
    this.initialize();
  },
  beforeDestroy() {},
};
</script>
<style lang="scss">
.pkg-titles {
  height: 50px;
  // line-height: 50px;
  display: inline-block;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .pkg-title {
    padding: 0 15px;
    font-size: 14px;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
    border-radius: 20px;
    background: #e1e1e1;
    margin-right: 20px;
    display: inline-block;
  }
  .current-pkg {
    color: white !important;
  }
  .close-pkg {
    // line-height: 30px;
    // height: 30px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    & > i:hover {
      border-radius: 50px;
      background: red;
      color: white;
    }
  }
}

.text-title {
  height: 30px;
  white-space: normal;
  // color: #2b234a;
  font-size: 14px;
  // font-weight: 600;
  // width: 50px;
  display: inline-block;
  line-height: 30px;
  margin-right: 5px;
}

.relative {
  position: relative;
}

.auto-carton-btn {
  @extend .text-title;
  width: auto;
  // position: absolute;
  // left: -95px;
  cursor: pointer;
  line-height: 30px;
  padding: 0;
  &:hover {
    color: #6d78e7;
    /*border: 1px solid;*/
    background-color: white;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
    padding: 0 5px;
  }
}

.loading-qty {
  .flex-row > * {
    margin-right: 6px;
  }
}
</style>
