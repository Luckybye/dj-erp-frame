<template>
  <el-dialog
    visible
    width="700px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title">编辑商品属性</div>
    <el-form label-position="left" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编码">
            <span class="lh-30">{{ vm.nature_no || '系统生成' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="属性中文">
            <x-input
              :result="vm"
              field="nature_name"
              width="200px"
              rules="require"
            ></x-input>
            <div
              class="text-red text-12"
              v-if="
                natureMap[vm.nature_name] &&
                  natureMap[vm.nature_name].nature_id !== vm.nature_id
              "
            >
              该属性名存在
            </div>
          </el-form-item>
          <el-form-item label="内容类型">
            <x-select
              width="200px"
              field="nature_type"
              :result="vm"
              :source="natureTypes"
              :map="{ label: 'cn', value: 'en' }"
              rules="require"
            ></x-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属性英文">
            <x-input
              :result="vm"
              field="nature_name_en"
              width="200px"
              rules="require"
            ></x-input>
          </el-form-item>
          <el-form-item label="参数类型">
            <!-- <ideal-select width="200px" field="nature_kind" :result="vm" :source="attrTypes" :mapper="{stext:'cn',svalue:'en'}" rules="require"></ideal-select> -->
            <span class="lh-30">
              {{ (attrTypesMap[vm.nature_kind] || {}).cn || '产品属性' }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="属性值"
        v-show="vm.nature_type === 'text' || vm.nature_type === 'textarea'"
      >
        <x-check :result="vm" field="is_single" expect="yes" unexpect="no">
          <span class="ml10">不区分多语言</span>
          <!-- <div class="text-grey lh-n">勾选表示中英文一样，只需输入一次，比如数字类型数据；不勾选则表示在商品页面您得输入中英文两种文本</div> -->
        </x-check>
      </el-form-item>
    </el-form>
    <div
      class="option-nature mt10"
      v-show="vm.nature_type === 'single' || vm.nature_type === 'check'"
    >
      <x-table :data="options2">
        <x-table-column type="index" width=""></x-table-column>
        <x-table-column label="选项中文" width="">
          <template slot-scope="{row, $index}">
            <x-input
              :result="row"
              field="option_name"
              width=""
              rules="require"
              @blur="checkIsRepeatAll(row, $index)"
              @load="checkIsRepeat(row, $index)"
            ></x-input>
            <div class="text-red text-12 mt5">{{ row.x_error }}</div>
          </template>
        </x-table-column>
        <x-table-column label="选项英文" width="">
          <template slot-scope="{row, $index}">
            <x-input
              :result="row"
              field="option_name_en"
              width=""
              rules="require"
              @blur="checkIsRepeatAll(row, $index)"
              @load="checkIsRepeat(row, $index)"
            ></x-input>
            <div class="text-red text-12 mt5">{{ row.x_error_en }}</div>
          </template>
        </x-table-column>
        <x-table-column label="操作" width="">
          <template slot-scope="scope">
            <i
              class="el-icon-delete text-17 text-red ml10"
              @click="onDelete(scope.row, scope.$index)"
            ></i>
          </template>
        </x-table-column>
      </x-table>
      <div class="text-center mt15">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addOptions()"
        ></el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
let fmt = {
  nature_no: '',
  nature_name: '',
  nature_name_en: '',
  nature_type: 'text',
  nature_id: '',
  is_single: 'no',
  nature_kind: '',
}
function onClick() {
  if (!this.vm.nature_name || !this.vm.nature_name_en) {
    return this.$message('属性中英文名必填')
  }
  if (/single|check/.test(this.vm.nature_type)) {
    if (!this.options2.length) {
      return this.$message('单选和复选必须添加选项')
    }
    if (this.options2.some(s => !s.option_name || !s.option_name_en)) {
      return this.$message('单选和复选的可选项中英文名必填')
    }
  }
  let para = Object._merge(Object._clone(fmt), this.vm)
  para = {
    ...para._trim(),
    pi_nature_option: this.options.map((m, i) => ({ ...m, seq_no: i + 1 })),
  }
  this.$post('/api/system/editSysNature', para, { loading: true }).then(
    data => {
      this.onCallback().then(() => {
        this.onClose()
      })
    }
  )
}
export default {
  data() {
    let attrTypes = [
      { en: 'attribute', cn: '产品参数' },
      { en: 'prod', cn: '产品属性' },
    ]
    return {
      vm: Object._clone(fmt),
      attrTypesMap: attrTypes._object('en'),
      options: [],
    }
  },
  methods: {
    onClick,
    addOptions() {
      this.options.push({
        option_name: '',
        option_name_en: '',
        x_option_id: Date.now(),
      })
    },
    onDelete(row) {
      if (row.option_id) {
        row.status = 'delete'
        // this.$request('/api/system/deleteNatureOption', {option_id: row.option_id}).then(() => {
        //   this.queryNatureOption()
        // })
      } else {
        this.options.splice(
          this.options.findIndex(f => f.x_option_id === row.x_option_id),
          1
        )
      }
    },
    queryNatureOption() {
      this.$request('/api/system/queryNatureOption', {
        nature_id: this.payload.nature_id,
      }).then(res => {
        this.options = res.sys_nature_option || []
      })
    },
    checkIsRepeat(row, index) {
      Vue.set(row, 'x_error', '')
      Vue.set(row, 'x_error_en', '')
      for (let i = 0; i < this.options2.length; i++) {
        const m = this.options2[i]
        if (i !== index) {
          if (
            m.option_name === row.option_name &&
            row.option_name &&
            !row.x_error
          ) {
            Vue.set(row, 'x_error', `与第${i + 1}个选项中文名相同`)
          }
          if (
            m.option_name_en === row.option_name_en &&
            row.option_name_en &&
            !row.x_error_en
          ) {
            Vue.set(row, 'x_error_en', `与第${i + 1}个选项英文名相同`)
          }
        }
      }
    },
    checkIsRepeatAll() {
      for (let i = 0; i < this.options2.length; i++) {
        this.checkIsRepeat(this.options2[i], i)
      }
    },
  },
  computed: {
    options2() {
      return this.options.filter(f => f.status !== 'delete')
    },
    natureTypes() {
      let arr = [
        { en: 'text', cn: '文本', filter: 'prod,attribute' },
        { en: 'textarea', cn: '文本框', filter: 'prod' },
        { en: 'single', cn: '单选', filter: 'prod,attribute' },
        { en: 'check', cn: '复选', filter: 'prod' },
      ]
      let ff = arr.filter(f => f.filter.indexOf(this.payload.nature_kind) >= 0)
      return ff.length ? ff : arr
    },
  },
  created() {
    this.vm = Object.assign({}, fmt, this.payload)
    if (this.payload.nature_id) this.queryNatureOption()
  },
}
</script>
