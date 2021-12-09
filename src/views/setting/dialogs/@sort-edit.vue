<template>
  <el-dialog
    :title="title"
    visible
    width="700px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <el-form label-position="left" label-width="80px">
      <el-row :gutter="30">
        <el-col :span="12" v-if="parentNode">
          <el-form-item label="父分类: ">
            <div class="default-text">{{ parentNode.sort_full_name }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item require label="编码:">
            <x-input
              :result="node"
              :disabled="!isOperate"
              field="sort_code"
              rules="require,maxLen=12"
              skin="blue"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item require label="分类名称(英文):">
            <x-input
              :result="node"
              field="sort_name_en"
              :disabled="!isOperate"
              rules="require"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item require label="分类名称(中文):">
            <x-input
              :result="node"
              field="sort_name"
              :disabled="!isOperate"
              rules="require"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!parentNode">
          <el-form-item require label="分类产品毛利率:">
            <x-input
              :result="node"
              field="gross_rate"
              :disabled="!isOperate"
              rules="require"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!parentNode">
          <el-form-item label="类型:">
            <select-sort-type
              :result="node"
              field="sort_type"
              width="100%"
            ></select-sort-type>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!parentNode">
          <el-form-item require label="图片:">
            <div>
              <x-upload
                :result="node"
                field="pic_url"
                :disabled="!isOperate"
              ></x-upload>
            </div>
            <small style="color: red;">建议尺寸 375*667</small>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="nature mt10" v-if="natures.length">
        <x-table :data="selectedNatures || []" draggable>
          <x-table-column type="index" width="60"></x-table-column>
          <x-table-column label="参数中文" width="">
            <span slot-scope="{ row }">{{
              (naturesMap[row.nature_id] || {}).nature_name || '已删除'
            }}</span>
          </x-table-column>
          <x-table-column label="参数英文" width="">
            <span slot-scope="{ row }">{{
              (naturesMap[row.nature_id] || {}).nature_name_en || '已删除'
            }}</span>
          </x-table-column>
          <x-table-column label="重要参数" width="">
            <select-yes-no
              width="90%"
              field="is_important"
              :result="row"
              rules="require"
              @change="selectImportant(row)"
              slot-scope="{ row }"
            ></select-yes-no>
          </x-table-column>
          <x-table-column label="必须有值" width="">
            <select-yes-no
              width="90%"
              field="is_value"
              :result="row"
              rules="require"
              @change="selectImportant(row)"
              slot-scope="{ row }"
              :disabled="row.is_important === 'yes' && row.is_value === 'yes'"
            ></select-yes-no>
          </x-table-column>
          <x-table-column label="操作" width="60">
            <i
              class="el-icon-delete text-17 text-red"
              @click="onDeleteAttr($index)"
              slot-scope="{ $index }"
            ></i>
          </x-table-column>
          <div slot="nodata">
            暂无数据
          </div>
        </x-table>
        <div class="text-left">
          <span class="lh-30 text-20 mr5 ml15">+</span>
          <x-select
            width="200px"
            @change="selectNature"
            :source="restNatures"
            :map="{ label: 'nature_name', value: 'nature_id' }"
            filter="nature_name"
            :result="tempVm"
            field="nature_id"
          ></x-select>
        </div>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick" v-if="isOperate">{{
        $t('confirm')
      }}</el-button>
      <el-button @click="onDelete" v-if="isOperate" type="danger">{{
        $t('delete')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      node: {
        sort_name: '',
        children: [],
        parent_id: '',
        pic_url: '',
        sort_type: 'product',
      },
      natures: [],
      selectedNatures: '',
      tempVm: { nature_id: '' },
    }
  },
  methods: {
    onClick() {
      let self = this
      if (
        !(
          self.node &&
          self.node.sort_name_en &&
          self.node.sort_name &&
          self.node.sort_code
        )
      ) {
        self.$message('填写不完整')
        return
      }
      self
        .onCallback(self.node, self.parentNode, self.selectedNatures)
        .then(function() {
          self.onClose()
        })
    },
    onDelete() {
      let self = this
      self.onCallback().then(function() {
        self.onClose()
      })
    },
    onDeleteAttr(i) {
      this.selectedNatures.splice(i, 1)
    },
    selectImportant(item) {
      if (item && item.is_important === 'yes') {
        item.is_value = 'yes'
      }
    },
    querySysNature() {
      this.$get('/api/system/querySysNature', {
        status: 'normal',
        nature_kind: 'attribute',
      }).then(res => {
        this.natures = res.sys_natures || []
      })
    },
    querySortNature() {
      let id = (this.child || {}).sort_id
      if (!id) return
      this.$get('/api/product/querySortNature', {
        sort_id: id,
      }).then(res => {
        let n = res.sys_natures || []
        n.length && (this.selectedNatures = n)
      })
    },
    selectNature(item) {
      if (!item) return
      if (!this.selectedNatures) this.selectedNatures = []
      this.selectedNatures.push({
        nature_id: item.nature_id,
        is_important: 'no',
        is_value: 'yes',
      })
      this.tempVm.nature_id = ''
    },
  },
  computed: {
    isOperate() {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    },
    restNatures() {
      let map = (this.selectedNatures || [])._object('nature_id')
      return this.natures.filter(f => !map[f.nature_id])
    },
    naturesMap() {
      return this.natures._object('nature_id')
    },
  },
  created() {
    if (this.child) {
      this.node = this.child
      this.node.sort_type = this.node.sort_type || 'product'
    } else if (this.parentNode) {
      this.node.parent_id = this.parentNode.sort_id
    }
    this.querySysNature()
    this.querySortNature()
  },
}
</script>
