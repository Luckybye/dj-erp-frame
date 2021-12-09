<template lang="html">
  <el-form-item class="photo">
    <t slot="label" path="prod.main_pic" colon>商品图片:</t>
    <div class="flex">
      <x-upload :files="viewModel.mg_prod_pic" :disabled="readonly" class="flex-1" @finish="onSave" @delete="onSave" format="pad_100">
        <template slot="extend" slot-scope="{file}">
          <div @click="setDefault(file)" v-if="file.url !== viewModel.main_pic" class="dflt-btn">{{isCn ? '设为默认' : 'Default'}}</div>
          <div v-else class="dflt-mark">{{isCn ? '默认' : 'Default'}}</div>
        </template>
      </x-upload>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onSave (v) {
      let rst = {mg_prod_pic: v}
      if (!this.viewModel.main_pic) {
        rst.main_pic = v[0].url
        this.viewModel.main_pic = rst.main_pic
      }
      this.onSaveInner(rst)
    },
    setDefault (item) {
      this.viewModel.main_pic = item.url
      this.onSaveInner({main_pic: item.url})
    }
  },
  created () {
  },
  mixins: []
}
</script>
<style lang="scss">
.photo {
  .dflt-mark {
    position: absolute;
    top: 0;
    right: 0;
    // z-index: 2;
    line-height: 15px;
    background: red;
    color: #fff;
    font-size: 12px;
    padding: 0 5px;
    z-index: 1;
  }
  .dflt-btn {
    position: absolute;
    left: 0;
    bottom: -30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    transition: all 0.3s;
    width: 100%;
    cursor: pointer;
  }
  .file-item {
    &:hover {
      .dflt-btn {
        bottom: 0;
        color: #fff;
        // opacity: 1;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
