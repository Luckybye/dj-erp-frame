var fs = require('fs')
const glob = require('glob')
/**
 * JS文件拷贝
 * @param src
 * @param dst
 */
var copyFile = function (src, dst) {
  fs.readFile(src, 'utf8', function (error, data) {
    if (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    }
    fs.writeFile(dst, data.toString(), 'utf8', function (error) {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        return false
      }
      fs.unlink(src, function () { // css删除成功
      })
    })
  })
}

// 移动precache-manifest文件到pwa文件夹
glob.sync('./dist/precache-manifest.*.js').forEach((filepath, name) => {
  let copyName = filepath.split('/')[2]
  let changeDirectory = `./dist/portal/pwa`
  fs.mkdirSync(changeDirectory)
  copyFile(filepath, `${changeDirectory}/${copyName}`)
})

fs.unlink('./dist/service-worker.js', () => {})
// 修改service-worker文件
// fs.readFile('./dist/service-worker.js', 'utf8', function (error, data) {
//   if (error) {
//     // eslint-disable-next-line no-console
//     console.log(error)
//     return false
//   }
//   let htmlContent = data.toString().replace('/precache-manifest.', '/portal/pwa/precache-manifest.')
//   fs.writeFile('./dist/service-worker.js', htmlContent, 'utf8', function (error) {
//     if (error) {
//       // eslint-disable-next-line no-console
//       console.log(error)
//       return false
//     }
//   })
// })