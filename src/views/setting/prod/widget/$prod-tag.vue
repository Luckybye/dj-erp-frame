<template>
  <div class="prod-tag-config">
    <div class="tab-page-header flex-b">
      <span class="left-border-title">{{$t('cmpt.' + componentName)}}</span>

      <div class="h-right mr30">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onEdit()"
        ></el-button>
      </div>
    </div>

    <div>
      <table class="sample-table">
        <thead>
          <th style="width: 25%">标签英文名</th>
          <th style="width: 25%">标签中文名</th>
          <th style="width: 25%">标签颜色</th>
          <th style="width: 15%">字体颜色</th>
          <th style="width: 10%">操作</th>
        </thead>
        <tbody>
          <tr v-for="(row, i) in datas" :key="i">
            <td>
              <x-input
                width="100%"
                field="tag_name_en"
                :result="row"
                @blur-change="onEdit(row, 'tag_name_en', i)"
              ></x-input>
            </td>
            <td>
              <x-input
                width="100%"
                field="tag_name"
                :result="row"
                @blur-change="onEdit(row, 'tag_name', i)"
              ></x-input>
            </td>
            <td>
              <span :style="{background: row.tag_color}" class="prod-tag mr10 vt">
                <span :style="{color: row.font_color}">{{row.tag_name_en || row.tag_name}}</span>
              </span>
              <el-color-picker
                v-model="row.tag_color"
                @change="onEdit(row, 'tag_color', i)"
              ></el-color-picker>
            </td>
            <td>
              <el-color-picker
                v-model="row.font_color"
                @change="onEdit(row, 'font_color', i)"
              ></el-color-picker>
            </td>
            <td>
              <i
                class="el-icon-delete text-17 text-red ml10"
                @click="onDelete(row)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  options: { title: '商品标签管理' },
  data() {
    return {
      datas: [],
    }
  },
  methods: {
    // initialize () {
    //   this.querySysTag()
    // },
    onEdit(row, field, index) {
      if (!row) {
        let l = this.datas.length + 1
        this.datas.push({
          tag_name: '标签' + l,
          tag_name_en: 'Label' + l,
          tag_color: '#f6a826',
          font_color: '#000001',
        })
        index = l - 1
        row = this.datas[index]
      }
      if (!row.tag_name || !row.tag_name_en) return this.$message('标签名不能为空')
      let i = this.datas.findIndex(
        m => m.tag_name === row.tag_name || m.tag_name_en === row.tag_name_en
      )
      if (i >= 0 && i !== index) return this.$message(`与第${i + 1}个标签名重复`)
      let { tag_name, tag_name_en, tag_color, font_color, tag_id } = row
      let para = { tag_name, tag_name_en, tag_color, font_color, tag_id }
      this.$post2('/api/system/editSysTag', para).then(() => {
        if (!row.tag_id) this.querySysTag()
      })
    },
    querySysTag() {
      this.$get(
        '/api/system/querySysTag',
        { com_id: this.$state('me').com_id },
        { loading: true }
      ).then(d => {
        this.datas = d.sys_tags || []
      })
    },
    onDelete(row) {
      this.$post2('/api/system/deleteSysTag', { tag_id: row.tag_id }).then(
        d => {
          this.querySysTag()
        }
      )
    },
  },
  computed: {
    isOperate() {
      return this.$state('isAdmin')
    },
  },
  created() {
    this.querySysTag()
  },
}
</script>

<style scoped lang="scss">
.prod-tag{
  height: 30px;
  line-height: 30px;
  position: relative;
  display: inline-block;
  padding: 0 20px;
  border-radius: 2px 15px 15px 2px;
  box-shadow: 2px 2px 5px grey;
  min-width: 100px;
}

</style>
