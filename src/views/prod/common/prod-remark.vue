<template lang="html">
  <ideal-table :datas="remarks" v-ref:datatable>
    <ideal-table-col label="NO." width="5%">
      {{ $index + 1 }}
    </ideal-table-col>
    <ideal-table-col label="Picture" width="15%">
      <div class="td-image" title="查看大图和所有图片">
        <img class="img" :src="_row.x_img" v-img-preview="{files: _row.files, index: 0}">
      </div>
    </ideal-table-col>
    <ideal-table-col label="Description" width="50%" prop="remark_info">
    </ideal-table-col>
    <ideal-table-col label="Create User&Time" width="20%">
      <div>{{_row.creator}}</div>
      <div>{{_row.update_date | timeFormat 'YYYY-MM-DD HH:mm'}}</div>
    </ideal-table-col>
    <ideal-table-col label="Action" width="10%">
      <ideal-icon-btn icon="note" skin="red" @click="_self.onEditRemark(_row)"></ideal-icon-btn>
      <ideal-icon-btn icon="shanchu" skin="red" @click="_self.onDelete(_row)"></ideal-icon-btn>
    </ideal-table-col>
    <div slot="nodata">
      No data
    </div>
  </ideal-table>
</template>
<script>
  function initialize () {
    let self = this
    let ps = []
    if (!self.billId) return
    let v = {
      collection: self.collection,
      id: self.billId,
      field: 'remarks'
    }
    ps.push(self.$pull.queryAllAttach(v))
    return self.$Promise.when(ps).then(function (p) {
      self.remarks = (p.remarks || []).map(m => {
        m.files[0] && (m.x_img = m.files[0].url)
        return m
      })
    })
  }
  export default {
    options: {title: 'Remark'},
    data () {
      return {
        remarks: []
      }
    },
    props: {
      collection: {
        type: String,
        default: ''
      },
      billId: {
        type: String,
        default: ''
      }
    },
    methods: {
      initialize,
      onEditRemark (item) {
        let self = this
        if (!self.billId) {
          self.$message('请先编辑商品信息')
          console.log()
          return
        }
        let name = self.$state('me').user_name_en || self.$state('me').user_name || 'no name'
        let v = {
          id: self.billId,
          collection: self.collection,
          field: 'remarks'
        }
        self.$dialog.EditRemark({newValue: item || {}}, function (data) {
          Object.assign(v, data)
          if (item) {
            v = {
              ...v,
              attach_id: item.attach_id
            }
            self.$pull.modifyAttachment(v).then(function (data) {
              initialize.call(self)
            })
          } else {
            v = {
              ...v,
              create_user: self.$state('me').user_id,
              creator: name
            }
            self.$pull.addAttachment(v).then(function (data) {
              initialize.call(self)
            })
          }
        })
      },
      onDelete (item) {
        let self = this
        let v = {
          id: this.billId,
          attach_id: item.attach_id,
          collection: self.collection,
          field: 'remarks'
        }
        self.$pull.removetAtachment(v).then(function () {
          initialize.call(self)
        })
      }
    },
    created () {
      initialize.call(this)
    }
  }
</script>
