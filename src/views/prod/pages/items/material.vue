<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_material" colon>材料:</t>

    <div v-if="materials.length" class="flex-1">
      <x-select width="100%" field="prod_material" :result="viewModel" :source="materials" :map="{label: isCn?'cn':'en',value:'cn'}" filter="filter" :disabled="readonly" @change="onSaveMaterial"></x-select>
    </div>

    <div v-else class="flex-line flex-1">
      <x-input width="100%" :field="isCn ? 'prod_material' : 'prod_material_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" >
        <div @click="onTranslate('prod_material_en', 'prod_material')" slot="append" class="translate-icon">
          <x-icon icon="translate" colorClass="primary" title="translate" type="svg"></x-icon>
        </div>
      </x-input>
    </div>
  </el-form-item>
</template>
<script>
async function initialize () {
  this.materials = ((await this.$cache.getMaterials()) || []).map(m => {
    m.filter = [m.en, m.cn].join('~')
    return m
  })
}
export default {
  data () {
    return {
      materials: []
    }
  },
  methods: {
    initialize,
    onSaveMaterial (item) {
      if (item) {
        this.viewModel.prod_material_en = item.en
        this.viewModel.prod_material = item.cn
        let {prod_material_en, prod_material} = this.viewModel
        this.onSaveInner({prod_material_en, prod_material})
      }
    }
  },
  created () {
    this.initialize()
  },
  mixins: []
}
</script>
<style>
</style>
