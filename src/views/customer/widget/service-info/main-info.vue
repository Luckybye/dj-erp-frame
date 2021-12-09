<template lang="html">
  <div class="basic-info">
    <el-form label-position="left" label-width="90px">
      <el-row type="flex" :gutter="50">

        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.sup_code" colon>代码:</t>
            <x-input :result="vm" field="cust_code" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.id_code" colon>ERP号:</t>
            <x-input :result="vm" field="id_code" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.service_type" colon>服务商类型:</t>
            <select-service-type :result="vm" field="cust_type" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" unit="%" type="number"></select-service-type>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Mixins from "../../pages/mixins";
export default {
  mixins: [Mixins],
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
