<template>
  <div :style="{width: width, height: height}" class="x-img" :title="title || filename || ''">
    <img :src="src2 | imgFormat(size)" alt="" v-img-preview="{disabled: !preview}" v-if="isImg()" :style="{'object-fit': fit}" @load="load">

    <template v-else>
      <video preload controls width="100%" height="100%" @click="videoClickHandle" :src="src2" v-img-preview="{disabled: !preview}" v-if="isVideo()"></video>

      <a :href="src2" :download="filename" target="_blank" v-else style="height:100%;width:100%;" class="flex-middle text-center" :title="filename">
        <i class="iconfont text-grey" :class="['el-icon-' + (isPdf() ? 'document':'document')]" style="font-size:25px"></i>
        <div class="text-12 text-grey">
          <span class="line-2" style="-webkit-box-orient: vertical;">{{filename}}</span>
        </div>
      </a>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      defaultImg: 'http://dxcach1.wokelink.com/img/waiting.png'
    }
  },
  methods: {
    isImg () {
      let str = this.src2
      // 后缀不存在，默认为图片(宁波雅特的图片没有格式，写此兼容)
      let isNotExit = false
      if (str.length >= 5) {
        let arr = str.slice(str.length - 5, str.length).split('.')
        isNotExit = !arr[1]
      }
      return this.$h.isImg(str) || isNotExit || !str
    },
    isDoc () {
      let str = this.src2
      return /\.(pdf|xlsx|xls|word)$/i.test(str)
    },
    isPdf () {
      let str = this.src2
      return /\.(pdf)$/i.test(str)
    },
    isVideo () {
      let str = this.src2
      return /\.(WebM|ogg|mp4)$/ig.test(str)
    },
    videoClickHandle ($event) {
      if ($event.target.paused) $event.target.play()
      else $event.target.pause()
    },
    load () {
      this.$emit('load')
    }
  },
  props: {
    width: String,
    height: String,
    src: String,
    filename: String,
    fit: String,
    size: String,
    preview: {
      type: Boolean,
      default: false
    },
    title: String
  },
  watch: {
  },
  computed: {
    src2 () {
      return this.src || this.defaultImg
    }
  },
  created () {
    setTimeout(() => {
      if (!this.src) this.defaultImg = 'https://dxcach1.wokelink.com/img/no-picture.png'
    }, 2000)
  }
}
</script>

<style lang="scss">
.x-img {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
