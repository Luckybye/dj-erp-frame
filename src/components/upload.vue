<template>
  <div class="ideal-upload-core-wrap-comm">
    <div
      @click="onOpen"
      v-if="!disabled && files.length < maxLength"
      class="upload-btn-wrap border-activeColor-hover text-activeColor-hover mb10"
      :style="{width: width, height: height || width}"
    >
      <form
        ref="uploadForm"
        class="text-center flex-middle"
      >
        <input
          :type="type"
          class="ideal-upload-core"
          ref="uploadFile"
          @change="onChangeFile"
          :multiple="multiple"
        >
        <i
          class="el-icon-plus uploader-icon"
          v-if="!$slots || !$slots.default "
        ></i>
        <slot></slot>
      </form>
    </div>
    <div
      class="file-list"
      v-if="showFileList"
    >
      <div
        class="file"
        v-for="(item, i) in files"
        :key="item.url"
        :style="{width: width, height: height || width}"
      >
        <div
          v-if="isImg(item)"
          class="border border-whitegrey img"
        >
          <img
            :src="item.url"
            width="100%"
            height="100%"
            :style="{'object-fit': objectFit}"
          >
          <i
            class="el-icon-delete text-red delete"
            @click="onDeleteFile(i)"
          ></i>
        </div>
        <div
          v-else
          class="doc"
        >
          <a
            class="file-name text-activeColor"
            :href="item.url"
            :download="getFileName(item)"
          >
            {{getFileName(item)}}
          </a>
          <i
            class="el-icon-delete ml10 text-red delete"
            @click="onDeleteFile(i)"
          ></i>
        </div>
        <!--<a :href="item.url" :download="item.file_name" class="file-name" @click.stop="">-->
        <!--<i class="el-icon-document"></i>-->
        <!--{{item.file_name}}-->
        <!--</a>-->
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import OSS from '../utils/oss'
let uploadfile
function onUploadFile(file) {
  const self = this
  if (this.limitSize && file.size / 1024 > this.limitSize) {
    return this.$message('文件大小不能超过' + this.limitSize + 'K')
  }
  let opt = {
    file_name: file.name,
    file_size: file.size,
    stauts: 0
  }
  let vFile = {
    x_file: null,
    [self.field]: '',
    x_progressPercent: 0,
    file_name: ''
  }
  vFile['x_file_name'] = file.name
  const progress = p => {
    if (p === 1) {
    }
    vFile['x_progressPercent'] = parseInt(p * 100, 10)
    return function(done) {
      done()
    }
  }
  let abort = abortHandler => {
    vFile['abortHandler'] = function() {
      return abortHandler()
    }
  }
  return uploadfile({ file: file, space: file.fileType, progress, abort }).then(
    data => {
      vFile = Object.assign(vFile, opt, data)
      vFile[self.field] = data.url
      self.files.push(vFile)
    }
  )
}

function setFileType(file) {
  this.isImg(file) ? (file.fileType = 'img') : (file.fileType = 'doc')
}

export default {
  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    limitSize: {
      type: Number,
      default: 100 * 1024
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    maxLength: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '178px'
    },
    height: {
      type: String,
      default: ''
    },
    objectFit: {
      type: String,
      default: 'contain'
    },
    type: {
      type: String,
      default: 'file'
    },
    result: {
      type: Object,
      default() {
        return {}
      }
    },
    field: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    setFileType,
    onChangeFile() {
      let files = this.$refs.uploadFile.files
      if (!files.length) return
      if (this.files.length > this.maxLength)
        return this.$message('Maximum quantity exceeded')
      let ps = Array.from(files).map(file => {
        this.setFileType(file)
        return onUploadFile.call(this, file)
      })
      Promise.all(ps).then(data => {
        if (this.maxLength === 1)
          this.result[this.field] = (this.files[0] || {}).url
        this.$emit('finished', this.files)
        // this.$message(this.$t('upload_finish'))
      })
    },
    onOpen() {
      if (this.disabled) return
      this.$refs.uploadFile.click()
    },
    resetFile() {
      this.$refs.uploadForm.reset()
    },
    onDeleteFile(index) {
      this.files.splice(index, 1)
      this.$emit('finished', this.files)
      if (this.maxLength === 1) this.result[this.field] = ''
      console.log('onDeleteFile')
    },
    isImg(file) {
      let fileName = file.file_name || file.url || file.name
      return /\.(bmp|jpg|jpeg|png|tif|tiff|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jfif)$/gi.test(
        fileName
      )
    },
    getFileName(file) {
      console.log(file)
      if (file.file_name) {
        return file.file_name
      } else {
        let arr = file.url.split('/')
        return arr[arr.length - 1]
      }
    }
  },
  mounted() {
    OSS({}).then(fun => {
      uploadfile = fun().uploadfile
    })
  }
}
</script>
<style lang="scss">
.ideal-upload-core-wrap-comm {
  .ideal-upload-core {
    display: none;
  }
  .upload-btn-wrap {
    width: 100%;
    height: 100%;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    form {
      width: 100%;
      height: 100%;
    }
    .uploader-icon {
      font-size: 28px;
    }
  }
  .file-list {
    box-sizing: border-box;
    .file {
      line-height: 0.2rem;
      position: relative;
      white-space: nowrap;
      .img {
        height: 100%;
        .delete {
          position: absolute;
          top: 1px;
          right: 1px;
          line-height: inherit;
          padding: 1px 3px;
          background: white;
          cursor: pointer;
          opacity: 0.7;
          &:hover {
            opacity: 1;
          }
        }
      }
      .file-name {
        color: #606266;
        margin-right: 10px;
        // display: block;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
      // .delete {
      //   position: absolute;
      //   top: 0;
      //   line-height: inherit;
      //   right: 0.2rem;
      // }
    }
  }
}
</style>
