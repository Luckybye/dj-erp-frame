<template>
  <div>
    <el-table :data="datas" tooltip-effect="dark" style="width: 100%">
      <el-table-column :label="$t('enable_index')">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isSelected" @change="onSave()" :disabled="scope.$index === 0">{{
            scope.$index + 1
          }}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column :label="$t('busi_point')">
        <template slot-scope="scope">{{ scope.row.value || "-" }}</template>
      </el-table-column>
      <el-table-column :label="$t('chinese')">
        <template slot-scope="scope">
          <x-input v-model="scope.row.name" @blur-change="onSave()"></x-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('english')">
        <template slot-scope="scope">
          <x-input v-model="scope.row.name_en" @blur-change="onSave()"></x-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Timeline from '@/lib/timeline/pu'
export default {
  data() {
    return {
      datas: Timeline.timelines,
      instance: "",
      field: Timeline.key + '_timeline'
    };
  },
  methods: {
    init() {
      this.instance = this.payload.instance || this.$state('me').com_id || ''
      this.getConfigure(this.field, this.instance);
    },
    onSave() {
      console.log(this.datas);
      this.setConfigure(this.field, {[this.field]: this.datas}, this.instance)
    },
    async getConfigure(field, instance) {
      var vv = { field };
      instance && (vv.instance = instance);
      this.$get("/api/support/getConfigure", vv).then((data) => {
        data = (data[field] || [])._object('key')
        this.datas = this.datas.map(m => {
          let {part} = m
          return {...m, ...data[m.key], part}
        })
      });
    },
    async setConfigure(field, value, instance) {
      if (!field || !value) return;
      var vv = { field, value };
      instance && (vv.instance = instance);
      this.$post("/api/support/setConfigure", vv);
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped></style>
