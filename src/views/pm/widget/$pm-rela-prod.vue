<template lang="html">
  <div class="pm-rela-prod">
    <div v-tr-dom>
      <el-button type="primary" @click="onAdd()" icon="el-icon-plus">
      </el-button>
    </div>
    <div class="rela-prod-list flex">
      <div
        class="r-item"
        v-for="(item, i) in datas"
        :key="i"
        v-dragging="{
          item: item,
          list: datas,
          group: 'rela-prod-list',
          draggable: true,
          key: i,
          dragend: 'onSort',
        }"
      >
        <i
          class="el-icon-delete text-17 text-red del-icon"
          @click="onDelete(item, i)"
        ></i>
        <div class="img">
          <img :src="item.main_pic | imgFormat('middle')" alt="" />
        </div>
        <div class="show-attr line-1 mt5">{{ item.prod_name_en || "-" }}</div>
        <div class="show-attr text-grey">{{ item.x_brand_id || "-" }}</div>
        <div class="show-attr">{{ item.model || "-" }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  options: { title: "Relations" },
  data() {
    return {
      datas: [],
    };
  },
  methods: {
    onAdd() {
      let v = {
        selected: [...this.datas, { prod_id: this.payload.prod_id }],
      };
      this.$dialog.SelectPmProd(v, (prods) => {
        this.$post2("/api/product/addProdRelations", {
          prod_id: this.payload.prod_id,
          prod_relations: prods.map((m) => {
            return { relation_prod_id: m.prod_id };
          }),
        }).then((d) => {
          this.onGet();
        });
      });
    },
    onDelete(row, i) {
      this.$post2("/api/product/deleteProdRelation", {
        relation_id: row.relation_id,
      }).then((d) => {
        this.datas.splice(i, 1);
      });
    },
    onGet() {
      this.$get("/api/product/queryProdRelations", {
        prod_id: this.payload.prod_id,
      }).then((d) => {
        this.datas = d.prod_relations || [];
      });
    },
    onSort() {
      this.$post2("/api/product/editProdRelations", {
        prod_id: this.payload.prod_id,
        prod_relations: this.datas.map(({ relation_id }, i) => ({
          relation_id,
          seq_no: i + 1,
        })),
      });
    },
  },
  created() {
    this.onGet();
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
