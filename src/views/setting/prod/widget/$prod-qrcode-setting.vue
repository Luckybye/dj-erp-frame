<template lang="html">
  <div class="prod-qrcode-setting">
    <div class="flex between mb10">
      <span class="left-border-title" v-if="componentName">{{
        $t('cmpt.' + componentName)
      }}</span>
      <div></div>
    </div>
    <div>
      <div class="text-bold">
        提示：此处可配置产品二维码下方需要显示哪些产品信息，过多选择会导致二维码过小而扫码无效，建议选择１～２个
      </div>
      <div class="qrcode-type mb10">
        <div
          class="q-title"
          v-for="(item, i) in qrcode_types"
          :class="{ active: item.type === currentType.type }"
          @click="onViewQrcodeType(item)"
          :key="i"
        >
          <span class="text">模式{{ item.type }}</span>
          <i
            class="el-icon-close d-link lh-30"
            @click.stop="onDelQrcodeType(i, item)"
          ></i>
        </div>
        <i class="el-icon-plus a-link lh-30" @click="onAddQrcodeType()"></i>
        <!-- <ideal-icon-btn icon="tianjia" skin="blue"  style="position: relative; top: 2px;"></ideal-icon-btn> -->
      </div>
      <div class="qrcode-setting">
        <div class="flex wrap" style="width:400px">
          <template v-for="(item, i) in prodFields">
            <div
              style="width:50%"
              v-if="isShow(item.field)"
              :key="currentType.type + '-' + i"
            >
              <x-check
                type="self"
                :display="(selectId.indexOf(item.field) + 1) || ''"
                @change="getSelected(item)"
                v-model="item.x_checked"
                :expect="true"
                :unexpect="false"
                >{{ item.text }}</x-check
              >
            </div>
          </template>
        </div>
        <div class="qrcode flex-1">
          <div class="use lh-30 mv10 text-center">
            <span
              class="text-green"
              v-if="currentType.type === prod_setting.qrcode.type"
              >正在使用</span
            >
            <el-button type="primary" v-else @click="useQrcodeType">使用</el-button>
          </div>
          <el-form label-width="100px" label-position="left">
            <el-form-item label="纸张尺寸">
              <x-input
                width="100px"
                field="page_width"
                :result="currentType"
                @blur-change="onEditQrcodeType"
              ></x-input>
              <span class="mh10 lh-30">x</span>
              <x-input
                width="100px"
                field="page_height"
                :result="currentType"
                @blur-change="onEditQrcodeType"
              ></x-input>
              <span class="lh-30">mm</span>

              <div class="inline-block ml20"
                title="当纸张不是正方形且有背景时，pdf打印时，图片可能不能全部覆盖纸张，设置偏移量，解决覆盖不全问题">
                <span class="mr10 mt10">下偏移量：</span>
                <x-input
                  width="100px"
                  field="page_offset"
                  :result="currentType"
                  @blur-change="onEditQrcodeType"
                ></x-input>mm
              </div>
            </el-form-item>
            <el-form-item label="纸张背景">
              <div class="flex">
                <x-upload width="50px"
                  type="image"
                  accept="image/*"
                  :result="currentType"
                  field="page_bg"
                  only
                  @change="onEditQrcodeType"
                >
                </x-upload>
                <x-input
                  type="textarea"
                  class="flex-1 ml10"
                  field="page_bg"
                  :result="currentType"
                  @blur-change="onEditQrcodeType"
                ></x-input>
              </div>
            </el-form-item>

            <el-form-item label="外部图片">
              <div class="flex mb5">
                <x-upload width="50px"
                  type="image"
                  accept="image/*"
                  :result="currentType"
                  field="out_img"
                  only
                  @change="onEditQrcodeType"
                >
                </x-upload>
                <div class="flex-1 ml10">
                  <x-input
                    width="100%"
                    field="out_img"
                    :result="currentType"
                    @blur-change="onEditQrcodeType"
                  ></x-input>
                  <div>
                    <span class="mr10">位置：</span>
                    <el-checkbox
                      :result="currentType"
                      field="img_position"
                      true-label="top"
                      false-label="center"
                      @change="onEditQrcodeType()"
                      >顶部</el-checkbox
                    >
                    <el-checkbox
                      :result="currentType"
                      field="img_position"
                      true-label="bottom"
                      false-label="center"
                      @change="onEditQrcodeType()"
                      >底部</el-checkbox
                    >
                  </div>
                  <div>
                    <span class="mr10">宽高：</span>
                    <x-input
                      width="100px"
                      field="out_img_w"
                      :result="currentType"
                      @blur-change="onEditQrcodeType"
                    ></x-input>
                    <span class="mh10 lh-30">x</span>
                    <x-input
                      width="100px"
                      field="out_img_h"
                      :result="currentType"
                      @blur-change="onEditQrcodeType"
                    ></x-input>
                    <span class="lh-30">%</span>
                  </div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="内部图片">
              <div class="flex mb5">
                <x-upload width="50px"
                  type="image"
                  accept="image/*"
                  :result="currentType"
                  field="in_img"
                  only
                  @change="onEditQrcodeType"
                >
                </x-upload>
                <div class="flex-1 ml10">
                  <x-input
                    width="100%"
                    field="in_img"
                    :result="currentType"
                    @blur-change="onEditQrcodeType"
                  ></x-input>
                  <span class="mr10">宽高：</span>
                  <x-input
                    width="100px"
                    field="in_img_w"
                    :result="currentType"
                    @blur-change="onEditQrcodeType"
                  ></x-input>
                  <span class="mh10 lh-30">x</span>
                  <x-input
                    width="100px"
                    field="in_img_h"
                    :result="currentType"
                    @blur-change="onEditQrcodeType"
                  ></x-input>
                  <span class="lh-30">%</span>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="二维码背景">
              <el-color-picker
                v-model="currentType.options.background"
                @change="onEditQrcodeType"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="二维码前景">
              <el-color-picker
                v-model="currentType.options.prospect"
                @change="onEditQrcodeType"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="二维码上边距">
              <x-input
                width="100px"
                field="qr_top"
                :result="currentType"
                @blur-change="onEditQrcodeType"
              ></x-input>
            </el-form-item>
            <el-form-item label="文字颜色">
              <el-color-picker
                v-model="currentType.text_color"
                @change="onEditQrcodeType"
              ></el-color-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let fmt = {
  qrcode: {
    show_field: 'prod_no',
    out_img: '',
    out_img_w: '100',
    out_img_h: '30',
    img_position: 'top',
    type: 1,
    page_width: 30,
    page_height: 30,
    options: {},
    page_bg: '',
    in_img: '',
    in_img_w: '20',
    in_img_h: '20',
    text_color: '',
  },
}
function initialize() {
  this.$cache.getProdSetting(true).then(res => {
    this.prod_setting = { ...this.prod_setting, ...res }
    this.getQrTypes()
  })
}
export default {
  options: { title: '二维码打印' },
  data() {
    return {
      instance: '',
      prod_setting: this.$h.cloneDeep(fmt),
      qrcode_types: [],
      currentType: { options: {} },
      prodFields: window._g
        .getVerifyFields('prod', 'pm')
        ._assign({ x_checked: false }),
      selected: [],
    }
  },
  methods: {
    getQrTypes() {
      // 查询二维码的模式
      this.$configure.getValue('qrcode_types', this.instance).then(v => {
        this.qrcode_types = v.qrcode_types
        let { qrcode } = this.prod_setting
        qrcode.type = qrcode.type || 1
        if (!this.qrcode_types) {
          this.qrcode_types = [qrcode]
        } else {
          qrcode = this.prod_setting.qrcode = this.qrcode_types.find(
            f => f.type === qrcode.type
          )
        }
        this.showchecked(qrcode)
        qrcode.options || (qrcode.options = {})
        this.currentType = qrcode
      })
    },
    showchecked(qrcode) {
      this.prodFields.forEach(m => {
        m.x_checked = qrcode.show_field.split(',').indexOf(m.field) >= 0
      })
      this.selected = this.prodFields.filter(m => m.x_checked)
    },
    onViewQrcodeType(qrcode) {
      qrcode.options || (qrcode.options = {})
      this.currentType = qrcode
      this.showchecked(qrcode)
    },
    useQrcodeType() {
      this.prod_setting.qrcode = this.currentType
      this.onSave()
    },
    onAddQrcodeType() {
      let type = this.qrcode_types.length + 1
      let qrcode = { ...fmt.qrcode, type }
      this.qrcode_types.push(qrcode)
      this.currentType = qrcode
      this.showchecked(qrcode)
    },
    onEditQrcodeType() {
      this.onSave('qrcode_types')
      this.onSave()
    },
    onDelQrcodeType(i, item) {
      this.qrcode_types.splice(i, 1)
      if (item.type === this.currentType.type) this.currentType = this.qrcode_types[0]
      this.onEditQrcodeType()
    },
    getSelected(row) {
      let i = this.selectId.indexOf(row.field)
      if (i >= 0 && !row.x_checked) this.selected.splice(i, 1)
      if (i < 0 && row.x_checked) this.selected.push(row)
      this.currentType.show_field = this.selected.map(m => m.field).join(',')
      let { qrcode } = this.prod_setting
      if (qrcode.type === this.currentType.type) {
        qrcode.show_field = this.currentType.show_field
        this.onSave()
      }
      this.onSave('qrcode_types')
    },
    onSave(field, data) {
      field = field || 'prod_setting'
      return this.$configure
        .setValue(field, { [field]: data || this[field] || '' }, this.instance)
        .then(res => {
          console.log(res)
        })
    },
    isShow(field) {
      return field.indexOf('mg_pkgs') <= 0 && !/prod_sort|main_pic/.test(field)
    },
  },
  computed: {
    isOperate() {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    },
    selectId() {
      return this.selected.map(m => m.field)
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
<style lang="scss">
.prod-qrcode-setting {
  .qrcode-setting {
    display: flex;
    .qrcode {
      width: 40%;
      .page {
        width: 30mm;
        height: 30mm;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        .code {
          flex: 1;
          // border: 1px solid #eeee;
          background: black;
          color: white;
          text-align: center;
        }
      }
    }
  }
  .qrcode-type {
    display: flex;
    border-bottom: 2px solid #e1e1e1;
    .q-title {
      padding: 0px 20px;
      line-height: 30px;
      .text {
        display: inline-block;
        border-bottom: 2px solid #e1e1e1;
        height: 100%;
        cursor: pointer;
        position: relative;
        top: 1px;
      }
      &.active {
        color: #6d78e7;
        .text {
          border-color: #6d78e7;
        }
      }
    }
  }
}
</style>
