<template>
  <div class="x-theme">
    <el-drawer
      title="自定义主题(完善中...)"
      :visible="visible"
      :before-close="handleClose"
      :modal="false"
      destroy-on-close
      :wrapperClosable="false">

      <div class="theme-box ph20">
        <div class="text-right">
          <el-button @click="onReset" type="danger">重置</el-button>
          <el-button @click="saveLocal" type="primary">保存</el-button>
        </div>
        <div class="flex-wrap mt20">
          <x-check v-for="item in themes" :key="item.key" width="50%" class="mb10" v-model="currentTheme" :expect="item.key" :unexpect="item.key" @change="selectTheme(item)">
            {{item.text}}
          </x-check>
        </div>
        <div class="color-item mt10" v-for="row in colorVars" :key="row.key">
          <div class="color-name lh-25 text-bold text-grey">{{row.text}}</div>
          <div class="flex">
            <x-input v-model="row.value" class="flex-1" @blur-change="changeColor(row)"></x-input>
            <el-color-picker
              class="ml10"
              v-model="row.value"
              show-alpha
              :predefine="predefineColors"
              @change="changeColor(row)">
            </el-color-picker>
          </div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data () {
    return {
      themes: [
        {text: '深色主题', key: 'dj-erp-theme--dark'},
        {text: '浅色主题', key: 'dj-erp-theme--light'},
        // {text: '护眼主题', key: 'dj-erp-theme--eyecare'},
        // {text: '自定义主题', key: 'dj-erp-theme--custom'},
      ],
      activeName: 'light_theme',
      colorVars: [
        {
          text: '页面-背景色',
          key: 'bg-color',
          value: ''
        },
        {
          text: '侧边栏-背景色',
          key: 'aside-bg-color',
          value: ''
        },
        {
          text: '侧边栏-字体颜色',
          key: 'aside-font-color',
          value: ''
        },
        {
          text: '侧边栏-选中颜色',
          key: 'aside-active-bg-color',
          value: ''
        },
        {
          text: '侧边栏-选中字体颜色',
          key: 'aside-active-font-color',
          value: ''
        },
        {
          text: 'Tab页签-Bar背景色',
          key: 'tab-header-color',
          value: ''
        },
        {
          text: 'Tab页签-页面背景色',
          key: 'tab-content-color',
          value: ''
        },
      ],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
        '#fff',
        '#000',
        "#eee",
        '#e1e1e1',
        '#f1f8f8',
        '#EDEFF2'
      ],
      currentTheme: ''
    }
  },
  methods: {
    handleClose () {
      this.visible = false
    },
    changeColor (row) {
      console.log(row, 11111)
      let f = '--' + row.key
      document.body.style.setProperty(f, row.value)
    },
    getColor () {
      this.colorVars.forEach(m => {
        let f = '--' + m.key
        m.value = getComputedStyle(document.body).getPropertyValue(f)
        console.log(m.value)
      })
    },
    saveLocal () {
      localStorage.setItem('dj_saas_theme', JSON.stringify(this.colorVars))
      this.$message('保存成功')
    },
    onReset () {
      localStorage.setItem('dj_saas_theme', '')
      this.$message('正在重置...')
      location.reload()
    },
    selectTheme (item) {
      localStorage.setItem('dj_saas_theme_name', item.key)
      document.body.classList.add(item.key)
      document.body.classList.remove(this.preTheme)
      this.preTheme = item.key
      this.$nextTick(this.getColor)
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (n) {
        this.$emit('input', n)
      }
    }
  },
  watch: {
  },
  created () {
    this.currentTheme = localStorage.getItem('dj_saas_theme_name') || 'dj-erp-theme--light'
    this.preTheme = this.currentTheme
    this.getColor()
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
</style>