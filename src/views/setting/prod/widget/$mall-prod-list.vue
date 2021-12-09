<template lang="html">
  <div class="mall-prod-list">
    <div class="pb30">
      <div class="mb15 clearfix lh-30">
        <div class="inline-block">配置产品在列表页显示的简要数据</div>
        <div class="float-right">
          <el-button
            type="primary"
            @click="setProdDisplay"
          >编辑</el-button>
        </div>
      </div>
      <hr class="border mb15" />
      <div class="text-bold text-16 mb20">示例（展示产品简略信息示意图）</div>
      <div class="prod-item">
        <div class="img">
          <img
            src="http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg"
            alt=""
          />
        </div>
        <template v-for="(item, i) in fields">
          <div
            class="m-item ph10"
            v-if="item !== 'price'"
            :class="{ 'text-grey': i }"
            :key="i"
          >
            {{ showText(item).en }}
          </div>
        </template>
        <div class="price-cart flex-row ph10 m-item">
          <div class="price inline-block" v-if="fields.indexOf('price') >= 0">
            price
          </div>
          <div class="add-cart inline-block pointer">
            <i class="icon beed-iconfont icon-buy"></i>
            <span class="text">Add to Cart</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProd, selected } from '@/lib/setting.js'
import { getExtendApp } from '@/lib/fields/prod-extend.js'
function initialize() {
  let { field, type } = this
  this.allFields = getProd(type).concat(getExtendApp('pm'))
  this.$get('/api/support/getConfigures', {
    field,
    instance: this.instance,
  }).then(res => {
    this.vm = res[field] || selected.web_list
  })
}
export default {
  options: { title: '简略' },
  data() {
    return {
      instance: '',
      vm: '',
      allFields: [],
    }
  },
  methods: {
    onSave() {
      let { field, instance } = this
      if (Array.isArray(instance)) instance = instance[0]
      return this.$configure
        .setValue(field, { [field]: this.vm }, instance)
        .then(res => {
          console.log(res)
        })
    },
    setProdDisplay() {
      let { type } = this
      let vm = {
        show_attributes: this.vm,
        trade_status: 'foreign',
        type,
        title: '商品列表展示信息',
      }
      this.$dialog.SetProdDisplay({ vm }, data => {
        this.vm = data.cata_attributes || ''
        this.onSave()
      })
    },
    showText(id) {
      return this.allFields.find(m => m.id === id) || { en: id }
    },
  },
  computed: {
    isOperate() {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    },
    fields() {
      return this.vm.split(',')
    },
    field() {
      return this.payload.list_field || 'mall_prod_list_display'
    },
    type() {
      return this.payload.type || 'web_list'
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
<style lang="scss" scoped>
.mall-prod-list {
  // background: rgba(245, 245, 245, 1);
  .prod-item {
    background: white;
    width: 300px;
    border-radius: 2px;
    box-shadow: 2px 2px 10px #eeeeee;
    padding-bottom: 10px;
    .img {
      padding-top: 70%;
      height: 0;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .m-item {
      line-height: 22px;
    }
    .price-cart {
      padding-top: 10px;
      font-size: 13px;
      .price {
        width: 70px;
        height: 22px;
        background: orange;
        text-align: center;
      }
      .add-cart {
        border: 1px solid #979797;
        height: 22px;
        border-radius: 10px;
        overflow: hidden;
        font-size: 0;
        .icon-buy {
          color: #979797;
          padding: 0 10px;
          font-size: 12px;
        }
        .text {
          display: inline-block;
          vertical-align: top;
          border-left: 1px solid #979797;
          padding: 0 10px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
