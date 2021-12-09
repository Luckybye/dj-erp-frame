<template>
  <div class="x-component search-select-group-user" :style="{width: width}">
    <x-cascader
      width="100%"
      v-model="vmodel"
      :options="datas"
      :placeholder="placeholder || label || $t('all_group')"
      :collapseTags="collapseTags"
      :props="{
        multiple,
        checkStrictly,
        label: $i18n.locale === 'cn' ? 'text' : 'text_en',
        disabled: 'x_disabled'
      }"
      @change="onChange"
      @remove-tag="onChange"
      :label="label"
      :labelWidth="labelWidth"
      :readonly="readonly"
      :disabled="disabled"
      :disabledMap="disabledMap"
      :field="field"
      :clearable="clearable"
    ><slot name="label" slot="label"></slot></x-cascader>
  </div>
</template>
<script>
export default {
  name: 'select-group-user',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array]
    },
    result: {
      type: Object,
      default () {
        return {}
      }
    },
    field: {
      type: String,
      default: ''
    },
    field2: {
      type: String,
      default: ''
    },
    pm: {
      type: Object,
      default () {
        return {}
      }
    },
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'pm.range': 'getDatas',
    'pm.addCom': 'getDatas',
    'pm.addPublic': 'getDatas',
  },
  methods: {
    onChange (...arg) {
      this.$nextTick(() => {
        this.$emit('change', ...arg)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field], [this.field2]: this.result[this.field2]}, this.result)
      })
    },
    addCom () {
      if (this.pm.addCom) {
        this.datas.unshift({
          text: '公司',
          text_en: 'Company',
          id: '-1',
          busi_group_id: '-1',
        })
      }
    },
    addPublic () {
      if (this.pm.addPublic) {
        this.datas.unshift({
          text: '公共组',
          text_en: 'Public Group',
          id: this.$groupId,
          busi_group_id: this.$groupId,
        })
      }
    },
    async getDatas () {
      let all = await this.$cache.getAllGroupTree()
      if (this.pm.range === 'all') {
        this.datas = all
      } else if (this.pm.range === 'self') {
        this.datas = []
        return
      } else {
        this.datas = all.map(m => {
          m.x_disabled = m.disabled
          m.children && m.children.forEach(f => {
            f.x_disabled = f.disabled
          })
          return m
        })
        this.datas.sort((a, b) => b.x_disabled ? -1 : 1)
      }
      this.addCom()
      this.addPublic()
    }
  },
  computed: {
    vmodel: {
      get: function () {
        let val = this.value
        if (this.field) {
          if (this.result[this.field]) val = [this.result[this.field]]
          if (this.result[this.field2]) val = [this.result[this.field], this.result[this.field2]]
        }
        return val || []
      },
      set: function (n) {
        this.$emit('input', n)
        if (this.field) {
          this.result[this.field] = n[0] || null
          this.result[this.field2] = n[1] || null
        }
      }
    },
  },
  data () {
    return {
      datas: [],
    }
  },
  mounted () {
  },
  created () {
    this.getDatas()
  }
}
</script>
<style lang="scss">
.search-select-group-user {
}
</style>
