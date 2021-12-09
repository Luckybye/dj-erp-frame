<template lang="html">
  <div class="mall-prod-detail">
    <div>
      <div class="mb15 clearfix lh-30">
        <div class="inline-block">配置产品在详情页显示的数据</div>
        <div class="float-right"></div>
      </div>
      <hr class="border mb15" />
      <div class="text-bold text-16 mb20">示例（展示产品详情页示意图）</div>
      <div class="detail ph30">
        <div class="main-info">
          <div class="imgs">
            <div class="big-img ">
              <img :src="(imgList[currentIndex] || {}).url" alt="" />
            </div>
            <div class="img-list">
              <div
                class="i-item"
                v-for="(item, i) in imgList"
                :key="i"
                @click="currentIndex = i">
                <img :src="item.url" alt="" />
              </div>
            </div>
          </div>
          <div class="info ml20">
            <div class="box">
              <div class="title-area">
                <div class="flex-b">
                  <div class="text-grey">标题编辑区</div>
                  <el-button type="primary" @click="setProdDisplay('title')">编辑</el-button>
                </div>
                <div class="title" v-for="item in titleFields" :key="item">
                  {{ item }}
                </div>
              </div>
              <hr />

              <div class="main-area">
                <div class="flex-b">
                  <div class="text-grey">关键信息编辑区</div>
                  <el-button type="primary" @click="setProdDisplay('main')">编辑</el-button>
                </div>
                <div class="flex-1 scroll">
                  <table border="0" class="m-info">
                    <tbody>
                      <template v-for="item in mainFields">
                        <tr class="m-item" :key="item">
                          <td>
                            <span class="t-label">{{ showText(item).en }}</span>
                          </td>
                          <td class="t-text">
                            <div>{{ item }}{{ item }}{{ item }}{{ item }}</div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr />
              <div class="attr-area">
                <div class="flex-b">
                  <div class="text-grey">重要参数编辑区</div>
                  <el-button type="primary" @click="setAttrDisplay">编辑</el-button>
                </div>
                <div class="attr-list">
                  <div class="a-item" :class="'attr'+vm.attr" v-for="i in 4" :key="i">
                    {{ i + 1 }}
                  </div>
                </div>
              </div>

              <div class="bottom">
                <div class="add-cart">
                  <i class="icon beed-iconfont icon-buy"></i>
                  <span class="text">Add to Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="border mv15" />

        <div class="other-info">
          <div class="flex-b mb10">
            <div class="text-grey">商品详情编辑区</div>
            <el-button type="primary" @click="setOtherDisplay()">添加</el-button>
          </div>
          <x-fold
            class="mb10"
            show
            v-for="(item, i) in vm.other"
            :key="i"
            :class="item.data_type">
            <div slot="header" class="flex-b lh-30">
              <span>
                <span class="prod-title lh-30 text-bold text-16 mr20">{{
                  i + 1
                }}</span>
                <i
                  class="el-icon-delete text-17 text-red"
                  @click="onDelOther(i)"></i>
              </span>

              <div>
                <span class="a-link" @click.stop="setOtherDisplay(item)">编辑</span>
              </div>
            </div>
            <div class="">
              <div class="flex-b flex-wrap">
                <div class="display flex-1 mr10">
                  <div class="d-title">
                    {{ item[item.display].lt }}
                    <span class="a-link" @click="selectFields(item, 'f1')">编辑</span>
                  </div>
                  <table>
                    <tbody>
                      <tr v-for="d in onSplit(item[item.display].f1)" :key="d">
                        <td class="text-grey">{{ showText(d).en }}</td>
                        <td>{{ d }}{{ d }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="display flex-1"
                  v-if="item.display === 'd2' || item.display === 'd3'">
                  <div class="d">
                    <div class="d-title">
                      {{ item[item.display].rt }}
                      <span
                        class="a-link ml10"
                        @click="selectFields(item, 'f2')">编辑</span>
                    </div>
                    <table>
                      <tbody>
                        <tr
                          v-for="d in onSplit(item[item.display].f2)"
                          :key="d">
                          <td class="text-grey">{{ showText(d).en }}</td>
                          <td>{{ d }}{{ d }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="d" v-if="item.display === 'd3'">
                    <div class="d-title">
                      {{ item[item.display].rbt }}
                      <span
                        class="a-link ml10"
                        @click="selectFields(item, 'f3')">编辑</span>
                    </div>
                    <table>
                      <tbody>
                        <tr
                          v-for="d in onSplit(item[item.display].f3)"
                          :key="d">
                          <td class="text-grey">{{ showText(d).en }}</td>
                          <td class="">{{ d }}{{ d }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </x-fold>
        </div>

        <hr />
        <div class="feture">
          <div class="flex-b mb10">
            <div class="text-grey">产品特性编辑区</div>
            <el-button type="primary" @click="editFeature()">添加</el-button>
          </div>
          <div class="f-panel">
            <div
              class="f-item lh-30"
              v-for="(item, i) in vm.feature || []"
              v-dragging="{
                item: item,
                list: vm.feature || [],
                group: 'feature',
                draggable: true,
                key: i,
                dragend: 'onSave',
              }"
              :key="i">
              <span class="a-link mr20" @click="editFeature(item)">{{
                item.title
              }}</span>
              <i
                class="el-icon-delete text-17 text-red"
                @click="onDelFeature(i)"></i>
            </div>
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
    this.vm = { ...this.vm, ...(res[field] || selected[field] || selected[type]) }
    if (!Array.isArray(this.vm.other)) this.vm.other = []
  })
}
export default {
  options: { title: '详情', title_en: 'Detail' },
  data() {
    return {
      instance: '',
      vm: {
        title: 'prod_name_en',
        main: 'price,product_weight,moq',
        attr: '22',
        other: [],
        feature: [],
      },
      allFields: [],
      currentIndex: 0,
      imgList: [
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
        {
          url:
            'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/19/1/3/2640963_5c2da90cfe4501cdf5748fbe_4cb7854bf201.jpeg',
        },
      ],
    }
  },
  methods: {
    onSave() {
      let { field, instance } = this
      if (Array.isArray(instance)) instance = instance.find(f => f)
      return this.$configure
        .setValue(field, { [field]: this.vm }, instance)
        .then(res => {
          console.log(res)
        })
    },
    setProdDisplay(f) {
      let { type } = this
      let vm = {
        show_attributes: this.vm[f] || ' ',
        trade_status: 'foreign',
        type,
        title: '商品详情展示信息',
      }
      this.$dialog.SetProdDisplay({ vm }, data => {
        this.vm[f] = data.cata_attributes || ''
        this.onSave()
      })
    },
    selectFields(item, f) {
      let { type } = this
      let vm = {
        show_attributes: item[item.display][f] || ' ',
        trade_status: 'foreign',
        type,
        title: '商品详情展示信息',
      }
      this.$dialog.SetProdDisplay({ vm }, data => {
        item[item.display][f] = data.cata_attributes || ''
        this.onSave()
      })
    },
    setAttrDisplay() {
      let { vm } = this
      this.$dialog.SetAttrDisplay({ vm }, data => {
        Object.assign(this.vm, data)
        this.onSave()
      })
    },
    setOtherDisplay(item) {
      this.$dialog.SetOtherDisplay({ vm: item || {} }, data => {
        if (item) {
          Object.assign(item, data)
        } else this.vm.other.push(data)
        this.onSave()
      })
    },
    onDelOther(i) {
      this.vm.other.splice(i, 1)
      this.onSave()
    },
    showText(id) {
      return this.allFields.find(m => m.id === id) || { en: id }
    },
    onSplit(str) {
      return str.split(',')
    },
    editFeature(item) {
      this.vm.feature || (this.vm.feature = [])
      this.$dialog.EditFeature(
        { vm: item || {}, selected: this.vm.feature },
        data => {
          if (item) {
            Object.assign(item, data)
          } else this.vm.feature.push(data)
          this.onSave()
        }
      )
    },
    onDelFeature(i) {
      this.vm.feature.splice(i, 1)
      this.onSave()
    },
  },
  computed: {
    isOperate() {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    },
    mainFields() {
      return this.vm.main.split(',')
    },
    titleFields() {
      return this.vm.title.split(',')
    },
    field() {
      return this.payload.field || 'mall_prod_detail_display'
    },
    type() {
      return this.payload.type || 'web_detail'
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    console.log('123123123123:', this.payload)
    // this.instance = ''
    initialize.call(this)
  },
}
</script>
<style lang="scss" scoped>
.mall-prod-detail {
  .detail {
    max-width: 1100px;
    margin: 0 auto;
    .main-info {
      display: flex;
      // flex-wrap: wrap;
      justify-content: space-between;
      .imgs {
        position: relative;
        max-width: 500px;
        // flex: 1;
        .img-list {
          margin-top: 20px;
          overflow: hidden;
          overflow-x: auto;
          position: relative;
          display: flex;
          .i-item {
            border: 1px solid #e1e1e1;
            margin-right: 10px;
            img {
              object-fit: cover;
              width: 98px;
              height: 98px;
            }
          }
        }
        .big-img {
          padding-top: 100%;
          position: relative;
          height: 0;
          min-width: 280px;
          border: 1px solid #eeeeee;
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
      .info {
        width: 100%;
        max-width: 400px;
        position: relative;
        .box {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-content: space-between;
          justify-content: space-between;
        }
        .title {
          display: block;
          font-size: 20px;
          font-family: Poppins-SemiBold;
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
          margin-bottom: 10px;
        }
        .scroll {
          overflow: hidden;
          overflow-y: auto;
        }
        .m-info {
          width: 100%;
          td {
            line-height: 20px;
            padding: 5px 0;
          }
          .t-label {
            max-width: 100px;
            padding-right: 10px;
            width: auto;
            white-space: nowrap;
            display: inline-block;
            color: grey;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .t-text {
            word-break: break-all;
          }
        }
        .attr-area {
          .attr-list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .a-item {
              width: calc(25% - 5px);
              height: 50px;
              line-height: 50px;
              border: 1px solid #eeeeee;
              text-align: center;
              &.attr22 {
                width: calc(50% - 5px);
              }
            }
          }
        }
        .add-cart {
          margin-top: 10px;
          background: orange;
          height: 35px;
          line-height: 35px;
          text-align: center;
        }
      }
    }
    .other-info {
      table {
        width: 100%;
      }
      .d-title {
        font-weight: 600;
        line-height: 30px;
      }
      .display {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      td {
        padding: 5px;
      }
      .table {
        td {
          border: 1px solid #eeeeee;
        }
      }
      .underline {
        td {
          border-bottom: 1px solid #eeeeee;
        }
      }
    }
  }
}
</style>
