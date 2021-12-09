<template lang="html">
  <el-form class="prod-page-edit" label-width="90px" label-position="left" :class="{ 'b-edit': isEdit }" v-drag="{group: 'prod-panel', list: datas, invertSwap: true}">
    <template v-for="(page, i1) in datas">
      <x-fold :show="i1 === datas.length - 1" sticky="40"
        :key="page.x_id"
        class="page--fold full mb10"
        ref="xFold">
        <div slot="header" class="prod-title left-border-title">
          {{ $tt(page, 'title') }}
          <span class="ml10" v-if="isEdit" @click="editModel(page)">
            <i class="el-icon-edit-outline text-17 a-link"></i>
          </span>
        </div>
        <div class="prod-panel basic-info part-1" v-drag="{group: 'prod-row', list: page.parts, invertSwap: true, filter: '.ignore-row',}" :style="{'--panel-bg-color': page.bg_color || 'white'}">
          <div
            v-for="(row, i2) in page.parts"
            :key="row.x_id"
            class="part-2">
            <div
              class="add-col add-col-2 pointer"
              title="给该行加一列"
              v-if="isEdit && !page.single"
              @click="addCol(i1, i2)">
              <i class="el-icon-circle-plus-outline a-link"></i>
            </div>
            <div
              class="delete-btn delete-2"
              title="删除该行"
              v-if="isEdit && !page.single"
              @click="onDelete(page.parts, i2)">
              <i class="el-icon-close"></i>
            </div>
            <el-row type="flex" :gutter="30" v-drag="{group: 'prod-col', list: row.parts, invertSwap: true}">
              <el-col
                :span="+col.span || 24"
                v-for="(col, i3) in row.parts"
                class="part-3"
                :key="col.x_id">
                <div
                  class="part-4"
                  v-for="(cell, i4) in col.parts"
                  :key="cell.x_id">
                  <div
                    class="delete-btn delete-4"
                    title="删除该模块"
                    v-if="isEdit && !page.single"
                    @click="onDelete(col.parts, i4)">
                    <i class="el-icon-close"></i>
                  </div>
                  <!-- 商品模块 -->
                  <component
                    :is="cell.x_part"
                    :view-model="viewModel"
                    :is-cn="isCn"
                    @on-save="onSaveInner"
                    :bill-id="billId"
                    :payload="payload"
                    :readonly="true"
                    :approving="approving"
                    :extend-arr="extendArr"
                    :natureid="cell.x_natureid"
                    :bill-type="billType"
                    :collection="collection"
                    :disabledMap="payload.disabledMap"
                    :isEdit="isEdit">
                  </component>
                </div>

                <div
                  class="flex center middle mt10"
                  v-if="isEdit && !page.single">
                  <x-select :source="spanArr" :map="{label: 'text', value: 'value'}" width="80px" v-model="datas[i1].parts[i2].parts[i3].span" size="mini"></x-select>
                  <i class="el-icon-circle-plus-outline a-link ml10 add-row-3 pointer vm"
                    title="给该列添加一行"
                    @click="addPart(i1, i2, i3)"></i>
                </div>

                <div
                  class="delete-btn delete-3"
                  title="删除该列"
                  v-if="isEdit && !page.single"
                  @click="onDelete(row.parts, i3)">
                  <i class="el-icon-close"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div
            class="delete-btn delete-1 ignore-row"
            title="删除该模块"
            v-if="isEdit"
            @click="onDelete(datas, i1)">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div
          class="add-btn add-row-2 a-link"
          v-if="isEdit && !page.single"
          @click.stop="addRow(i1)">
          添加一行
        </div>
      </x-fold>
    </template>

    <div class="text-center mv30" v-if="!datas.length && isEdit">
      <el-button type="primary" @click="addModel">添加模块</el-button>
    </div>
  </el-form>
</template>
<script>
import Mixins from "./pages/mixins.js";
import Components from "./pages";
// import Sortable from 'sortablejs';

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
      datas: [],
      field: "",
      spanArr: [
        {text: '1', text_en: '1', value: 24},
        {text: '2/3', text_en: '2/3', value: 16},
        {text: '1/2', text_en: '1/2', value: 12},
        {text: '1/3', text_en: '1/3', value: 8},
        {text: '1/4', text_en: '1/4', value: 6},
      ],
    };
  },
  computed: {
  },
  methods: {
    onDelete (parts, i) {
      parts.splice(i, 1);
    },
    editModel (vm) {
      this.$dialog.AddModelInProdPage({vm}, (data) => {
        Object.assign(vm, data)
      });
    },
    addModel() {
      let {billType} = this
      this.$dialog.AddModelInProdPage({billType}, (data) => {
        this.datas.push(data);
        this.handlerDatas()
        this.$nextTick(() => {
          setTimeout(() => {
            this.$tab.scrollTo('bottom')
          }, 500)
        })
      });
    },
    addPartInProdPage () {
      return this.$dialog.AddPartInProdPage({ billType: this.billType, selecteds: this.getSelected() })
    },
    async addRow(i1) {
      let data = await this.addPartInProdPage()
      this.datas[i1].parts.push({ parts: data.map(m => ({parts: [m], span: 12})) });
      this.handlerDatas()
    },
    async addCol(i1, i2) {
      let data = await this.addPartInProdPage()
      let v = this.datas[i1].parts[i2].parts;
      if (data.length > 1) {
        v.push(...data.map(m => ({parts: [m], span: 12})))
      } else {
        let span = 24 - v.reduce((pre, val) => (pre += val.span), 0) % 24
        v.push({ parts: data, span});
      }
      this.handlerDatas()
    },
    async addPart(i1, i2, i3) {
      let data = await this.addPartInProdPage()
      let v = this.datas[i1].parts[i2].parts[i3];
      v.parts.push(...data)
      this.handlerDatas()
    },
    handlerDatas () {
      let mapFn = (arr, level) => {
        arr.forEach((f, i) => {
          f.x_id = f.x_id || (level + '-' + i)
          if (f.part && !f.x_part) this.$set(f, 'x_part', this.$h.snake2Camel(f.part))
          if (!f.parts) {
          } else mapFn(f.parts, f.x_id)
        })
      }
      mapFn(this.datas, 'add-')
    },
    async setDefaultTemp(clear) {
      this.datas = await this.$cache.getDfltProdPage(this.billType)
      if (clear === "clear") await this.onSaveTemp(clear);
      this.$cache.getProdPage(this.billType, this.custType || this.$root.cust_type || '', true)
    },
    onSaveTemp(c) {
      let datas = ''
      if (c !== "clear") {
        datas = []
        let mapFn = (arr, d) => {
          arr.forEach((f) => {
            let tt = {...f, parts: [], x_id: undefined, x_path: undefined, x_natureid: undefined, x_part: undefined}
            d.push(tt)
            if (f.parts) {
              mapFn(f.parts, tt.parts)
            } else delete tt.parts
          })
        }
        mapFn(this.datas, datas)
      }
      return this.$configure
        .setValue(
          this.field,
          { [this.field]: datas },
          this.$state("me").com_id
        )
        .then(() => {
          this.$message({ type: "success", message: "保存成功" });
        });
    },
    getSelected() {
      return this.datas.reduce((pre, val) => {
        val.parts.forEach((m) => {
          m.parts.forEach((s) => {
            s.parts && pre.push(...s.parts.map((f) => f.part));
          });
        });
        return pre;
      }, []);
    },
    transferDom ({cb}, i) {
      !this.isEdit && cb && cb(this.$refs.xFold[i].$refs.trDom)
    },
  },
  created() {
    let type = this.custType || this.$root.cust_type || ''
    this.$cache.getProdPage(this.billType, type).then(d => {
      this.datas = d.pages || []
      this.field = d.field
    })
  },
  mounted() {
  }
};
</script>
<style lang="scss">
.prod-page-edit {
  &.b-edit {
    // border: 1px solid grey;
    .x-fold {
      position: relative;
    }
    .basic-info {
      margin: 10px 0;
      position: relative;
    }
    i[class^=el-icon] {
      font-size: 18px;
    }
    .x-fold .fold--header._top {
      z-index: 5;
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
      bottom: 23px;
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
    .part-4 * {
      background: transparent !important;
    }
    .prod-panel {
      --panel-bg-color: white;
      background: var(--panel-bg-color) !important;
      box-shadow: none;
    }
    [class*=part-] {
      border-radius: 10px;
      padding: 20px 50px !important;
      position: relative;
      margin-top: 10px;
    }
    .part-1 {
      background: var(--bg-color);
      // padding-top: 25px !important;
      // .fold--header {
      //   background: #e1e1e1 !important;
      //   margin: 0 !important;
      // }
      // .fold--content {
      //   padding: 0 !important;
      // }
    }
    .part-2 {
      margin-top: 0;
      background: #e1e1e1;
      margin-bottom: 20px;
      padding: 20px 60px !important;
    }
    .part-3 {
      background: rgb(214, 211, 211);
      // transform: scale(0.96);
      margin-left: 10px;
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
      padding: 10px 50px !important;
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
        opacity: 0.3;
        z-index: 1;
      }
    }
    .dragging-class {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: var(--color-orange);
        opacity: 0.1;
      }
    }
  }
  .prod-panel {
    --panel-bg-color: white;
    background: var(--panel-bg-color) !important;
    padding: 10px;
    border-radius: 8px;
    input, textarea, .el-input-group__append, .el-input-group__prepend, .el-table{
      background: transparent !important;
    }
  }
}
</style>
