<template>
  <el-dialog
    :visible="true"
    width="850px"
    @close="onClose"
    :close-on-click-modal="false"
    title="审批配置"
  >
    <div>
      <el-form label-width="100px">
        <el-form-item label="业务类型">
          {{vector.name}}
        </el-form-item>
        <el-form-item label="选择审批人">
          <select-staff :result="temp" field="approvers" width="80%" multiple @change="selectUser"></select-staff>
        </el-form-item>
        <el-form-item label="审批规则" v-if="!disabled.explain">
          <div v-for="(item, index) in apprRules" :key="index">
            <x-check :result="vector" field="appr_rule" :expect="item.en" unexpect="" :text="item.cn"></x-check>
          </div>
        </el-form-item>
        <el-form-item label="审批制度" v-if="!disabled.explain">
          <editor
            v-model="vector.explain"
          ></editor>
        </el-form-item>
      </el-form>
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
export default {
  data() {
    return {
      vector: {
        approvers: [],
        status: '',
        name: '',
        explain: '',
        appr_rule: 'user-defined'
      },
      apprRules: [
        {en: 'user-defined', cn: '用户定义(现在是默认条件)，需要告知开发人员自定义条件'},
        {en: 'force', cn: '强制审批'}
      ],
      temp: {
        approvers: []
      }
    }
  },
  methods: {
    initialize () {
      this.vector = {
        ...this.vector,
        ...this.row
      }
      this.temp.approvers = (this.vector.approvers || []).map(item => {
        return item.user_id
      })
    },
    selectUser(item) {
      this.vector.approvers = item.map(m => {
        return {
          user_id: m.user_id,
          user_name: m.user_name,
          user_name_en: m.user_name_en,
        }
      })
    },
    onConfirm () {
      this.onCallback(this.vector).then(() => {
        this.onClose()
      })
    },
  },
  components: {},
  created() {
    this.initialize()
  },
}
</script>
