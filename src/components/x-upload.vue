<template>
  <div class="x-component x-upload" :style="{width, '--imgWidth': imgWidth2}" :class="{overlimit:(!onlyOne && limit && vmodel.length >= limit), 'only-one': onlyOne, 'has-img': vmodel, 'uploading': uploading, 'popover': listType==='popover'}">
    <el-upload
      action="#"
      :list-type="listType2"
      autoUpload
      :http-request="fileUpload"
      :show-file-list="showFileList && listType!=='popover'"
      :file-list="filesList"
      :multiple="multiple && !onlyOne"
      ref="elUpload"
      :drag="drag"
      :class="'upload-' + listType2"
      :limit="onlyOne ? 1 : limit"
      :on-exceed="onExceed"
      :accept="accept"
      :disabled="disabled">
      <div class="x-upload-btn" v-if="!disabled">
        <template v-if="!$slots || !$slots.default">
          <el-button type="primary" v-if="listType2==='text'">{{$t('upload')}}</el-button>
          <i
            v-else
            slot="default"
            class="el-icon-plus"
            style="line-height: inherit"
          ></i>
        </template>
        <slot v-else></slot>
      </div>
      <div slot="file" slot-scope="{file}" class="file-item">
        <template v-if="listType2==='text'">
          <a class="el-upload-list__item-name inline-block" :href="file.url" :download="file.file_name" target="_blank">
            <i class="el-icon-document"></i>
            {{file.file_name}}
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" @click="onDelete(file)" v-if="!disabled"></i>
        </template>

        <div v-if="listType2==='picture-card'" class="card-item">
          <x-img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
            preview
            :filename="file.file_name || file.name"
            :size="format"
          ></x-img>
          <span
            v-if="!disabled"
            class="picture-card-delete"
            @click="onDelete(file)"
          >
            <i class="el-icon-close"></i>
          </span>
          <!-- 进度条 -->
          <el-progress type="circle" :percentage="file.percentage" v-if="file.percentage && file.percentage < 100" :width="parseInt(imgWidth2) - 10"></el-progress>
        </div>

        <slot name="extend" :file="file"></slot>
      </div>
    </el-upload>
    <el-popover placement="bottom" width="400" trigger="click"  v-if="listType==='popover' && filesList.length" popper-class="upload-popper">
      <i class="el-icon-document a-link lh-30" slot="reference"></i>
      <table width="100%" class="sample-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th v-if="!disabled">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in filesList" :key="file.url">
            <td>
              <a :href="file.url" target="_blank" class="a-link">
                {{file.file_name}}
              </a>
            </td>
            <td width="50%" v-if="!disabled">
              <i class="el-icon-delete text-17 text-red" @click="onDelete(file)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </el-popover>
  </div>
</template>

<script>
/* eslint-disable */
import OSS from '../utils/oss'

function onUploadFile ({file}) {
  this.uploading = true
  let vFile = this.$refs.elUpload.uploadFiles.find(f => f.uid === file.uid) || {url: ''}

  if (this.limitSize && (vFile.size / 1024) > this.limitSize) {
    return this.$message('文件大小不能超过' + this.limitSize / 1024 + 'M')
  }

  vFile.file_name = file.name
  this.setFileType(vFile)
  console.log(file.type, 'file.typefile.type')
  if (/video\//.test(file.type)) this.$h.getVideoDuration(vFile)
  const progress = p => {
    vFile.percentage = parseInt(p * 100, 10)
    return function(done) {
      done()
    }
  }
  let abort = abortHandler => {
    vFile.abortHandler = abortHandler
  }
  this.onlyOne || this.vmodel.push(vFile)
  return OSS()().uploadfile({
    file: file,
    space: this.bucketType || vFile.fileType,
    progress,
    abort
  }).then(data => {
    Object.assign(vFile, data)
    delete vFile.raw
    delete vFile.percentage
    delete vFile.status
    if (this.onlyOne) {
      this.vmodel = vFile.url
      this.$emit('finish', vFile)
    } else {
      this.$emit('finish', this.vmodel, vFile.url)
    }
    this.$emit('change', vFile)
    if (this.file_name) this.result[this.file_name] = vFile.file_name
    if (this.field) this.$emit('save', {[this.field]: this.vmodel})
    this.uploading = false
  }).catch(() => {
    this.uploading = false
  })
}
export default {
  name: 'x-upload',
  props: {
    listType: {
      type: String,
      // text/picture-card
      default: 'picture-card'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    files: {
      type: Array,
    },
    result: {
      type: Object,
      default() {
        return {}
      }
    },
    field: String,
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: true
    },
    imgWidth: {
      type: [String],
      default: '100px'
    },
    value: [String, Array],
    accept: {
      default: ''
    },
    limit: [Number],
    width: [String],
    only: [Boolean],
    fit: String,
    limitSize: {
      type: Number,
      default: 100 * 1024
    },
    file_name: {
      type: String,
      default: ''
    },
    format: String,
    bucketType: String, // img,doc,cache,mail,temp,plugs,cloud
  },
  computed: {
    listType2 () {
      // text/picture/picture-card
      let {listType} = this
      if (listType.includes('picture')) return 'picture-card'
      return 'text'
    },
    onlyOne () {
      return !Array.isArray(this.vmodel)
      // return this.only
      //  || this.limit === 1
    },
    imgWidth2 () {
      let {imgWidth, width} = this
      if (/px/.test(width) && /px/.test(imgWidth)) {
        if (parseInt(imgWidth) > parseInt(width)) return width
      }
      return imgWidth
    },
    vmodel: {
      get () {
        let {field, result, files, value} = this
        let val = value
        if (files) val = files
        if (result && field) {
          val = result[field]
        }
        return val
      },
      set (n) {
        let {field, result, files} = this
        if (result && field) {
          result[field] = n
        } else if (files) {
          files = n
        } else this.$emit('input', n)
      }
    },
    filesList () {
      // let arr = []
      // if (this.$refs.elUpload) {
      //   let uploadFiles = this.$refs.elUpload.uploadFiles
      // }
      // if (arr.length) return arr
      let rst = this.vmodel || ''
      if (this.onlyOne && rst) {
        let v = {
          file_name: this.result[this.file_name],
          url: rst
        }
        rst = [v]
        v.file_name || this.getName(v)
      }
      return rst || []
    }
  },
  watch: {
  },
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    fileUpload(file) {
      this.onUploadFile(file)
    },
    onUploadFile,
    isImg(file) {
      let fileName = file.file_name || file.name || file.url
      return this.$h.isImg(fileName)
    },
    setFileType(file) {
      this.isImg(file) ? (file.fileType = 'img') : (file.fileType = 'doc')
    },
    onDelete (file, i) {
      if (file.percentage && file.percentage < 100 && file.abortHandler) file.abortHandler()
      if (this.onlyOne) {
        this.vmodel = ''
        this.$emit('delete', file)
        if (this.file_name) {
          this.result[this.file_name] = ''
        }
        if (this.field) this.$emit('save', {[this.field]: ''})
      } else {
        let index = this.vmodel.findIndex(f => f.url === file.url)
        this.vmodel.splice(index, 1)
        this.$emit('delete', this.vmodel, file)
        if (this.field) this.$emit('save', {[this.field]: this.vmodel})
      }
      this.$emit('change', file)
    },
    handleDownload(file) {
      this.$h.download(file.url, file.file_name)
    },
    onExceed () {
      this.$message('超出最大上传限制' + (this.limit || 1) + '个')
    },
    getName (v) {
      let url = this.$imgFormat(v.url, this.format)
      let req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send(null);
      let headers = req.getAllResponseHeaders();
      let name = (headers.match(/filename=([^\n]*)/) || [])[1]
      if (name) name = decodeURIComponent(name)
      v.file_name = name || v.url.slice(Math.max(v.url.length - 10, 0))
    }
    // async getName () {
    //   let res = await this.$axios(this.vmodel + '?x-oss-process=image/info')
    //   console.log(res, 'resresresresresresresresres')
    // }
  },
  mounted() {
  },
  beforeDestroy() {}
}
</script>

<style lang="scss">
.x-upload {
  display: inline-block;
  width: 100%;
  --imgWidth: 100px;

  // 上传按钮
  .el-upload--picture-card, .el-upload--text {
    width: auto;
    height: auto;
    line-height: normal;
    .el-upload-dragger {
      width: auto;
      height: auto;
      overflow: initial;
      background: transparent;
    }
    .x-upload-btn {
      width: var(--imgWidth);
      height: var(--imgWidth);
      line-height: var(--imgWidth);
    }
  }
  .el-upload--text {
    .el-upload-dragger {
      border: 0;
    }
    .x-upload-btn {
      width: auto;
      height: auto;
      line-height: normal;
    }
  }

  // 上传列表
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: auto;
      height: auto;
      transition: none;
      &:hover {
        .picture-card-delete {
          opacity: 1;
        }
      }
    }
    .card-item {
      width: var(--imgWidth);
      height: var(--imgWidth);
    }
    .el-progress {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.6);
      .el-progress-circle {
        margin: 5px auto;
      }
    }
  }
  .el-upload-list--text {
    .el-upload-list__item {
      margin-top: 0;
    }
  }

  .picture-card-delete {
    position: absolute;
    right: -2px;
    top: -2px;
    display: inline-block;
    height: 15px;
    line-height: 15px;
    width: 15px;
    background: #afadad;
    border-radius: 50%;
    text-align: center;
    opacity: 0;
    z-index: 1;
    .el-icon-close {
      display: inline-block;
      position: static;
      color: white;
      font-size: 12px;
    }
    &:hover {
      background: red;
    }
  }

  &.overlimit .el-upload {
    display: none;
  }
  &.only-one {
    &.has-img, &.uploading {
      .el-upload {
        display: none;
      }
    }
  }

  &.popover {
    .upload-text {
      display: inline-block;
    }
  }
}

.upload-popper {
  --bg-color: rgba(237,239,242,1);
  padding: 0;
  table {
    text-align: center;
    thead {
      background: var(--bg-color);
    }
  }
  .popper__arrow:after {
    border-bottom-color: var(--bg-color) !important;
  }
}
</style>
