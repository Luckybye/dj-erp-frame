<template>
  <div class="fair-qrcode">
    <div class="qrcode">
      <canvas ref="qrcode"></canvas>
      <!-- <img :src="logo" alt="" v-if="logo"> -->
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
// import QRious from 'qrious'
export default {
  name: 'qrcode',
  props: {
    size: {
      type: Number,
      default: 200
    },
    logo: {
      type: [Boolean, String],
      default: 'https://mldex.oss-cn-hangzhou.aliyuncs.com/20/2/21/282773_5e4f91063280cbec7b0143d7_df85ac591c01.jpg'
    },
    value: ''
  },
  data () {
    return {
      qrcode: ''
    }
  },
  methods: {
    async init () {
      this.qrcode = new QRious({
        background: 'transparent',
        backgroundAlpha: 0.8,
        foreground: 'black',
        foregroundAlpha: 0.8,
        level: 'H',
        padding: 0,
        size: this.size,
        value: this.value,
        element: this.$refs.qrcode
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 1000)
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss">
.fair-qrcode {
  .qrcode {
    display: inline-block;
    position: relative;
    img {
      position: absolute;
      width: 20%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
