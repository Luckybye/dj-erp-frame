<template lang="html">
  <el-dialog
    :visible="true"
    width="800px"
    @close="onClose"
    :close-on-click-modal="false"
    class="add-part-in-prod-page"
  >
    <div slot="title" class="text-blue text-16 text-semibold">
      添加属性
    </div>

    <div class="flex wrap">
      <div class="a-item" v-for="item in allFields" :key="item.id">
        <div
          @click="selectPart(item)"
          class="a-part"
          :class="{
            selected: isSelected(item),
            disabled: isDisabled(item),
          }"
          :title="item.text"
        >
          <span class="line-1">{{ item.text }}</span>
          <span class="ml5" v-if="isSelected(item)">{{
            findIndex(item)
          }}</span>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
function initialize() {
  let type = this.billType.split('_')[0]
  let arr = window._g.getComponents(type)
  arr.sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
  this.allFields = arr
}
export default {
  data() {
    return {
      allFields: [],
      selectedPart: []
    }
  },
  computed: {},
  methods: {
    onConfirm() {
      let obj = this.allFields._object('id')
      this.onCallback(this.selectedPart.map(id => ({ part: obj[id].components, id}))).then(() => {
        this.onClose()
      })
    },
    selectPart({id}) {
      if (this.selecteds.indexOf(id) >= 0) return
      let i = this.selectedPart.indexOf(id)
      if (i >= 0) {
        this.selectedPart.splice(i, 1)
      } else this.selectedPart.push(id)
    },
    isSelected({id}) {
      return this.selectedPart.indexOf(id) >= 0
    },
    isDisabled({id}) {
      return this.selecteds.indexOf(id) >= 0
    },
    findIndex({id}) {
      return (this.selectedPart.indexOf(id) + 1) || ''
    },
  },
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss">
.add-part-in-prod-page {
  .a-item {
    padding: 5px;
    .a-part {
      color: #6d78e7;
      padding: 5px 10px;
      &.selected {
        background: red;
        color: white;
      }
      &.disabled {
        color: grey;
        cursor: not-allowed;
      }
    }
  }
}
</style>
