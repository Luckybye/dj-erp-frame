<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>公司国别:</t>
    <select-country :result="vm" field="country_id" width="100%" @change="onSelectCountry" :disabled="disabled" :disabledMap="disabledMap"></select-country>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    onSelectCountry(v) {
      this.vm.country = v.name_en
      let {country, country_id} = this.vm
      this.$emit('save', {country, country_id})
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
