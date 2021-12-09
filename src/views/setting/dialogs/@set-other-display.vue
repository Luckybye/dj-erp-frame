<template>
  <el-dialog
    :visible="true"
    width="1000px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">
      商品详情显示配置
    </div>

    <el-form label-position="left" label-width="120px">
      <el-form-item label="数据样式:">
        <el-checkbox
          v-model="vm.data_type"
          v-for="item in dataType"
          class="mr20"
          :key="item.key"
          :true-label="item.key"
          false-label="blank"
          >{{ item.text }}</el-checkbox>
      </el-form-item>
      <el-form-item label="详情区布局:">
        <div>
          <div>
            <el-checkbox v-model="vm.display" true-label="d3" false-label="d2">
              左右三段区域</el-checkbox>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="左区英文标题:">
                <x-input width="90%" :result="vm.d3" field="lt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="左区中文标题:">
                <x-input width="90%" :result="vm.d3" field="lt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="右上区英文标题:">
                <x-input width="90%" :result="vm.d3" field="rt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="右上区中文标题:">
                <x-input width="90%" :result="vm.d3" field="rt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="右下区英文标题:">
                <x-input width="90%" :result="vm.d3" field="rbt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="右下区中文标题:">
                <x-input width="90%" :result="vm.d3" field="rbt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div>
          <div>
            <el-checkbox v-model="vm.display" true-label="d2" false-label="d2">
              左右2段区域</el-checkbox>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="左区英文标题:">
                <x-input width="90%" :result="vm.d2" field="lt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="左区中文标题:">
                <x-input width="90%" :result="vm.d2" field="lt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="右区英文标题:">
                <x-input width="90%" :result="vm.d2" field="rt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="右区中文标题:">
                <x-input width="90%" :result="vm.d2" field="rt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div>
          <div>
            <el-checkbox v-model="vm.display" true-label="d1" false-label="d2">
              平铺1段区域</el-checkbox>
          </div>

          <el-row>
            <el-col :span="12">
              <el-form-item label="英文标题:">
                <x-input width="90%" :result="vm.d1" field="lt_en"></x-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文标题:">
                <x-input width="90%" :result="vm.d1" field="lt"></x-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dataType: [
        { text: '表格', key: 'table' },
        { text: '下划线', key: 'underline' },
        { text: '空白', key: 'blank' },
      ],
      vm: {
        data_type: 'table',
        display: 'd2',
        d1: { lt: '', lt_en: '', f1: '' },
        d2: { lt: '', lt_en: '', rt: '', rt_en: '', f1: '', f2: '' },
        d3: {
          lt: '',
          lt_en: '',
          rt: '',
          rt_en: '',
          rbt: '',
          rbt_en: '',
          f1: '',
          f2: '',
          f3: '',
        },
      },
    }
  },
  methods: {
    initialize() {},
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
  },
  watch: {},
  created() {},
}
</script>

<style lang="scss"></style>
