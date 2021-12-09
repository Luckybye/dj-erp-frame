<template>
  <div class="x-timeline fixed-top">
    <div class="timeline-title">
      {{$t('timeline')}}
    </div>
    <el-timeline>
      <el-timeline-item
        v-for="item in datas2"
        :key="item.key"
        hide-timestamp
        size="large"
        :icon="item.is_finish ? 'el-icon-check' : ''"
        :type="item.path === show ? 'primary' : (item.is_finish ? 'success' : '')">
        <el-popover
          placement="bottom"
          :title="$t('tip')"
          width="200"
          trigger="click"
          :content="item.disabled_text"
          v-model="item.visible"
          v-if="item.disabled_text">
          <template slot="reference">
            <span @click.native="item.visible=!item.visible" class="pointer">{{$tt(item, 'name')}}</span>
          </template>
        </el-popover>
        <span @click="onClick(item)" class="pointer" :class="{'text-link': item.path === show, 'dd-link': item.disabled}" v-else>{{$tt(item, 'name')}}</span>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: [String, Boolean],
      default: ''
    },
    datas: {
      type: Array,
      default () {
        return []
      }
    },
    show: String,
    tab: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      lines: [],
    }
  },
  computed: {
    datas2 () {
      if (this.lines && this.lines.length) return this.lines
      return (this.datas || []).map(({path}) => {
        let key = 'cmpt.' + path
        return {
          name: this.$t(key, 'cn'),
          name_en: this.$t(key, 'en'),
          path,
          key
        }
      })
    }
  },
  methods: {
    onClick (item) {
      this.$emit('show-tab', item)
    },
    async getTimeLine () {
      let v = await this.$cache.getTimeline(this.type)
      this.lines = v.map(f => {
        let {name, name_en, path, finish, key} = f
        let para = {name, name_en, path, finish, key}
        para.is_finish = false
        return para
      })
      this.changeTimeline(this.cb)
    },
    changeTimeline (cb) {
      this.cb = cb
      cb && cb(this.lines)
    }
  },
  created () {
    this.getTimeLine()
    this.$tab.on('change-timeline', this.changeTimeline)
  },
  mounted () {
  },
  beforeDestroy () {
    this.$tab.remove('change-timeline', this.changeTimeline)
  }
}
</script>

<style lang="scss">
  .x-timeline {
    // margin-right: 10px;
    // border-right: 1px solid #eee;
    // background: #f1f8f8;
    // background-color: #fafafa;
    // background: #f1f8f8;
    // min-width: 120px;
    width: 150px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    height: 100%;
    max-height: calc(100vh - 110px);
    overflow: auto;
    .timeline-title {
      line-height: 40px;
      background: #f1f8f8;
      text-align: center;
      margin-bottom: 10px;
    }
    .el-timeline {
      // padding: 0;
      padding: 0 15px;
    }
    .el-timeline-item__icon {
      color: whitesmoke;
    }
  }
</style>
