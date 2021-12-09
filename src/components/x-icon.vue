<template>
  <div class="x-component x-icon" :style="{'font-size': size, color}" :class="['text-'+colorClass]" @click="onClick">
    <svg class="svg-icon i-core" aria-hidden="true" v-if="isSvg || isSysIcon">
      <use :xlink:href="iconName"></use>
    </svg>
    <x-img :src="icon2" v-else-if="isImg" class="i-core" :fit="fit"></x-img>
    <i :class="iconName + ' i-core'" v-else></i>
  </div>
</template>

<script>
export default {
  name: 'xicon',
  props: {
    fit: String,
    icon: {
      type: String,
      required: true,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    colorClass: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: '',
      cacheName: 'svgIconCache',
      mountedOver: false,
    }
  },
  computed: {
    icons () {
      return this.$store.getters.icons
    },
    iconName () {
      let {icon2, id, isSvg, isElIcon, isAliIcon} = this
      if (id) return '#' + id
      if (isSvg) return `#icon-${icon2}`
      if (isElIcon) return /^el-icon-/.test(icon2) ? icon2 : `el-icon-${icon2}`
      if (isAliIcon) return /^icon-/.test(icon2) ? `iconfont ${icon2}` : `iconfont icon-${icon2}`
      return ''
    },
    icon2 () {
      let {icons, icon, isSysIcon} = this
      if (isSysIcon) return (icons[icon] || icons['xcon-' + icon] || {}).url || ''
      return icon
    },
    isUrl () {
      return /^http[s]?/.test(this.icon2)
    },
    isSvg () {
      return (/\.(svg)(\?.*)?$/.test(this.icon2) && /sys/.test(this.type) && this.isUrl) || /svg/.test(this.type)
    },
    isElIcon () {
      return /^el-icon-/.test(this.icon2) || this.type === 'el'
    },
    isSysIcon () {
      return /^xcon-/.test(this.icon) || this.type === 'sys'
    },
    isAliIcon () {
      return /^icon-/.test(this.icon2) || this.type === 'ali'
    },
    isImg () {
      return this.isUrl && (this.type === 'img' || !/\.(svg)(\?.*)?$/.test(this.icon2))
    }
  },
  watch: {
    icon2 (n) {
      this.mountedOver && n && this.handlerSvgLink()
    }
  },
  methods: {
    async handlerSvgLink () {
      if (this.isSysIcon || this.isUrl) {
        let url = this.icon2
        let id
        if (this.isSysIcon) {
          id = /^xcon-/.test(this.icon) ? this.icon : 'xcon-' + this.icon
        } else id = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.')) || url
        if (!url) id = ''
        this.id = id
        if (!id) return
        let svg = document.body.querySelector('body>svg')
        let curr = svg.getElementById(id)
        if (!curr) {
          let v = await this.getData(url)
          let data = v.data.replace(/<svg/, `<symbol id="${id}"`).replace(/<\/svg>/, `</symbol>`)
          svg.innerHTML += data
        }
      }
    },
    async getData (url) {
      // console.log(url, 'urlurl')
      let uri = '/api/svg/getData?file_url=' + url
      try {
        let cache = await caches.open(this.cacheName)
        let v = await cache.match(uri)
        // console.log(cache, v, 33333)
        if (!v) {
          await cache.add(uri)
          v = await cache.match(uri)
        }
        v = await v.json()
        // throw new Error()
        // console.log(v, 55555555555)
        return v
      } catch (error) {
        let v = await this.$axios({
          headers: {
            'Cache-Control': 'public'
          },
          url: '/api/svg/getData',
          params: {file_url: url},
          method: 'get'
        })
        return v.data
      }
    },
    onClick () {
      this.$emit('click')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handlerSvgLink()
      this.mountedOver = true
    })
  }
}
</script>

<style lang="scss">
.x-icon {
  width: 1em;
  height: 1em;
  line-height: 1em;
  display: inline-block;
  cursor: pointer;
  svg {
    width: 1em;
    height: 1em;
    // vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }
  img {
    width: 1em;
    height: 1em;
  }
  .iconfont {
    font-size: inherit;
  }
}
</style>
