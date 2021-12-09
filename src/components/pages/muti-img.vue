<template>
  <div class="muti-img" :style="tstyle">
    <div v-if="imgs && imgs.length" class="i-box">
      <div class="img" v-for="(item, i) in imgs.slice(0, 4)" :key="item[field] + (i + '')" :class="{'one-img': imgs.length === 1}"  >
        <img :src="(item[field] || defaultImg) | imgFormat(format)" alt="" class="object-fit core">
      </div>
    </div>
    <template v-else>
      <a :href="url" target="_blank" v-if="isDoc(url)" class="object-fit doc">
        <i class="iconfont" :class="[isPdf ? 'icon-pdf':'icon-file2']" style="font-size:30px;"></i>
      </a>
      <div class="video-box" v-else-if="isVideo(url)" :style="ImgStyle">
        <video :src="url" :controls="controls" class="core" :poster="url+'?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast'"></video>
        <i class="el-icon-video-play play-btn" v-if="!controls"></i>
      </div>
      <template v-else>
        <img :src="(url || defaultImg) | imgFormat(format)" alt="" class="object-fit core" v-if="preview"  v-img-preview="{event: 'click'}" :style="ImgStyle">
        <img :src="(url || defaultImg) | imgFormat(format)" alt="" class="object-fit core" v-else :style="ImgStyle">
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
const defaultImg = 'https://mldex.oss-cn-hangzhou.aliyuncs.com/20/5/7/282951_5eb3a042d8f5c949b1d0584c_98b744393301.jpg'
export default {
  components: {
  },
  props: {
    imgs: {
      type: Array,
      default () {
        return []
      }
    },
    preview: {
      type: Boolean,
      default: false
    },
    field: {
      type: String,
      default: 'url'
    },
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: ''
    },
    imgWidth: {
      type: String,
      default: '100%'
    },
    imgHeight: {
      type: String,
      default: '100%'
    },
    url: String,
    format: {
      type: String,
      default: 'middle'
    },
    controls: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      defaultImg
    }
  },
  computed: {
    tstyle () {
      return {
        width: this.width,
        height: this.height || this.width
      }
    },
    ImgStyle () {
      return {
        width: this.imgWidth,
        height: this.imgHeight
      }
    }
  },
  methods: {
    isDoc (str) {
      return /\.(pdf|xlsx|xls|word)$/i.test(str)
    },
    isPdf (str) {
      return /\.(pdf)$/i.test(str)
    },
    isVideo (str) {
      return /\.(WebM|ogg|mp4)$/ig.test(str)
    },
    videoClickHandle ($event) {
      // if ($event.target.paused) $event.target.play()
      // else $event.target.pause()
    }
  }
}
</script>

<style lang="scss">
  .muti-img {
    text-align: center;
    display: inline-block;
    .i-box {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      height: 100%;
    }
    .img {
      width: 50%;
      height: 50%;
      &.one-img {
        width: 100%;
        height: 100%;
      }
    }
    .doc {
      display: inline-block;
      border: 1px solid #eeeeee;
      padding: 0.3rem;
    }
    .video-box {
      position: relative;
      .play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 0.3rem;
        transform: translate(-50%, -50%);
        color: grey;
      }
    }
    video {
      width: 100%;
      height: auto;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
