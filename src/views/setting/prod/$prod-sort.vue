<template lang="html">
  <div class="prod-sort-setting">
    <div class="tab-page-header">
      <span class="left-border-title">
        <t :path="'cmpt.'+componentName">产品分类</t>
      </span>
    </div>
    <div class="flex text-center" style="background-color: #e9ebfc;">
      <div v-for="col in cols" class="flex-1 lh-30" :key="col.text">
        {{ col.text }}
      </div>
    </div>
    <div class="sort-table">
      <div
        v-for="(row, i1) in rows"
        class="flex row"
        v-dragging="{
          item: row,
          list: rows,
          group: 'row',
          draggable: true,
        }"
        :key="row.sort_id"
      >
        <div class="col col1" style="width: 25%">
          <span class="pointer" @click="editSort(row)">
            {{ row.sort_name_en }}({{ row.sort_name }})
            <span class="text-grey">{{ row.sort_code }}</span>
          </span>
        </div>
        <div class="flex-1">
          <div
            class="flex"
            v-for="(col2, i2) in row.children"
            v-dragging="{
              item: col2,
              list: row.children,
              group: 'col2' + i1,
              draggable: true,
            }"
            :key="col2.sort_id"
          >
            <div class="col col2" style="width: 33.33%">
              <span class="pointer" @click="editSort(col2, row)">
                {{ col2.sort_name_en }}({{ col2.sort_name }})
                <span class="text-grey">{{ col2.sort_code }}</span>
              </span>
            </div>
            <div class="flex-1">
              <div
                v-for="(col3, i3) in col2.children"
                class="flex"
                v-dragging="{
                  item: col3,
                  list: col2.children,
                  group: 'col3' + i1 + i2,
                  draggable: true,
                }"
                :key="col3.sort_id"
              >
                <div class="col col3" style="width: 50%">
                  <span class="pointer" @click="editSort(col3, col2)">
                    {{ col3.sort_name_en }}({{ col3.sort_name }})
                    <span class="text-grey">{{ col3.sort_code }}</span>
                  </span>
                </div>
                <div class="flex-1">
                  <div
                    v-for="(col4) in col3.children"
                    v-dragging="{
                      item: col4,
                      list: col3.children,
                      group: 'col4' + i1 + i2 + i3,
                      draggable: true,
                    }"
                    :key="col4.sort_id"
                  >
                    <div class="col col4">
                      <span class="pointer" @click="editSort(col4, col3)">
                        {{ col4.sort_name_en }}({{ col4.sort_name }})
                        <span class="text-grey">{{ col4.sort_code }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="add-icon">
                    <i
                      class="el-icon-circle-plus-outline a-link"
                      @click="addChild(col3)"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="add-icon">
                <i
                  class="el-icon-circle-plus-outline a-link"
                  @click="addChild(col2)"
                ></i>
              </div>
            </div>
          </div>
          <div class="add-icon">
            <i
              class="el-icon-circle-plus-outline a-link"
              @click="addChild(row)"
            ></i>
          </div>
        </div>
      </div>
      <div class="row add-icon">
        <i class="el-icon-circle-plus-outline a-link" @click="addChild()"></i>
      </div>
    </div>
  </div>
</template>
<script>
import {debounce} from "lodash"
export default {
  options: { title: '产品分类', icon: 'icon-set' },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
  },
  data() {
    return {
      rows: [],
      cols: [
        { text: '一级' },
        { text: '二级' },
        { text: '三级' },
        { text: '四级' },
      ],
    }
  },
  methods: {
    addChild(parentNode) {
      let self = this
      console.log(parentNode)
      self.$dialog.SortEdit(
        { title: '新增产品分类', parentNode: parentNode },
        function(node, parentNode, attrs) {
          node.seq_no = parentNode ? ((parentNode.children || []).length + 1) : (this.rows.length + 1)
          self.onSave(node, attrs)
        }
      )
    },
    editSort(node, parentNode) {
      let self = this
      self.$dialog.SortEdit(
        { title: '修改产品分类', child: node, parentNode: parentNode },
        function(data, parent, attrs) {
          if (data) {
            self.onSave(data, attrs)
          } else {
            self.onDelete(node)
          }
        }
      )
    },
    refresh() {
      let self = this
      let p = self
        .$get('/api/product/queryProductSort', {}, { loading: true })
        .then(function(data) {
          self.rows = data.prod_sorts
          console.log(self.rows)
        })
      return p
    },
    initialize() {
      this.refresh()
    },
    onSave(node, attrs) {
      let self = this
      let sort = {
        sort_id: node.sort_id || undefined,
        sort_name: node.sort_name,
        sort_name_en: node.sort_name_en,
        parent_id: node.parent_id,
        sort_code: node.sort_code,
        pic_url: (node.pic_url && node.pic_url.src) || '',
        gross_rate: node.gross_rate,
        sort_type: node.sort_type,
        seq_no: node.seq_no || 1
      }
      let p = self
        .$post2('/api/product/upsertProductSort', sort)
        .then(function(data) {
          self.upsertSortNature(attrs, data.prod_sort || node)
          self.refresh()
          // self.$cache.getAllSort('all', true)
          self.refreshCache()
          return data
        })
      return p
    },
    upsertSortNature(arr, { sort_id }) {
      if (!arr) return this.$Promise.as()
      return this.$post('/api/product/upsertSortNature', {
        sort_id,
        sort_natures: arr.map((m, i) => {
          let { sort_nature_id, nature_id, is_important, is_value } = m
          return {
            sort_nature_id,
            nature_id,
            is_important,
            is_value,
            seq_no: i + 1,
          }
        }),
      })
    },
    onDelete(node) {
      if (node.children && node.children.length) return this.$message('该分类下还有子分类')
      this.$post2('/api/product/deleteProdSort', node)
        .then(() => {
          this.refresh()
          this.$cache.getAllSort('all', true)
        })
    },
    updateCateSort(item) {
      console.log(item.list)
      let prod_sorts = []
      for (let index = 0; index < item.list.length; index++) {
        const element = item.list[index];
        prod_sorts.push({
          seq_no: index + 1,
          sort_id: element.sort_id,
          sort_name: element.sort_name
        })
      }
      this.$post2('/api/product/updateSortSeqNo', {prod_sorts}).then(res => {
        this.refreshCache()
      })
    },
    refreshCache: debounce(function () {
      this.$cache.getAllSort('all', true)
    }, 1000)
  },
  created() {
    this.initialize()
    this.$dragging.$on('dragend', this.updateCateSort)
  },
  beforeDestroy() {
    this.$dragging.$off('dragend', this.updateCateSort)
  },
}
</script>
<style lang="scss">
.prod-sort-setting {
  .sort-table {
    line-height: 25px;
    .dragging {
      position: relative;
      transform: scale(0.9);
      transition: all 0.3s;
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: red;
        opacity: 0.5;
      }
    }
    .row {
      border: 1px solid #e1e1e1;
      border-bottom: 0;
      &:last-child {
        border-bottom: 1px solid #e1e1e1;
      }
      .col {
        align-self: center;
        text-align: center;
        // border-bottom: 1px solid #e1e1e1;
        .pointer {
          color: #6d78e7;
        }
      }
      .flex {
        border-bottom: 1px solid #e1e1e1;
      }
      .flex-1 {
        border-left: 1px solid #e1e1e1;
      }
      .col4 {
        border-bottom: 1px solid #e1e1e1;
      }
    }
    .add-icon {
      padding: 0 10px;
      .icon {
        cursor: pointer;
      }
    }
  }
}
</style>
