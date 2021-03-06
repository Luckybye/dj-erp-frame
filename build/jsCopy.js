var fs = require('fs')
const glob = require('glob')
/**
 * JS文件拷贝
 * @param src
 * @param dst
 */
var callbackFile = function (src, dst) {
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
      if (dst.includes('.map')) {
        // let srcName = src.split('/')[4]
        // fs.unlink(`./dist/js/${srcName}.map`,function () { // 删除map
        // })
        // fs.unlink(`./dist/js/${srcName}`,function () { // 删除js
        // })
      } else { // JS写入成功
        callbackFile(dst, `${dst}.map`)
      }
    })
  })
}
// 复制目录
glob.sync('./dist/js/*.js').forEach((filepath, name) => {
  let fileNameList = filepath.split('.')
  let fileName = fileNameList[1].split('/')[3]// 多页面页面目录
  let copyName = filepath.split('/')[3]
  let changeDirectory = `./dist/${fileName}/js`// 多页面JS文件地存放址
  if (!fileName.includes('chunk-')) {
    fs.mkdirSync(`./dist/${fileName}`)
    // eslint-disable-next-line
    console.log(fileName, 111111)
    fs.exists(changeDirectory, function (exists) {
      console.log(exists, 2222222)
      if (exists) {
        console.log(`${fileName}下JS文件已经存在`)
        callbackFile(filepath, `${changeDirectory}/${copyName}`)
      } else {
        fs.mkdir(changeDirectory, {recursive: true}, function () {
          console.log(`${fileName}下JS文件创建成功`)
          callbackFile(filepath, `${changeDirectory}/${copyName}`)
        })
      }
    })
  }
})

// fs.exists('./dist/css', isExit => {
//   console.log(isExit, 'isExitisExitisExit')
//   fs.mkdir('./dist/index/js', {recursive: true}, function () {})
// })
