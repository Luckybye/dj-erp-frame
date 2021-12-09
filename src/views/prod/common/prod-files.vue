<template lang="html">
  <ideal-form v-ref:ideal-form>
    <table class="sort-table text-center" width="100%" v-for="(index,level) in tableMeta">
        <thead class="thead">
          <tr>
              <th width="18%" style="padding-right:26px;">{{level.name}}</th>
            <template v-if="index != 0">
              <th width="25%"></th>
              <th width="25%"></th>
              <th width="25%"></th>
            </template>
            <template v-else>
              <th width="25%">File name</th>
              <th width="25%">Create</th>
              <th width="25%">Operation</th>
            </template>
          </tr>
        </thead>
        <tbody class="tbody">
        <tr v-for="type2 in level.attach_type2">
          <td>
            {{type2}}
            <ideal-upload-attach
              :attach-type-one = "level.name"
              :attach-type-two = "type2"
              :id = "billId"
              @finished = "finishedHandle"
            ></ideal-upload-attach>
          </td>
          <td>
            <template v-for="(index,file) in mg_files">
              <div
                v-if=" file.attach_type1 == level.name && file.attach_type2 == type2 "
                :class="{file_wrapper: true, active: index == activeIndex }"
                @mouseover="activeIndex = index"
                @mouseleave="activeIndex = null">
                <img
                  v-if="imgJudge(file.file_name)"
                  :src="file.url"
                  class="img_file"
                />
                <video
                  v-if="videoJudge(file.file_name)"
                  preload
                  loop
                  @click="videoClickHandle"
                  :src="file.url"
                >
                </video>
                <span style="max-width:80%;overflow:hidden">
                  {{file.file_name}}
                </span>
              </div>
            </template>
          </td>
          <td>
            <template v-for="(index,file) in mg_files">
              <div
              v-if=" file.attach_type1 == level.name && file.attach_type2 == type2 "
              :class="{file_wrapper: true, active: index == activeIndex }"
              @mouseover="activeIndex = index"
              @mouseleave="activeIndex = null">
               {{file.create_date | timeFormat 'YYYY-MM-DD'}} <strong>by</strong> {{file.creator}}
              </div>
            </template>
          </td>
          <td>
            <template v-for="(index,file) in mg_files">
              <div
              v-if=" file.attach_type1 == level.name && file.attach_type2 == type2 "
              :class="{file_wrapper: true, active: index == activeIndex }"
              @mouseover="activeIndex = index"
              @mouseleave="activeIndex = null">
                <ideal-icon-btn icon="trash" @click="deleteHandle(file.key)"></ideal-icon-btn>
                <a :href="file.url">
                  <ideal-icon-btn icon="xiazai"></ideal-icon-btn>
                </a>
              </div>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
  </ideal-form>
</template>

<script>
  function initialize () {
    let self = this
    if (!self.billId) return
    let v = {
      id: self.billId,
      collection: self.collection,
      field: 'mg_files'
    }
    self.$pull.queryMgbField(v).then((data) => {
      self.mg_files = data.mg_files
    })
  }

  export default {
    options: {title: 'Document'},
    data () {
      return {
        mg_files: [],
        me: this.$state('me'),
        tableMeta: [
          {
            name: 'Product Design',
            attach_type2: ['Proposal Design', 'Confirmed Design']
          },
          {
            name: 'Package',
            attach_type2: ['Diecut', 'Artwork', 'Manual', 'Other']
          },
          {
            name: 'Carton',
            attach_type2: ['Diecut', 'Artwork', 'Front Mark', 'Side Mark']
          },
          {
            name: 'Testing',
            attach_type2: ['Report']
          }
        ],
        activeIndex: null
      }
    },
    props: {
      payload: {
        type: Object,
        default () {
          return {}
        }
      },
      collection: {
        type: String,
        default: ''
      },
      isCn: {
        type: Boolean,
        default: true
      },
      billId: {
        type: String,
        default: ''
      }
    },
    methods: {
      initialize,
      deleteHandle (keyId) {
        this.$dialog.YesNo({text: '确定删除？', title: '??'}, res => {
          if (!res) return
          const delParam = {
            collection: this.collection,
            id: this.billId,
            key_name: 'key',
            key: keyId,
            field: 'mg_files',
            $delete: '1'
          }
          this.$pull.upsertMgbFieldArray(delParam).then(data => {
            this.initialize()
          })
        })
      },
      imgJudge (fileName) {
        return /\.(jpe?g|png|gif|svg|bng)$/g.test(fileName)
      },
      videoJudge (fileName) {
        return /\.(ogg|mp4)$/g.test(fileName)
      },
      videoClickHandle ($event) {
        if ($event.target.paused) $event.target.play()
        else $event.target.pause()
      },
      finishedHandle (file) {
        if (!this.billId) {
          this.$message('请先编辑商品信息')
          return
        }
        const param = {
          ...file,
          collection: this.collection,
          key_name: 'key',
          key: file.file_id,
          field: 'mg_files',
          raw_type: 'file',
          create_user: this.me.user_id,
          creator: this.me.user_name,
          id: this.billId
        }
        delete param.file_id
        console.log(param, '123')
        this.$pull.upsertMgbFieldArray(param).then(data => {
          this.initialize()
        })
      }
    },
    created () {
      this.initialize()
    }
  }
</script>

<style scoped lang="scss">
.thead{
  tr{
    background: rgb(235,238,245);
    height:30px;
    font-size: 14px;
  }
}
.tbody{
  td{
    height:25px;
    line-height:25px;
    border-right:1px solid #e1e1e1;
      .file_wrapper{
        width:100%;
        height:25px;
      }
      .active{
        background: #e1e1e1;
      }
      .img_file{
        width:20px;
        height:20px;
        transition: .3s;
        &:hover{
          transform:scale(15);
        }
      }
      video{
        transition: .3s;
        height:80%;
        vertical-align: top;
        &:hover{
          transform:scale(15)
        }
      }
  }
  tr{
    border-top: 1px solid #ebeef5;
  }
}

</style>
