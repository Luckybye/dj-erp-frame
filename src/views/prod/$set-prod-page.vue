<template lang="html">
  <div class="ideal-page">
    <div class="set-prod-page" :class="{ edit: isEdit }">
      <div class="tab-page-header fill fixed-top flex-b">
        <div>
          <span v-if="isEdit" class="mr10">
            <el-button type="primary" @click="addModel">添加模块</el-button>
          </span>
          <el-button type="primary" @click="setDefaultTemp('clear')"
            >默认模板</el-button
          >
        </div>
        <div>
          <el-button @click="onInherit">继承</el-button>
          <el-button type="primary" @click="isEdit = !isEdit">{{
            isEdit ? '预览' : '编辑'
          }}</el-button>
          <el-button type="danger" @click="onSaveTemp" v-if="isEdit">保存</el-button>
        </div>
      </div>

      <div class="prod-tabs" v-if="prodTabs.length && isEdit">
        <el-checkbox-group v-model="checked">
          <el-checkbox
            v-for="item in prodTabs"
            :label="item.id"
            :key="item.id">
            <span class="text-black">{{ item.title }}
              <span v-show="checked.indexOf(item.id)>=0" class="text-red">({{checked.indexOf(item.id) + 1}})</span>
            </span>
            </el-checkbox>
        </el-checkbox-group>
        <x-label label="页面展示:" class="mt15">
          <x-check v-model="prod_setting.tabs_show_mode" expect="" class="mr20">多页签（顶部菜单）</x-check>
          <x-check v-model="prod_setting.tabs_show_mode" expect="vertical" class="mr20">多页签（左边菜单）</x-check>
          <x-check v-model="prod_setting.tabs_show_mode" expect="list" class="mr20">瀑布流（无菜单）</x-check>
          <x-check v-model="prod_setting.tabs_show_mode" expect="anchor" class="mr20">瀑布流（右侧菜单锚点）</x-check>
        </x-label>
        <x-label label="商品模块展示:" class="mt15">
          <x-check v-model="prod_setting.prod_show_mode" expect="tabs" class="mr20">多页签</x-check>
          <x-check v-model="prod_setting.prod_show_mode" expect="top_tabs" class="mr20">多页签（菜单置顶）</x-check>
          <x-check v-model="prod_setting.prod_show_mode" expect="list" class="mr20">瀑布流（无菜单）</x-check>
        </x-label>
      </div>
      <div class="smart-page">
        <prod-page
          :bill-type="payload.billType"
          :readonly="!isEdit"
          :isEdit="isEdit"
          draggable
          ref="prodPage"
          :custType="payload.cust_type"
          :isCn="isCn"
        ></prod-page>
      </div>
    </div>
  </div>
</template>
<script>
import prodPage from './set-prod-page.vue'
import { prod } from '@/lib/menus.js'

async function initialize() {
  this.instance = this.$state('me').com_id
  let type = this.payload.billType
  let v = prod[type]
  if (v) {
    this.prodTabs = v.parts
    // this.checked = v.dflt.split(',')
  }
  let set = await this.$cache.getProdSetting()
  this.checked = (set.tabs[type] || '').split(',')
  this.prod_setting = set
}

export default {
  options: { title: '商品页面配置' },
  components: { prodPage },
  data() {
    return {
      isEdit: true,
      prodTabs: [],
      checked: [],
      prod_setting: {},
    }
  },
  methods: {
    initialize,
    addModel() {
      this.$refs.prodPage.addModel()
    },
    setDefaultTemp(t) {
      this.$refs.prodPage.setDefaultTemp(t)

      let type = this.payload.billType
      let v = prod[type]
      this.checked = v.dflt.split(',')
      this.saveSet()
    },
    onSaveTemp() {
      this.$refs.prodPage.onSaveTemp()
      this.saveSet()
    },
    async saveSet() {
      let field = 'prod_setting'
      this.prod_setting.tabs = {
        ...this.prod_setting.tabs,
        [this.payload.billType]: this.checked.join(',')
      }
      await this.$configure.setValue(
        field,
        { [field]: this[field] },
        this.instance
      )
      this.$cache.getProdSetting(true)
    },
    onInherit () {
      let billType = this.payload.billType
      this.$dialog.InheritProdPage({billType}, d => {
        this.$refs.prodPage.datas = d
      })
    },
  },
  computed: {
    isCn () {
      return this.$i18n.locale === 'cn'
    }
  },
  created() {
    this.initialize()
  },
}
</script>
<style lang="scss">
.set-prod-page {
  position: relative;
}
</style>
