<template>
  <div class="x-no-data">
    <div v-if="show">
      <div class="nodata-img" v-if="img">
        <template v-if="!$slots.img">
          <img :src="img"/>
        </template>
        <slot v-else name="img"></slot>
      </div>

      <div class="nodata-desc">
        <template v-if="!$slots.desc">
          {{desc}}
        </template>
        <slot v-else name="desc"></slot>
      </div>

      <slot></slot>
    </div>
  </div>
</template>
<script>
let defaultImg =
  "https://dxdoc3.wokelink.com/21/8/30/808478_612c504bc9d8ad43f363477e_9b358dd08701.png";
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    img: {
      type: String,
      default: defaultImg,
    },
    desc: {
      type: String,
      default: "暂无数据",
    },
    wait: {
      type: [String, Boolean, Promise],
      default: "1000",
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
    let wait = this.wait
    if (wait instanceof Promise) {
      wait.then(() => (this.show = true))
    } else {
      setTimeout(() => {
        this.show = true
      }, wait * 1 || 0)
    }
  },
  created() {
  },
};
</script>

<style lang="scss">
.x-no-data {
  line-height: normal;
  text-align: center;
  padding: 20px;
  .nodata-img {
    padding: 10px;
    img {
      width:200px;
    }
    &+.nodata-desc {
      line-height: normal;
    }
  }
  .nodata-desc {
    margin-top: 10px;
    color: grey;
    line-height: 50px;
  }
}
</style>
