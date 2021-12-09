<template>
  <div class="icon-select">
    <el-popover
      placement="bottom"
      width="330"
      trigger="click" @show="getIcons"
      :disabled="disabled"
      v-model="show">
      <span slot="reference" ref="reference">
        <span v-if="vmodel">
          <x-icon :icon="vmodel"  type="sys"></x-icon>
          <i class="el-icon-close" @click.stop @click="selectIcon({})"></i>
        </span>
        <span v-else>{{$t('select_icon')}}</span>
      </span>
      <div class="icon-select-wrap">
        <x-input placeholder="输入图标名称检索" v-model="filterText"></x-input>
        <div class="icon-item flex-center mt20" v-for="(item, i) in icons2" :key="item.icon_code || i" :title="item.icon_name" :class="{active: vmodel === item.icon_code}" @click="selectIcon(item)">
          <x-icon :icon="'xcon-'+(item.icon_code || i)" size="20px"></x-icon>
          <div class="icon-name">{{item.icon_name}}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'icon-select',
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      vmodel: '',
      icons: [],
      filterText: '',
      show: false
    }
  },
  watch: {
    value (n) {
      this.vmodel = n || ''
    }
  },
  computed: {
    icons2 () {
      let {filterText, icons} = this
      if (!filterText) return icons
      let reg = new RegExp(filterText, 'i')
      return icons.filter(f => reg.test(f.text))
    },
    // icons () {
    //   return this.$store.getters.icons
    // },
  },
  methods: {
    selectIcon (v) {
      this.vmodel = v.icon_code || ''
      this.$emit('input', this.vmodel)
      this.show = false
    },
    async getIcons () {
      if (!this.icons.length) this.icons = (await this.$cache.getSysIcons()).data
    }
  },
  mounted () {
    this.vmodel = this.value || ''
  }
}
</script>

<style lang="scss">
.icon-select {
  width: auto;
  display: inline-block;
  .el-popover__reference {
    cursor: pointer;
    .el-icon-close {
      // display: none;
      margin-left: 5px;
      vertical-align: text-top;
      opacity: 0;
      transition: all 0.3s;
    }
    &:hover {
      color: #6d78e7;
      .el-icon-close {
        background: red;
        // display: inline-block;
        opacity: 1;
        border-radius: 50%;
        color: white;
      }
    }
  }
}
.icon-select-wrap {
  display: flex;
  flex-wrap: wrap;
  .icon-item {
    width: 50px;
    // margin-bottom: 20px;
    height: 50px;
    flex-wrap: wrap;
    &.active {
      color: #6d78e7;
      border: 1px solid #6d78e7;
    }
    &:hover {
      .x-icon {
        font-size: 30px !important;
      }
      .icon-name {
        font-size: 12px;
        line-height: normal;
        transform: scale(0.7);
      }
    }
    .icon-name {
      text-align: center;
      width: 100%;
      font-size: 12px;
      line-height: normal;
      transform: scale(0.5);
    }
  }
}
</style>
