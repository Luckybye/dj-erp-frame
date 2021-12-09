<template lang="html">
  <div class="editor">
    <div class="toolbar-wrap">
      <div ref="toolbar" class="toolbar"></div>
      <div class="slot"><slot></slot></div>
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import OSS from '../utils/oss'

// async function upload(file) {
//   try {
//     let result = await client.put(file.ossid, file)
//     return {
//       name: file.name,
//       url: result.url,
//       size: file.size,
//       type: file.type
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }
export default {
  name: 'Editor',
  data() {
    return {
      editor: null,
      info_: null,
      initValue: true,
      range: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value(n, o) {
      // 使用 v-model 时，设置初始值
      if (this.initValue) {
        this.editor.txt.html(n)
        // this.initValue = !n
        // console.log(this.initValue, 'initValue')
      }
    }
  },
  created() {
  },
  mounted() {
    this.seteditor()
  },
  methods: {
    // upload,
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
      // this.editor.customConfig.uploadImgServer = ''// 配置服务器端地址
      // this.editor.customConfig.uploadImgHeaders = {      }// 自定义 header
      // this.editor.customConfig.uploadFileName = '' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 3 // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      // this.editor.customConfig.uploadImgHooks = {
      //   fail: (xhr, editor, result) => {
      //     console.log(11111111)
      //     // 插入图片失败回调
      //   },
      //   success: (xhr, editor, result) => {
      //     console.log(222222)
      //     // 图片上传成功回调
      //   },
      //   timeout: (xhr, editor) => {
      //     // 网络超时的回调
      //   },
      //   error: (xhr, editor) => {
      //     // 图片上传错误的回调
      //   },
      //   customInsert: (insertImg, result, editor) => {
      //     console.log(11111111, insertImg, result, editor)
      //     // 图片上传成功，插入图片的回调
      //   }
      // }
      this.editor.customConfig.onchange = html => {
        if (html === '<p><br></p>') html = ''
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      this.editor.customConfig.customUploadImg = (files, insert) => {
        if (!files.length) return
        Array.from(files).forEach(item => {
          item.fileType = 'doc'
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(item.name)) item.fileType = 'image'
          OSS()().uploadfile({
            file: item,
            space: item.fileType,
            abort: () => {}
          }).then(data => {
            insert(data.url)
          })
        })
      }
      this.editor.customConfig.onblur = html => {
        // html 即编辑器中的内容
        // console.log('onblur', html)
        // if (html === '<p><br></p>') this.clear()
        // else this.editor.txt.html(html)
        // this.$refs.editor && this.$refs.editor.querySelector('.w-e-text').blur()
        this.$emit('on-blur')
        this.removeEventListener()
      }
      this.editor.customConfig.onfocus = html => {
        this.initValue = false
        this.addEventListener()
      }
      // 创建富文本编辑器
      this.editor.create()
      this.editor.txt.html(this.value)// 异步问题，未检测到value值的变化
      if (this.$refs.editor) {
        this.$refs.editor.querySelector('.w-e-text').blur()
      }
    },
    clear () {
      this.editor.txt.clear()
      this.info_ = null
    },
    addEventListener () {
      if (!this.$refs.editor) return
      let root = this.$refs.editor.querySelector('.w-e-text')
      root.addEventListener("mouseup", this.saveCurrentRange, false);
      root.addEventListener("keyup", this.saveCurrentRange, false);
      root.addEventListener("mouseout", this.saveCurrentRange, false);
    },
    removeEventListener () {
      if (!this.$refs.editor) return
      let root = this.$refs.editor.querySelector('.w-e-text')
      root.removeEventListener("mouseup", this.saveCurrentRange);
      root.removeEventListener("keyup", this.saveCurrentRange);
      root.removeEventListener("mouseout", this.saveCurrentRange);
    },
    saveCurrentRange: function saveCurrentRange() {
      if (!this.$refs.editor) return
      let root = this.$refs.editor.querySelector('.w-e-text')
      var selection = window.getSelection ? window.getSelection() : document.getSelection();
      var range = selection.rangeCount ? selection.getRangeAt(0) : null;
      if (!range) {
        return;
      }
      if (root.contains(range.startContainer) && root.contains(range.endContainer)) {
        this.range = range;
      }
    },
  },
  beforeDestroy () {
    this.removeEventListener()
  }
}
</script>

<style lang="scss">
.editor {
  width: 100%;
  margin: 0 auto;
  .toolbar-wrap {
    border: 1px solid #ccc;
    // height: 42px;
    .toolbar {
      display: inline;
      &>div {
        display: inline-block;
      }
    }
    .slot {
      padding: 5px 10px;
      display: inline-block;
    }
  }
  .w-e-menu {
    z-index: 11 !important;
  }
  .text {
    border: 1px solid #ccc;
    height: 400px;
    z-index: 10 !important;
  }
  .w-e-text {
    overflow-y: auto;
  }
}
</style>