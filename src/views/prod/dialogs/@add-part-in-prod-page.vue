<template lang="html">
  <el-dialog
    :visible="true"
    width="800px"
    @close="onClose"
    :close-on-click-modal="false"
    class="add-part-in-prod-page"
  >
    <div slot="title" class="text-blue text-16 text-semibold">
      添加商品属性
    </div>

    <div class="flex wrap">
      <div class="a-item" v-for="item in allFields" :key="item.id">
        <el-dropdown @command="selectPart" class="ml10">
          <div
            @click="selectPart(item.components)"
            class="a-part"
            :class="{
              selected: isSelected(item),
              disabled: isDisabled(item),
            }"
            :title="item.text"
          >
            <span class="line-1">{{ item.text }}</span>
            <span class="ml5" v-if="isSelected(item)">{{
              findIndex(item.components)
            }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" v-if="handleComponents(item).length > 1">
            <el-dropdown-item v-for="part in handleComponents(item)" :key="part.part" :command="part.part">
              {{part.text}}
              <i class="el-icon-check text-red" v-if="isSelected(part)"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
let pkgInfo = [
  {
    key: 'carton_qty',
    text: '整箱量',
    text_en: 'Ctn Qty',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-qty',
  },
  {
    key: 'carton_nw',
    text: '整箱净重',
    text_en: 'Ctn N.W.',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-nw',
  },
  {
    key: 'carton_gw',
    text: '整箱毛重',
    text_en: 'Ctn G.W.',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-gw',
  },
  {
    key: 'carton_cbm',
    text: '整箱体积',
    text_en: 'Ctn CBM',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-cbm',
  },
  {
    key: 'carton_20gp',
    text: '20GP',
    text_en: '20GP',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-20gp',
  },
  {
    key: 'carton_40gp',
    text: '40GP',
    text_en: '40GP',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-40gp',
  },
  {
    key: 'carton_40hc',
    text: '40HC',
    text_en: '40HC',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-40hc',
  },
  {
    key: 'carton_inner_size',
    text: '内盒尺寸',
    text_en: 'Inner Size',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-inner-size',
  },
  {
    key: 'carton_outer_size',
    text: '外箱尺寸',
    text_en: 'Outer Size',
    value: '',
    type: 'number',
    filter: 'pm,pu,sc,qu,meet,inq',
    components: 'carton-outer-size',
  },
]

function initialize() {
  let t = this.billType || 'pm'
  if (t === 'ps') t = 'pm'
  if (t === 'sc-bom' || t === 'order') t = 'sc'
  if (t === 'qu-bom') t = 'qu'
  if (t === 'sd') t = 'sc'
  let arr = window._g.getProdComponents('prod', t)
  arr = arr.concat(this.extend[t] || [])
  arr.sort((a, b) => {
    if (/^\+/.test(a.text) || /^\+/.test(b.text)) {
      return 1
    } else {
      return a.text.localeCompare(b.text, 'zh-CN')
    }
  })
  this.allFields = arr.concat(pkgInfo)
}
export default {
  data() {
    return {
      vm: { title_en: '', title: '', parts: [] },
      allFields: [],
      selectedPart: [],
      extend: {
        pm: [
          {
            text: '商品属性(可销售...)',
            components: [
              {text: '含产品经理', part: 'prod-nature'},
              {text: '不含产品经理', part: 'prod-nature2'},
            ],
          },
          {
            text: '商品参数',
            components: 'extend-attribute',
          },
        ],
      },
    }
  },
  computed: {},
  methods: {
    onConfirm() {
      this.onCallback(this.selectedPart.map(m => ({ part: m }))).then(() => {
        this.onClose()
      })
    },
    selectPart(part) {
      if (Array.isArray(part)) return
      // if (this.selecteds.indexOf(part) >= 0) return
      let i = this.selectedPart.indexOf(part)
      if (i >= 0) {
        this.selectedPart.splice(i, 1)
      } else this.selectedPart.push(part)
    },
    handleComponents(item) {
      if (Array.isArray(item.components)) {
        return item.components
      } else {
        return [{ part: item.components }]
      }
    },
    isSelected(item) {
      let bool = Array.isArray(item.components)
      let findi = p => this.selectedPart.indexOf(p) >= 0
      return (
        (bool && item.components.find(m => findi(m.part))) ||
        (!bool && findi(item.components || item.part))
      )
    },
    isDisabled(item) {
      let bool = Array.isArray(item.components)
      let isSelect = p => this.selecteds.indexOf(p) >= 0
      return Boolean(
        (bool && item.components.find(m => isSelect(m.part))) ||
          (!bool && isSelect(item.components))
      )
    },
    findIndex(part) {
      let findi = p => this.selectedPart.indexOf(p)
      let i
      if (Array.isArray(part)) {
        part.forEach(m => {
          if (findi(m.part) >= 0) i = findi(m.part)
        })
      } else {
        i = findi(part)
      }
      return i + 1
    },
  },
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss">
.add-part-in-prod-page {
  .a-item {
    padding: 5px;
    width: 150px;
    .a-part {
      color: #6d78e7;
      padding: 5px 10px;
      display: flex;
      &.selected {
        background: red;
        color: white;
      }
      &.disabled {
        color: grey;
        // cursor: not-allowed;
      }
    }
  }
}
</style>
