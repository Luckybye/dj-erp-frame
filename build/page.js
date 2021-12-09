//****** 多页面配置 ******
const path = require("path");
// 读取
const glob = require("glob");

const fs = require("fs");

// 页面路径
const PAGE_PATH = path.resolve(__dirname, "../src/mpa");

const titleMap = {
  saas: 'Wokelink-SaaS',
  cust: 'Wokelink-Global Buyers',
  dealer: 'Wokelink-Local Dealer',
  vendor: 'Wokelink-Vendor',
  chat: 'Wokelink-Chat'
}
// process.argv
exports.getPages = function() {
  let entryFiles = glob.sync(PAGE_PATH + "/*/main.js");
  let map = {};
  map = entryFiles.reduce((pre, filePath) => {
    let filename = filePath.match(/(?<=src\/mpa\/)[^\/]+(?=\/main.js)/)[0] || "index";
    // console.log(filename);

    let tplPath = filePath.replace('main.js', 'index.html')
    let isExistFile = fs.existsSync(tplPath)
    // let novue = fs.existsSync(filePath.replace('main.js', 'chunks.js'))
    let template = 'public/index.html'
    // 当前单页面html存在，就用他的html
    if (isExistFile) template = tplPath

    pre[filename] = {
      entry: filePath,
      template,
      // filename: 'index.html',
      chunks: ["chunk-vendors", "chunk-common", filename],
      title: titleMap[filename]
    };
    return pre;
  }, {});

  map.saas = {
    entry: path.resolve(__dirname, "../src/main.js"),
    // template: 'public/saas.html',
    filename: process.env.NODE_ENV === 'production' ? 'new_saas.html' : 'index.html',
    chunks: ["chunk-vendors", "chunk-common", 'saas'],
    title: titleMap.saas
  }

  return map
};
