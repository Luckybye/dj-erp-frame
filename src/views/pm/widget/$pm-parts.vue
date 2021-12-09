<template lang="html">
  <div class="pm-parts">
    <div class="mb10">
      <x-upload
        :files="viewModel.mg_side_pic"
        @finish="upsertProduct('mg_side_pic')"
        @delete="upsertProduct('mg_side_pic')"
        :disabled="!isEdit">
      </x-upload>
    </div>

    <div class="mt20">
      <div class="mb10 flex-b">
        <div class="">
          <span class="text-bold text-16 mr10">配件清单</span>
          <el-dropdown @command="handleCommand">
            <el-button
              type="primary"
              width="100px"
              @click="showCheckbox = !showCheckbox"
              >批量操作</el-button
            >
            <el-dropdown-menu slot="dropdown"  v-if="showCheckbox">
              <el-dropdown-item command="onBatchDelete"
                >批量删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <i class="el-icon-refresh lh-30 ml10" @click="queryParts()"></i>
        </div>
        <div class="" v-if="isEdit">
          <span>
            <el-button type="primary" @click="onDownLoad" class="mr10">导出</el-button>
            <x-upload
              width="auto"
              listType="text"
              v-model="tempModel.files"
              @finish="addPartByExcel"
              v-if="
                !importStatus ||
                importStatus === 'over' ||
                importStatus === 'fail'
              "
              :showFileList="false"
              class="mr10"
            >
              <el-button type="primary">Excel导入</el-button>
            </x-upload>
            <span class="text-red lh-30 mr10" v-else>
              {{ importStatus }}...
            </span>
            <span class="a-link text-12 lh-30" @click="viewLogs"
              >查看导入记录</span
            >
          </span>
          <el-button
            type="primary"
            @click="addPart()"
            icon="el-icon-plus"
            class="ml20"
          >
          </el-button>
        </div>
      </div>
      <x-table :data="datas">
        <x-table-column width="50" type="selection" v-if="showCheckbox"></x-table-column>
        <x-table-column label="Pos NO." width="">
          <x-input
            width="90%"
            field="part_no"
            :result="row"
            @blur-change="upsertPart('part_no', row)"
            :disabled="!isEdit"
            slot-scope="{ row }"
          ></x-input>
        </x-table-column>
        <x-table-column label="Spare Parts" width="">
          <x-td-img
            :src="row.main_pic"
            @click="onOpenProd(row)"
            slot-scope="{ row }"
          ></x-td-img>
        </x-table-column>
        <x-table-column label="Item/ERP" width="">
          <div slot-scope="{ row }">
            <div class="" :title="'公司货号' + row.prod_no">
              {{ row.prod_no }}
            </div>
            <div class="text-grey">{{ row.supplier_no }}</div>
          </div>
        </x-table-column>
        <x-table-column label="Description" width="">
          <div class="line-3" slot-scope="{ row }">
            {{ row.prod_name_en || row.prod_name }}
          </div>
        </x-table-column>
        <x-table-column label="Price" width="">
          <div slot-scope="{ row }">
            {{ row.currency | currencyFormat }} {{ row.fob_price }}
          </div>
        </x-table-column>
        <x-table-column label="QTY" width="">
          <x-input
            width="90%"
            field="sub_rate"
            :result="row"
            @blur-change="upsertPart('sub_rate', row)"
            :disabled="!isEdit"
            slot-scope="{ row }"
          ></x-input>
        </x-table-column>
        <x-table-column label="Remark" width="">
          <x-input
            width="90%"
            field="remark"
            :result="row"
            @blur-change="upsertPart('remark', row)"
            :disabled="!isEdit"
            slot-scope="{ row }"
          ></x-input>
        </x-table-column>
        <x-table-column label="Action" width="80" v-if="isEdit">
          <div slot-scope="scope">
            <i
              class="el-icon-delete text-17 text-red"
              @click="onDeletePart(scope.row, scope.$index)"
            ></i>
          </div>
        </x-table-column>
      </x-table>
    </div>
  </div>
</template>
<script>
let fmt = {
  mg_side_pic: [],
};
export default {
  options: { title: "配件" },
  data() {
    return {
      viewModel: this.$h.clone2(fmt),
      datas: [],
      imp_type: "",
      importStatus: "",
      impId: "",
      showCheckbox: false,
      checkboxValue: [],
      refreshTimes: 50,
      tempModel: {
        files: []
      }
    };
  },
  methods: {
    initialize() {
      let ps = [];
      ps = [
        this.$pull.queryProdInfo({ prod_id: this.payload.prod_id }),
        this.queryParts(),
      ];
      return this.$Promise.when(ps).then((prod, part) => {
        prod = prod.prod_info || {};
        this.viewModel = { ...this.viewModel, ...prod };
      });
    },
    queryParts() {
      this.$get(
        "/api/product/queryprodSpareByMainId",
        { main_prod_id: this.payload.prod_id },
        { loading: true }
      ).then((part) => {
        this.datas = part.prod_spares || [];
      });
    },
    upsertProduct(field) {
      let { prod_id } = this.viewModel;
      return this.$pull.upsertProduct({
        prod_id,
        [field]: this.viewModel[field],
      });
    },
    addPart() {
      let v = {
        title: "选择配件",
        selected: this.datas.map((m) => ({ prod_id: m.sub_prod_id })),
        searchVm: { prod_types: ['sparepart'] },
        disabledSearchMap: {prod_types: true}
      };
      this.$dialog.SelectPmProd(v, (prods) => {
        this.$post2("/api/product/addSpareProds", {
          main_prod_id: this.payload.prod_id,
          prod_spare: prods.map((m, i) => {
            return {
              sub_prod_id: m.prod_id,
              part_no: i + this.datas.length + 1,
            };
          }),
        }).then(() => {
          this.queryParts();
        });
      });
    },
    addPartByExcel(files) {
      this.tempModel.files = []
      if (!files || !files[0]) return;
      this.importStatus = "reading";
      let read = () => {
        let pram = {
          import_url: files[0].url,
          imp_type: this.imp_type,
          file_name: files[0].file_name,
        };
        return this.$post2("/api/manage/impExcel", pram, {
          loading: true,
        }).then((res) => {
          return res.impId;
        });
      };
      let queryRst = (id) => {
        return this.$get2("/api/manage/queryImpInfo", { imp_id: id }).then(
          (res) => {
            res = res.imp_result;
            console.log('res:', res)
            if (res && res[0] && res[0].status === "done") {
              return true;
            }
          }
        );
      };
      let imported = (id) => {
        this.$post(
          "/api/product/addSpareProdsByExcel",
          {
            mongo_id: id,
            prod_id: this.payload.prod_id,
            type: "sparepart",
          },
          { loading: true }
        )
          .then(() => {
            this.importStatus = "importing";
            this.impId = id;
            this.$message({
              type: "info",
              message:
                "正在后台导入，你可以离开此页面，稍后可点‘查看导入记录’按钮查看导入结果",
            });
            this.refreshImpStatus(id);
          })
          .catch(() => {
            this.importStatus = "fail";
          });
      };
      read().then((id) => {
        if (!id) {
          this.importStatus = "fail";
          return this.$message("读取失败");
        }
        let i = 0;
        let timer = setInterval(() => {
          if (i >= 20) {
            clearInterval(timer);
            this.importStatus = "fail";
            return this.$message("读取失败");
          }
          queryRst(id)
            .then((bool) => {
              if (bool) {
                clearInterval(timer);
                imported(id);
              }
            })
            .catch(() => clearInterval(timer));
          i++;
        }, 1000);
      });
    },
    refreshImpStatus(id) {
      id = id = this.impId;
      if (!id) return;
      let i = 0;
      let query = () => {
        this.$get("/api/excel/get", { mongo_id: id }).then((res) => {
          if (res.importing === false) {
            this.importStatus = "over";
            this.$message({
              type: "success",
              message: "导入完成",
            });
            this.queryParts();
            let errors = res.data
              .reduce((pre, m, i) => {
                if (m.error) pre.push("第" + (i + 1) + "行" + m.error);
                return pre;
              }, [])
              .join("，");
            if (errors) {
              this.$message({
                message: errors,
                duration: 100000,
              });
            }
          } else {
            if (i >= this.refreshTimes) return this.$message("数据量太大请手动刷新");
            setTimeout(() => {
              query();
            }, 2000);
            i++;
          }
        });
      };
      query();
    },
    onDeletePart({ spare_id }, i) {
      this.$post("/api/product/deleteProdSpare", { prod_spare: [{spare_id}] }).then((res) => {
        this.datas.splice(i, 1);
      });
    },
    handleCommand(f) {
      this[f] && this[f]();
    },
    onBatchDelete() {
      let arr = this.checkboxValue;
      if (!arr.length) return this.$message("请选择商品");
      this.$post("/api/product/deleteProdSpare", {
        prod_spare: arr.map((m) => ({ spare_id: m })),
      }).then((res) => {
        this.checkboxValue = [];
        this.queryParts();
      });
    },
    upsertPart(f, row) {
      let para = {
        spare_id: row.spare_id,
        [f]: row[f],
      };
      this.$post("/api/product/editProdSpare", para, {loading: false});
    },
    onOpenProd(item) {
      // let title = item.x_sub_prod_id || 'prod'
      // let opts = {
      //   name: title,
      //   method: 'PmEdit',
      //   feature: 'blank',
      //   pageId: item.sub_prod_id,
      //   opt: { title, prod_id: item.sub_prod_id, status: item.status },
      //   isActive: false
      // }
      // this.$openPage(opts)
    },
    viewLogs() {
      // this.$openPage({
      //   method: 'ProdUpdate',
      //   feature: 'open',
      //   pageId: this.payload.prod_id + 'ProdUpdate',
      //   opt: {
      //     title: '配件导入记录',
      //     imp_type: this.imp_type
      //   },
      //   isActive: false
      // })
    },
    onDownLoad () {
      let v = {
        field: "prod_spare",
        bill_id: this.payload.prod_id,
        prod_id: this.payload.prod_id,
        main_prod_id: this.payload.prod_id
      };
      this.$get("/x/r.json", v, { loading: true }).then((data) => {
        console.log('data:', data)
        this.$h.download(
          data.url.replace(".json", ".xlsx"),
          '配件清单-' + new Date().getTime() + '.xlsx'
        );
      });
    },
  },
  components: {},
  computed: {
    prodAuth() {
      return this.$store.getters.user_auth.prod_auth || {}
    },
    isEdit() {
      return this.prodAuth.edit_sparepart !== "no";
    },
  },
  created() {
    this.imp_type = "impSparepart_" + this.payload.prod_id;
    this.initialize();
  },
};
</script>
