<template>
  <div class="mail-tpl-setting-list">
    <el-table :data="datas" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index"  width="50"></el-table-column>
      <el-table-column :label="$t('type')">
        <div slot-scope="{row}" :class="row.mail_type">
          {{row.mail_type | mailType}}
        </div>
      </el-table-column>
      <el-table-column :label="$t('business')">
        <div slot-scope="{row}" :class="row.mail_type">
          {{row.mail_name}}
        </div>
      </el-table-column>
      <el-table-column :label="$t('action')">
        <template slot-scope="{row}">
          <x-icon icon="el-icon-edit-outline" color-class="blue" size="17px" @click="onEdit(row)"></x-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mailTpls from '@/lib/mail-tpl'
export default {
  options: {
    icon: 'icon-set',
  },
  components: {
  },
  data() {
    return {
      datas: []
    }
  },
  methods: {
    onEdit (v) {
      this.$tab.open({
        path: 'MailTplSettingDetail',
        title: v.mail_name,
        query: {mail_key: v.mail_key}
      })
    }
  },
  created () {
    this.datas = Object.values(mailTpls)
    this.datas.sort((a, b) => a.seq_no - b.seq_no)
  }
}
</script>
<style lang="scss">
.mail-tpl-setting-list {
  .receive {
    color: green;
  }
}
</style>