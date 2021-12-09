<template lang="html">
  <el-form class="prod-page" :label-width="labelWidth" label-position="left" :class="{ 'b-edit': isEdit }">
    <template v-for="(page, i1) in datas">
      <div
        :key="getKey(page)"
        class="basic-info part-1"
        v-dragging="{
          item: page,
          list: prodPage || [],
          group: 'page',
          draggable: draggable
        }">
        <div class="prod-title" v-if="page.title || page.title_en">
          {{ isCn ? page.title : page.title_en }}
        </div>
        <div
          class="delete-btn delete-1"
          title="删除该模块"
          v-if="isEdit"
          @click="deleteModel(i1)">
          <i class="el-icon-close"></i>
        </div>
        <div class="prod-panel">
          <div
            v-for="(row, i2) in page.parts"
            v-dragging="{
              item: row,
              list: page.parts || [],
              group: 'row' + i1,
              draggable: draggable,
            }"
            :key="getKey(row)"
            class="part-2">
            <div
              class="add-col add-col-2 pointer"
              title="给该行加一列"
              v-if="isEdit"
              @click="addCol(i1, i2)">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
            <div
              class="delete-btn delete-2"
              title="删除该行"
              v-if="isEdit"
              @click="deleteRow(i1, i2)">
              <i class="el-icon-close"></i>
            </div>
            <el-row type="flex" :gutter="30">
              <el-col
                :span="col.span * 1 || 24"
                v-for="(col, i3) in row"
                v-dragging="{
                  item: col,
                  list: row || [],
                  group: 'col' + i1 + i2,
                  draggable: draggable,
                }"
                class="part-3"
                :key="getKey(col)">
                <div
                  class="part-4"
                  v-for="(subrow, i4) in handelCol(col)"
                  :key="getKey(subrow)"
                  v-dragging="{
                    item: subrow,
                    list: col.parts || [],
                    group: 'subrow' + i1 + i2 + i3,
                    draggable: draggable,
                  }">
                  <div
                    class="delete-btn delete-4"
                    title="删除该模块"
                    v-if="isEdit"
                    @click="deletePart(i1, i2, i3, i4)">
                    <i class="el-icon-close"></i>
                  </div>
                  <!-- 商品模块 -->
                  <component
                    :is="handelPart(subrow.part).part"
                    :view-model="viewModel"
                    :is-cn="isCn"
                    @on-save="onSaveInner"
                    :bill-id="billId"
                    :payload="payload"
                    :readonly="readonly"
                    :approving="approving"
                    :extend-arr="extendArr"
                    :natureid="handelPart(subrow.part).id"
                    :bill-type="billType"
                    :collection="collection"
                    :prod-setting="prodSetting2"
                    :disabledMap="payload.disabledMap">
                  </component>
                </div>

                <div
                  class="flex center middle mt10"
                  v-if="isEdit">
                  <x-select  :source="spanArr" :map="{label: 'text', value: 'value'}" width="80px" v-model="prodPage[i1].parts[i2][i3].span" size="mini"></x-select>
                  <i class="el-icon-circle-plus-outline ml10 add-row-3 pointer vm"
                    title="给该列添加一行"
                    @click="addSubRow(i1, i2, i3)"></i>
                </div>

                <div
                  class="delete-btn delete-3"
                  title="删除该列"
                  v-if="isEdit"
                  @click="delCol(i1, i2, i3)">
                  <i class="el-icon-close"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          class="add-btn add-row-2 a-link"
          v-if="isEdit"
          @click.stop="addRow(i1)">
          添加一行
        </div>
      </div>
    </template>

    <div class="text-center mv30" v-if="!prodPage.length && isEdit">
      <el-button type="primary" @click="addModel">添加模块</el-button>
    </div>
  </el-form>
</template>
<script>
import Vue from "vue";
import Mixins from "./pages/mixins.js";
import Layout from "./layout";
import Components from "./pages";
import { getExtend } from "@/lib/fields/prod-extend.js";

export default {
  mixins: [Mixins],
  components: Components,
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    custType: {
      type: String,
      defulat: ''
    }
  },
  data() {
    return {
      prodPage: [],
      field: "",
      spanArr: [
        {text: '1', text_en: '1', value: '24'},
        {text: '2/3', text_en: '2/3', value: '16'},
        {text: '1/2', text_en: '1/2', value: '12'},
        {text: '1/3', text_en: '1/3', value: '8'},
        {text: '1/4', text_en: '1/4', value: '6'},
      ],
      lazyLoadNum: 1
    };
  },
  computed: {
    datas () {
      return this.prodPage.slice(0, this.lazyLoadNum)
    },
  },
  methods: {
    handelCol(col) {
      if (col.parts) {
        return col.parts;
      } else {
        return [
          {
            span: "24",
            part: col.part || "",
          },
        ];
      }
    },
    deleteModel(i) {
      this.prodPage.splice(i, 1);
    },
    deleteRow(i1, i2) {
      this.prodPage[i1].parts.splice(i2, 1);
    },
    deletePart(i1, i2, i3, i4) {
      let v = this.prodPage[i1].parts[i2];
      if (v[i3].parts) {
        v[i3].parts.splice(i4, 1);
      } else v.splice(i3, 1);
    },
    setPartSpan(opt, i1, i2, i3, i4) {
      let v = this.prodPage[i1].parts[i2];
      if (v[i3].parts) {
        v[i3].span = opt.value
      } else v[i3].span = opt.value
    },
    addModel() {
      this.$dialog.AddModelInProdPage({}, (data) => {
        this.prodPage.push(data);
        this.lazyLoadNum = this.prodPage.length
      });
    },
    addRow(i1) {
      this.$dialog.AddPartInProdPage(
        { billType: this.billType, selecteds: this.getSelected() },
        (data) => {
          this.prodPage[i1].parts.push([{ parts: data }]);
        }
      );
    },
    addCol(i1, i2) {
      this.$dialog.AddPartInProdPage(
        { billType: this.billType, selecteds: this.getSelected() },
        (data) => {
          let v = this.prodPage[i1].parts[i2];
          v.push({ parts: data });
          let ss = v.map(m => (m.span * 1 || 0)).filter(f => f && f !== 24)
          let rest = 24 - ss.reduce((pre, val) => (pre + val), 0)
          let l = v.length - ss.length;
          console.log(rest, l, 'restrestrest', ss)
          v.forEach((m) => {
            if (!m.span || Number(m.span) === 24) Vue.set(m, "span", Math.floor(rest / l) + "");
          });
        }
      );
    },
    addSubRow(i1, i2, i3) {
      this.$dialog.AddPartInProdPage(
        { billType: this.billType, selecteds: this.getSelected() },
        (data) => {
          let v = this.prodPage[i1].parts[i2][i3];
          if (v.parts) {
            v.parts.push(...data);
          } else {
            Vue.set(v, "parts", [{ part: v.part }, ...data]);
            v.part = "";
          }
        }
      );
    },
    delCol (i1, i2, i3) {
      let cols = this.prodPage[i1].parts[i2];
      cols.splice(i3, 1)
      let span = 24 / cols.length + ''
      cols.forEach(m => {
        m.span = m.span || span
      })
    },
    setDefaultTemp(clear) {
      let comId = this.$state("me").com_id;
      this.prodPage = this.$h.clone(Layout(comId)[this.billType || "pm"]);
      this.mergeExtend(this.prodPage);
      if (clear === "clear") this.onSaveTemp({ instance: comId }, clear);
    },
    onSaveTemp(v, c) {
      this.$configure
        .setValue(
          this.field,
          { [this.field]: c === "clear" ? "" : this.prodPage },
          v.instance
        )
        .then(() => {
          this.$message({ type: "success", message: "保存成功" });
        });
    },
    handelPart(part) {
      if (/^extend_/.test(part)) {
        return {
          id: part.replace("extend_", ""),
          part: "extend-nature",
        };
      }
      if (part === 'details') part = 'Details'
      if (part === 'easy-code') part = 'original-item-no'
      return { part };
    },
    mergeExtend(pages) {
      let arr = getExtend();
      let s = this.getSelected();
      arr = arr
        .filter((f) => s.indexOf(f.components) < 0)
        .map((m) => ({ part: m.components }));
      if (!arr.length) return pages;
      let i = pages.findIndex((p) => p.title_en === "Logistics Info");
      if (i < 0) i = pages.length > 2 ? 2 : pages.length;
      let l = arr.length;
      let l1 = Math.ceil(l / 2);
      let parts = [];
      if (l > 1) {
        parts = [
          [
            { span: "12", parts: arr.slice(0, l1) },
            { span: "12", parts: arr.slice(l1, l) },
          ],
        ];
      } else parts = [[arr[0]]];
      this.prodPage.splice(i, 0, {
        title: "自定义属性",
        title_en: "Custom Properties",
        parts,
      });
    },
    getSelected() {
      return this.prodPage.reduce((pre, val) => {
        val.parts.forEach((m) => {
          m.forEach((s) => {
            s.parts && pre.push(...s.parts.map((f) => f.part));
            s.parts || pre.push(s.part);
          });
        });
        return pre;
      }, []);
    },
    lazyLoad () {
      window.requestAnimationFrame(this.addShow)
    },
    addShow () {
      if (this.lazyLoadNum >= this.prodPage.length) return
      this.lazyLoadNum++
      this.lazyLoad()
    },
    getKey (k) {
      this.keyMap || (this.keyMap = new Map())
      if (this.keyMap.has(k)) return this.keyMap.get(k)
      const id = this.$nextId
      this.keyMap.set(k, id)
      return id
    }
  },
  created() {
    let type = this.custType || this.$root.cust_type || ''
    this.$cache.getProdPage(this.billType, type).then(d => {
      this.prodPage = d.pages
      this.field = d.field
      this.lazyLoad()
    })
    this.queryProdSetting();
  },
};
</script>
<style lang="scss">
.prod-page {
  &.b-edit {
    // border: 1px solid grey;
    .basic-info {
      margin: 10px 0;
      position: relative;
    }
    i[class^=el-icon] {
      font-size: 18px;
    }
    .dragging {
      position: relative;
      transform: scale(0.9);
      transition: all 0.5s;
      &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(123, 192, 181, 0.3) !important;
        z-index: 2;
        // opacity: 0.5;
      }
    }
    .add-btn {
      text-align: center;
    }
    .delete-btn {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      z-index: 2;
      &:hover {
        transform: scale(1.2);
        i {
          font-weight: bold;
        }
      }
    }
    .delete-1 {
    }
    .delete-2 {
    }
    .add-col {
      position: absolute;
      right: 5px;
      top: 0px;
      height: 100%;
      z-index: 1;
      display: flex;
      align-items: center;
    }
    .add-row-2 {
      position: absolute;
      width: 100%;
      text-align: center;
      height: 30px;
      line-height: 30px;
      // background: #eaebf3;
    }
    .del-col {
      position: absolute;
      // width: 100%;
      // text-align: center;
      height: 100%;
      // line-height: 30px;
      // background: #eaebf3;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      // border-left: 1px solid #e1e1e1;
    }
    * {
      background: transparent !important;
    }
    .el-button--primary {
      background: #409EFF !important;
    }
    .prod-panel {
      box-shadow: none;
    }
    .el-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    [draggable=true] {
      border-radius: 10px;
      padding: 30px !important;
      position: relative;
    }
    .part-1 {
      background: #eee !important;
    }
    .part-2 {
      background: #e1e1e1 !important;
      margin-bottom: 20px;
    }
    .part-3 {
      background: rgb(214, 211, 211) !important;
      // transform: scale(0.96);
      margin-left: 10px;
      margin-top: 10px;
      &.el-col-16 {
        width: calc(66.66667% - 10px);
      }
      &.el-col-12 {
        width: calc(50% - 10px);
      }
      &.el-col-8 {
        width: calc(33.33333% - 10px);
      }
      &.el-col-6 {
        width: calc(25% - 10px);
      }
    }
    .part-4 {
      background: rgb(194, 189, 189) !important;
      overflow: hidden;
      color: black;
      &+.part-4 {
        margin-top: 10px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: inherit;
        opacity: 0;
      }
    }
  }
}
</style>
