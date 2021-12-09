<template>
  <div class="x-table-card">
    <div class="card-wrap" :style="{'--card-width': cardWidth}">
      <div class="card-item" v-for="(item, i) in data" :key="item[rowKey] || i" :cardStyle="cardStyle">
        <div class="card-img" v-if="imgKey" @click="imgClick(item)">
          <x-img :src="item[imgKey]" :size="size" :preview="false" :fit="fit"></x-img>
        </div>
        <div class="item-info" v-if="fields">
          <div class="f-item mb5 line-1" v-for="(f, ii) in fields" :key="f" :class="{'text-grey': ii%2}">
            {{getValue(f, item)}}
          </div>
        </div>
        <slot name="cell" :row="item" :$index="i"></slot>
        <div class="price-cart flex-b" v-if="hasCart">
          <slot name="price" :row="item" class="price"></slot>
          <div class="cart self-center" v-if="hasCart && rowKey">
            <i class="el-icon-shopping-cart-2 a-link text-17" v-if="cartSelection.indexOf(item[rowKey]) < 0" @click="handlerCart(item)"></i>
            <i class="el-icon-delete d-link text-17" @click="handlerCart(item)" v-else></i>
          </div>
        </div>

        <el-checkbox class="card-check" :value="selection.indexOf(item[rowKey]) >= 0" v-if="checkbox && rowKey" @change="handlerSelection(item)" size="medium"></el-checkbox>
        <div class="card-close" v-if="hasClose" @click="onClose(item)">
          <i class="el-icon-error text-18 d-link"></i>
        </div>
      </div>
    </div>

    <no-data v-if="!data.length"></no-data>
    <div class="fixed-bottom">
      <el-pagination
        v-if="page"
        class="myPagination text-right"
        @size-change="handlePageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="page.page_index"
        :page-sizes="pageSizes"
        :page-size="page.page_size"
        :layout="layout"
        :total="page.count"
        hide-on-single-page>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {getProd} from '@/views/setting/prod-th/setting.js'
import {getExtendApp} from '@/lib/fields/prod-extend.js'
export default {
  data() {
    return {
      cartSelection2: []
    };
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    imgKey: String,
    fields: Array,
    rowKey: [String, Function],
    hasCart: Boolean,
    checkbox: Boolean,
    page: [Object, String, Boolean],
    pagerCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 15, 30, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    cardWidth: String,
    selection: {
      type: Array,
      default () {
        return []
      }
    },
    singleSelect: Boolean,
    hasClose: Boolean,
    filter: {
      type: String,
      default: ''
    },
    cardStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    clickImgSelection: {
      type: Boolean,
      default: false
    },
    fit: String,
    size: {
      type: String,
      default: 'lfit_200'
    }
  },
  computed: {
    cartSelection () {
      let arr = this.cartSelection2.map(m => m[this.rowKey])
      return arr.length ? arr : this.selection
    }
  },
  methods: {
    handleExtend () {
      let extend = getExtendApp('th')
      for (let i = 0; i < extend.length; i++) {
        const m = extend[i];
        m.value = row => {
          let map = row.natureMap || {}
          return this.$tt(map[m.id], 'option_name') || '-'
        }
        this.fieldsMap[m.id] = m
      }
    },
    getFields () {
      this.fieldsMap = getProd(this.filter)._object('id')
      this.handleExtend()
    },
    getValue (f, row) {
      let v = this.fieldsMap
      if (!v || !v[f]) return '-'
      v = v[f]
      if (typeof v.value === 'function') {
        return v.value(row) || '-'
      } else {
        return row[v.value] || '-'
      }
    },
    handlePageSize (d) {
      this.page.page_size = d
      this.handleCurrentChange(this.page.page_index)
    },
    handleCurrentChange (...args) {
      this.$emit('page-change', ...args)
    },
    handlerCart (item) {
      if (!this.checkbox) return this.handlerSelection(item)
      let i = this.cartSelection.indexOf(item[this.rowKey])
      if (i >= 0) {
        this.cartSelection2.splice(i, 1)
      } else {
        if (this.singleSelect) {
          this.cartSelection2 = []
        }
        this.cartSelection2.push(item)
        this.$emit('cart-change', this.cartSelection2)
      }
    },
    handlerSelection (item) {
      let i = this.selection.indexOf(item[this.rowKey])
      if (i >= 0) {
        this.selection.splice(i, 1)
        this.selection2.splice(i, 1)
      } else {
        this.selection2 || (this.selection2 = [])
        if (this.singleSelect) {
          this.selection2 = []
          this.selection = []
        }
        this.selection.push(item[this.rowKey])
        this.selection2.push(item)
        this.$emit('selection-change', this.selection2)
      }
    },
    imgClick (item) {
      if (this.clickImgSelection) this.handlerSelection(item)
      this.$emit('card-click', item)
    },
    onClose (item) {
      this.$emit('close', item)
    },
  },
  created() {
    this.getFields()
  },
};
</script>

<style lang="scss">
.x-table-card {
  --card-width: 200px;
  --gutter: 20px;
  .card-wrap {
    display:flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    margin-left: -20px;
  }
  .card-item {
    background: #FFFFFF;
    border-radius: 16px;
    width: calc(var(--card-width) - var(--gutter));
    margin-left: var(--gutter);
    margin-bottom: var(--gutter);
    border: 1px solid #eee;
    overflow: hidden;
    line-height: normal;
    position: relative;
    &:hover {
      .card-close {
        display: inline;
      }
    }
  }
  .card-img {
    padding-top: 75%;
    height: 0;
    position: relative;
    border-bottom: 1px solid #eee;
    .x-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .item-info {
    padding: 8px;
    padding-bottom: 0;
  }
  .price-cart {
    padding: 8px;
    padding-top: 0;
    i {
      line-height: inherit;
    }
  }
  .card-check, .card-close {
    position: absolute;
    top: 5px;
  }
  .card-check {
    left: 8px;
  }
  .card-close {
    right: 5px;
    display: none;
  }

}
</style>
