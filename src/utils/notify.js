// 通知
import Vue from 'vue';

const vueNotify = Vue.prototype.$notify
function notify (d) {
  let promise = new Promise((resolve, reject) => {
    let dflNotice = (d) => {
      let instance = vueNotify(d)
      instance && (instance.$el.onclick = () => {
        instance.onclick()
      })
      return instance
    }
    if ('Notification' in window && document.hidden) {
      Notification.requestPermission((permission) => {
        console.log(permission, 'permissionpermission')
        // 浏览器没授权时，调用Element的通知
        if (permission !== 'granted') {
          resolve(dflNotice(d))
        }

        // 授权后，调用浏览器的桌面通知
        let notification = new Notification(d.title, {
          body: d.message,
          icon: '/favicon.ico',
          dir: 'auto'
        });
        // notification.onclick = function () {
        //   console.log('onclickonclickonclickonclick')
        //   // 点击桌面通知，模拟实现把用户小化的窗口大化并刷新
        //   notification.close();//关闭桌面通知
        //   var href = window.location.href;//获取当前页面的url
        //   window.close();//将当前页面关闭
        //   window.open(href);//新开一个页面，url为当前页面
        // }
        // navigator.onshow = function () {
        //   //消息框显示时会被调用
        //   console.log('桌面通知显示ing');
        // }
        resolve(notification)
      });
    } else resolve(dflNotice(d))
  })
  promise.click = function (fun) {
    let self = this
    promise.then(instance => {
      instance.onclick = () => {
        fun && fun.call(self)
        instance.close()
      }
    })
  }
  return promise
}

Vue.prototype.$notify2 = notify
