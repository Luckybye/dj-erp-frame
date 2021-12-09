/* eslint-disable */
import Vue from 'vue'
export default function () {
  let DEX_HOST_NAME
  DEX_HOST_NAME = DEX_HOST_NAME || window.location.href.match(/^(http[s]*:\/\/[^/]+)/)[0]

  function createClient (result) {
    let creds = result.credentials
    let oss = new OSS({
      region: result.region,
      accessKeyId: creds.AccessKeyId,
      accessKeySecret: creds.AccessKeySecret,
      stsToken: creds.SecurityToken,
      bucket: result.bucket,
      endpoint: 'https://oss-cn-hangzhou.aliyuncs.com:443',
      secure: true
    })
    return oss
  };

  function uploadfile ({file, space, progress, abort, busi_type, file_path, root_path, ossid, bucket}) {
    // 文件删除由外部处理，内部只实现MultipartUpload真正删除
    // 非常重要
    // 要使用abort功能，需要修改SDK源码multipartUpload里面添加 options.__checkpoint__ = checkpoint 传出初始化的参数
    let self = this
    if (!file) return Promise.resolve(new Error('file is null!'))
    let input = {
      type: space || '',
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      busi_type,
      parent_id: 7777,
      file_path,
      root_path,
      ossid,
      bucket
    }
    // return postJson(DEX_HOST_NAME + '/api/system/apply_oss_res',input)
    // .then(function(result){
    // var client= createClient(result);
    // var ossres={objectId:result.objectId,filename:file.name,size:file.size,filetype:file.type,
    // bucket:result.bucket,ossid:result.ossid,platform:'oss',status:'uploading'};
    // console.log(ossres);
    let isUploadComplete = false
    let isCancel = false
    let abortInner = null
    let tryCount = 0
    function realAbort (client, name, uploadId) {
      if (tryCount > 10 || isUploadComplete) return
      client.abortMultipartUpload(name, uploadId).then(function () {
      }, function (e) {
        return e
      }).then(function (e) {
        e && console.log(typeof e.status)
        if (e instanceof Error && e.status === 404 && e.code === 'NoSuchUpload') {
          // 终止成功,不做处理，会导致上传的任务失败
        } else {
          setTimeout(function () {
            realAbort(client, name, uploadId)
          }, 1000)
        }
      })
      tryCount++
    }

    function doAbort () {
      if (tryCount > 10 || isUploadComplete) return
      if (!abortInner || !abortInner()) {
        setTimeout(function () {
          doAbort()
        }, 1000)
      }
      tryCount++
    }

    // 调试使用
    // setTimeout(function () {
    //  doAbort()
    // }, 200)

    function abortHandler () {
      // 改函数可以多次执行
      if (isUploadComplete || isCancel) return
      isCancel = true
      doAbort()
    }
    abort && abort(abortHandler.bind(self))
    let p = Vue.prototype.$get(DEX_HOST_NAME + '/api/system/apply_oss_object', input, {loading: false}).then(function (resp) {
      let opts = {headers: {
        'Content-Disposition': 'inline; filename=' + encodeURIComponent(file.name),
        'Cache-Control': 'max-age=31536000',
        // 'Access-Control-Expose-Headers': 'Content-Disposition'
      }}
      progress && (opts.progress = progress)
      // abortMultipartUpload name, uploadId, options listUploads
      if (isCancel) return Promise.resolve(new Error('上传已取消'))
      // 需要在源码multipartUpload里面添加 options.__checkpoint__ = checkpoint 传出初始化的参数
      // 改参数可以作为以后断点续传使用
      var client = createClient(resp)
      abortInner = function () {
        if (!opts.__checkpoint__) return
        let checkpoint = opts.__checkpoint__
        let abortClient = createClient(resp)
        realAbort(abortClient, checkpoint.name, checkpoint.uploadId)
        return true
      }
      var p = client.multipartUpload(resp.ossid, file, opts).then(function (res) {
        isUploadComplete = true
        // return postJson(DEX_HOST_NAME + '/api/system/complete_oss_object',
        //     {
        //       objectId: resp.objectId,
        //       file_name: file.name,
        //       file_size: file.size,
        //       busi_type: 'PERSON_DISK',
        //       oss_id: resp.ossid,
        //       status: 'complete'
        //     }).then(function (res) {
        //   return {oss_id: resp.ossid, file_name: file.name, size: file.size, url: resp.url}
        // })
        return {oss_id: resp.ossid, file_name: file.name, size: file.size, url: resp.url}
      })
      p = p.then(function (v) {
        return v
      }, function (e) {
        // 表示失败了,如果正在上传的文件终止了，也会走到该失败流程中
        isUploadComplete = true
        return Promise.resolve(e)
      })
      return p
    })
    return p
  }

  function downloadfile (objectId) {
    let input = {objectId: objectId}
    let p = Vue.prototype.$get(DEX_HOST_NAME + '/api/system/query_oss_object', input).then(function (ossres) {
      if (!ossres.ossid) {
        return Promise.resolve(new Error('ossid is null!'))
      }
      return Vue.prototype.$get(DEX_HOST_NAME + '/api/system/apply_oss_access', ossres).then(function (result) {
        var client = createClient(result)
        var signossurl = client.signatureUrl(ossres.ossid, {
          response: {
            'content-disposition': 'attachment; filename="' + ossres.filename + '"'
          }
        })
        // window.location = signossurl
        // ossres.signossurl = signossurl
        return signossurl
      })
    })
    return p
  }

  return function () {
    let self = this
    return {
      uploadfile: uploadfile.bind(self),
      downloadfile: downloadfile.bind(self)
    }
  }
}
