<template>
  <div class="year-select" :style="{width: width}">
    <el-select v-model="vmodel" :size="size" @change="onChange" ref="elSelect" filterable :multiple="multiple" :collapse-tags="multiple && vmodel.length > 1" :placeholder="placeholder || $t('select_placeholder')" :clearable="clearable">
      <el-option
        v-for="(item) in options"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: 'year-picker',
  props: {
    placeholder: String,
    size: {
      type: String,
      default: 'small'
    },
    width: {
      type: String,
      default: '160px'
    },
    multiple: {
      type: Boolean,
      default: false
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
    max: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 2000
    },
    clearable: Boolean,
  },
  methods: {
    onChange () {
      // this.result[this.field] = this.vmodel
      this.$nextTick(() => {
        this.$emit('change')
      })
    }
  },
  computed: {
    vmodel: {
      get: function () {
        return this.result[this.field] || ''
      },
      set: function (n) {
        this.result[this.field] = n
      }
    },
  },
  data () {
    return {
      options: []
    }
  },
  watch: {
    // 'result[field]' (n, o) {
      // console.log(n, 888888888)
      // this.vmodel = n
    // }
  },
  mounted () {
    // this.vmodel = this.result[this.field]
  },
  created () {
    let start = this.min
    let {min, max} = this
    max || (max = min + 100)
    this.options = Array._of(max + 1 - min, i => min + i)
  }
}
</script>
<style lang="scss">
.year-select {
  display: inline-block;
  width: auto;
  .el-select {
    width: 100%;
  }
}
</style>
