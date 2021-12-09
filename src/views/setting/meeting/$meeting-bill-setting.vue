<template>
  <div>
    <x-table :data="meetingRules">
      <x-table-column type="index" width="50"></x-table-column>
      <x-table-column label="配置描述" width="250">
        <template slot-scope="{row}">{{ row.text }}</template>
      </x-table-column>
      <x-table-column label="状态/操作">
        <template slot-scope="{ row }">
          <div v-if="row.type === 'input'">
            <el-input style="width: 80%" v-model="vm[row.result][row.field]" @blur="onSave(row.result)"></el-input>天
          </div>
          <div v-else>
            <div v-if="row.result === 'busi_rules'">
              <el-radio v-model="vm[row.result][row.field].param.qu" :label="true" @change="onSave(row.result)">是</el-radio>
              <el-radio v-model="vm[row.result][row.field].param.qu" :label="false" @change="onSave(row.result)">否</el-radio>
            </div>
            <div v-else>
              <el-radio v-model="vm[row.result][row.field]" label="yes" @change="onSave(row.result)">是</el-radio>
              <el-radio v-model="vm[row.result][row.field]" label="no" @change="onSave(row.result)">否</el-radio>
            </div>
          </div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
    title: '业务功能',
  },
  components: {},
  data() {
    return {
      meetingRules: [
        { result: "meeting_config", field: "select_sameprod", text: "是否可选择相同货号的商品", type: "checkbox" },
        { result: "meeting_config", field: "fill_up", text: "数量不是整箱时是否补全", type: "checkbox" },
        { result: "meeting_config", field: "qty_over_moq", text: "数量要求大于起订量", type: "checkbox" },
        { result: "meeting_config", field: "shipping_day", text: "默认客户交期（客户下单后 X 天出运）", type: "input" },
      ],
      vm: {
        meeting_config: {
          fill_up: "yes",
          select_sameprod: "yes",
          qty_over_moq: "yes",
          shipping_day: "45",
        },
      },
      instance: ''
    };
  },
  methods: {
    init() {
      Object.keys(this.vm).forEach(key => {
        this.refresh(key)
      })
    },
    refresh (field) {
      this.$configure.getValue(field, this.instance).then(v => {
        Object.assign(
          this.vm[field],
          v[field]
        )
        console.log(field, this.vm)
      })
    },
    onSave(field) {
      return this.$configure
        .setValue(field, { [field]: this.vm[field] }, this.instance)
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.init();
  },
};
</script>
