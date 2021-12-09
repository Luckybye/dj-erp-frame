<template>
  <div class="x-td-img" @clcik="onClick">
    <img class="img" :src="imgsrc | imgFormat('min')" />
    <span
      class="prod-icon pointer"
      v-if="tao"
      @click.stop="clickIcon"
      title="进入套件列表"
      >B</span
    >
    <span class="prod-icon text-10" v-if="zi">子</span>
    <span
      class="prod-icon pointer"
      v-if="spare"
      @click.stop="clickIcon"
      title="进入配件列表"
      >S</span
    >
    <span class="prod-icon" v-if="typeof part === 'boolean' ? part : part === 'sparepart'">P</span>
    <span v-if="!!tab" class="prod-icon">{{ tab }}</span>
  </div>
</template>
<script>
let defaultImg =
  "http://dex3.oss-cn-hangzhou.aliyuncs.com/18/9/19/543315_5ba1b541d27de6abda226a75_d4645230e001.png";
export default {
  data() {
    return {
      defaultImg,
    };
  },
  props: {
    src: {
      type: String,
      default: "",
    },
    tao: {
      type: Boolean,
      default: false,
    },
    zi: {
      type: Boolean,
      default: false,
    },
    spare: {
      type: Boolean,
      default: false,
    },
    part: {
      type: [Boolean, String],
      default: false,
    },
    tab: [String],
  },
  computed: {
    imgsrc() {
      return this.src || this.defaultImg;
    },
  },
  methods: {
    clickIcon() {
      this.$emit("click-icon");
    },
    onClick () {
      this.$emit("click");
    }
  },
  created() {
    if (this.$state("me").isMl) {
      this.defaultImg =
        "https://mldex.oss-cn-hangzhou.aliyuncs.com/20/5/7/282951_5eb3a042d8f5c949b1d0584c_98b744393301.jpg";
    }
  },
};
</script>

<style lang="scss">
.x-td-img {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #e1e1e1;
  position: relative;
  display: inline-block;
  .prod-icon {
    position: absolute;
    top: 0;
    left: 0;
    line-height: normal;
    background: red;
    font-weight: 700;
    color: white;
    padding: 1px 3px;
    z-index: 10;
    font-size: 12px;
    /*border-bottom-right-radius: 12px;*/
  }
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    -o-object-fit: contain;
    background-color: white !important;
    cursor: pointer;
  }
}
.td-image {
  @extend .x-td-img;
}
</style>
