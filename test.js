// 【Step1】设计一个要模拟的情景,
let sleep = time=>new Promise(s=>setTimeout(s, time));
let sleep2 = time=>new Promise(s=>setTimeout(s, time, Date.now()));

// async/await 实现
// async function test(){
//   await sleep(1000);
//   console.log('测试第一个await');

//   let x = await sleep2(1000);
//   console.log('测试await数据返回值：'+x);

//   return '测试函数执行完成之后的回调';
// }
// test().then(str=>console.log(str));

console.log('-----------------------------------------------------------------------------------------')

// // Generator函数 实现
// function updateGenerator(gen, resolve, arg) {
//   let info = gen.next(arg);
//   let value = info.value;
//   if(info.done) {
//       resolve(value);
//   } else {
//       value.then(_arg=>updateGenerator(gen, resolve, _arg));
//   }
// }
// function test() {
//   let fn = function* () {
//       yield sleep(1000);
//       console.log('测试第一个await');

//       let x = yield sleep2(1000);
//       console.log('测试await数据返回值：'+x);

//       return '测试函数执行完成之后的回调';
//   };
//   return new Promise(resolve=>{
//       let gen = fn();
//       updateGenerator(gen, resolve, undefined);
//   })
// }
// test().then(str=>console.log(str));


//模仿
function async (fun) {
  // function await (fun, ...arg) {
  //   let gen = function* () {
  //     let x = yield fun(...arg)
  //     console.log(x, 'xxxxxxxxxxx')
  //     return 6666
  //   }
  //   let next = (d) => {
  //     let val = d.next()
  //     if (val.done) return val.value
  //     return next(d)
  //   }
  //   return next(gen())
  //   // return fun instanceof Promise ? gen().next().value : fun()
  // }
  let funArr = []
  function await (fun, ...arg) {
    funArr.push([fun, ...arg])
  }
  return fun instanceof Promise ? fun() : new Promise((res, rej) => {
    try {
      res(fun(await))
    } catch (error) {
      rej(error)
    }
  })
}

function test3(await){
  await(sleep, 2000);
  console.log('测试第一个await');

  let x = await(sleep2, 1000);;
  console.log('测试await数据返回值：'+x);

  return '测试函数执行完成之后的回调';
}
async(test3).then(str=>console.log(str));