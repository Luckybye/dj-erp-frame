<template lang="html">
  <div class="bill-check">
    <div class="tab-page-header fixed-top">
      <div class="flex-b">
        <span>
          <span class="left-border-title">业务数据校验</span>
        </span>
        <span>
          <el-button type="primary" @click="saveToSys" v-if="$state('me').role === '1'">保存至系统</el-button>
        </span>
      </div>
      <el-menu :default-active="instance" mode="horizontal" @select="handlerSelect" v-if="$state('me').role === '1'">
        <el-menu-item v-for="(item) in levels" :key="item.key" :index="item.key">
          {{item.text}}
        </el-menu-item>
      </el-menu>
    </div>
    <table class="bill-check-table">
        <thead>
          <tr>
            <th width="10%">业务类型</th>
            <th width="10%">校验事项</th>
            <th width="10%">校验科目</th>
            <th width="70%">已选校验字段（校验值为空或错误时，无法进行下一步）
              <span class="force-check">绿色为强制校验</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index1) in check">
            <template v-for="(ev, index2) in item.events">
              <tr v-for="(subj, index3) in ev.subjects" :class="{'bg': index1%2}" :key="index1 + '' + index2 + index3">
                <td :rowspan="getSpan(item)" v-if="index2 === 0 && index3 === 0" class="bold">
                  {{item.title}}
                </td>
                <td :rowspan="ev.subjects.length" v-if="index3 === 0">{{ev.name}}</td>
                <td>{{subj.name}}</td>
                <td class="left">
                  <template class="mr15" v-for="(f, index4) in subj.fields">
                    <span v-if="f.x_checked" class="field-text" :key="index1 + '' + index2 + index3 + index4" :class="{'force-check': f.require}">{{f.text}}
                    </span>
                  </template>
                  <el-button type="primary" @click="selectCheckField(subj, ev, item.type)" icon="el-icon-plus" size="mini"></el-button>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
  </div>
</template>

<script>
import Vue from 'vue'
import CheckOptions from './bill-check';
export default {
  data () {
    let instance = this.payload.instance || this.$state('me').com_id
    return {
      check: this.$h.cloneDeep(CheckOptions),
      subject: {
        prod: '商品',
        bill: '单据',
        cust: '客户',
        sup: '供应商',
        service: '服务机构'
      },
      instance,
      levels: [
        {text: '公司级', key: instance},
        {text: '系统级', key: ''},
      ]
    }
  },
  methods: {
    initialize,
    handlerSelect (k) {
      this.instance = k
      this.initialize()
    },
    getSpan (item) {
      return item.events.reduce((pre, val) => {
        pre += val.subjects.length
        return pre
      }, 0)
    },
    getValue (item) {
      this.$configure.getValue(item.event, this.instance).then(res => {
        res = res[item.event] || {}
        item.subjects.forEach(v => {
          let val = (res[v.type] || [])._object('key')
          let requireMap = (v.require || [])._object()
          v.fields.forEach(m => {
            Vue.set(m, 'x_checked', !!val[m.field] || !!requireMap[m.field])
            Vue.set(m, 'require', !!requireMap[m.field])
          })
          v.fields.sort((a, b) => a.require ? -1 : 1)
        })
      })
    },
    setValue (field, value) {
      this.$configure.setValue(field, value, this.instance).then(() => {
        // this.getSelected()
      })
    },
    async saveToSys () {
      await this.$confirm('确定将如下配置保存到系统？', this.$t('dialog_tip'), {type: 'warning'})
      this.check.forEach(item => {
        item.events.forEach(m => {
          let v = this.handlerSaveData(m, item.type)
          this.$configure.setValue(m.event, v)
        })
      })
    },
    handlerSaveData (ev, type) {
      let v = {
        _type: type,
        [ev.event]: ev.subjects.reduce((pre, val) => {
          pre[val.type] = val.fields.reduce((p, f) => {
            f.x_checked && p.push({
              key: f.field,
              value: f.text,
              rules: f.rules,
              table: f.table
            })
            return p
          }, [])
          return pre
        }, {})
      }
      v[ev.event].name = ev.name
      return v
    },
    selectCheckField (item, ev, type) {
      this.$dialog.SelectCheckField({fields: item.fields, require: item.require}, data => {
        item.fields = data
        let v = this.handlerSaveData(ev, type)
        this.setValue(ev.event, v)
      })
    },
    getSelected () {
      this.check.forEach(item => {
        item.events.forEach(m => {
          this.getValue(m)
        })
      })
    }
  },
  computed: {
    isOperate () {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    }
  },
  created () {
    this.initialize()
  }
}

function initialize () {
  this.getSelected()
}
</script>
<style lang="scss">
.bill-check {
  .bill-check-table {
    width: 100%;
    th {
      font-size: 15px;
    }
    td, th {
      line-height: 25px;
      text-align: center;
      border: 1px solid #eeeeee;
      padding: 10px;
    }
    .left {
      text-align: left;
    }
    .bg {
      background: #f5f5f5;
    }
    .bold {
      font-weight: bold
    }
    .field-text {
      display: inline-block;
      width: 120px;
    }
  }
  .force-check {
    font-weight: 600;
    color: var(--color-success);
  }
}
</style>