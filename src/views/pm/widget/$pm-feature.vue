<template lang="html">
  <div class="pm-feature">
    <feature
      :bill-id="payload.prod_id"
      collection="prod_infos"
      field="attachment"
      @preview="onPreviewHandle"
      :payload="payload"
      ref="feature"
    ></feature>
  </div>
</template>
<script>
import Feature from "./features.vue";
export default {
  options: { title: "Feature" },
  data() {
    return {};
  },
  methods: {
    initialize() {
      // this.$refs.billFile.refresh()
    },
    addComment() {
      // this.$refs.billFile.addExtraFileAndComment()
    },
    onPreviewHandle(item) {
      // let v = {
      //   ...this.payload,
      //   ...item
      // }
      // this.changePart('BillPreview', v)
    },
  },
  components: {
    Feature,
  },
  created() {},
};
</script>
