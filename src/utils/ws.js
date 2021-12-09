
// readyState
// CONNECTING：值为0，表示正在连接。
// OPEN：值为1，表示连接成功，可以通信了。
// CLOSING：值为2，表示连接正在关闭。
// CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
let cbMap = {}

export default function WS (host, {restartTimes, restartInterval, onmessage} = {}) {
  // 连接后端服务地址
  let protocol = 'ws://'
  if (/https/.test(location.protocol)) {
    protocol = 'wss://'
    host = 'wokelink.com'
  }
  this.url = protocol + host + '/wss'

  // 连接失败后是否开启重启，为0不重启，默认重启5次，重启间隔10s
  this.restartTimes = restartTimes || 5
  this.restartInterval = restartInterval || 10 * 1000
  this.ws = {}
  this.onmessage = onmessage

  this.clientId = ''
  this.user = ''
}

WS.prototype.getLocalField = function () {
  let user = this.user || (window.vglobal || {}).user || {}
  return 'ws_' + user.user_id
}

WS.prototype.connect = async function (user) {
  user = this.user || user || (window.vglobal || {}).user
  this.user = user
  if (!user) return
  return new Promise((resolve, reject) => {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = async () => {
      this.send('/socket/userSignin', {
        user_id: user.user_id,
      }).then(d => {
        this.clientId = d.client_id
        console.log('登录成功', d.client_id)
        resolve(this.ws)
      })
    }

    this.ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      let {url} = data.ws || {}
      console.log('onmessageonmessage', url, data)

      let promiseId = 'promise' + url
      if (url && cbMap[promiseId]) {
        cbMap[promiseId](data)
        delete cbMap[promiseId]
        return
      }

      if (url && cbMap[url]) {
        cbMap[url](data)
      }

      this.onmessage && this.onmessage(data)
    };

    this.ws.onclose = (e) => {
      console.log('oncloseoncloseonclose', e)
      if (this.restartTimes <= 0) {
        this.restartTimes = 5
        return
      }
      // 1006
      if (e.reason !== 'manual_close') {
        this.restartTimes--
        // 因为服务器异常关闭，启动自动重连
        setTimeout(() => {
          this.connect()
          console.log('正在重连。。。');
        }, this.restartInterval)
      }
    };
  })
}

WS.prototype.send = async function (url, data) {
  let self = this.ws;
  if (self.readyState === 3) self = await this.connect()
  let value = data || {};
  let ws = {}
  ws.send_id = value.send_id || Date.now()
  ws.client_id = this.client_id
  ws.url = url
  value.ws = ws
  console.log('sendsendsend', value)
  self.send(JSON.stringify(value));
  return new Promise(function (resolve, reject) {
    cbMap['promise' + ws.url] = (d) => resolve(d)
  });
}

WS.prototype.close = async function (url, data) {
  this.ws.close(1000, 'manual_close')
}

WS.prototype.addEvent = async function (url, cb) {
  console.log('addEventaddEvent', url)
  if (!cb) return
  if (this.ws.readyState === 3) await this.connect()
  let ws = {};
  ws.send_id = Date.now()
  ws.client_id = this.clientId
  ws.url = url
  cbMap[ws.url] = (d) => cb(d)
  return ws
}

WS.prototype.removeEvent = function (url) {
  console.log('removeEventremoveEventremoveEvent', url)
  if (typeof url === 'object') url = url.url
  delete cbMap[url]
}

// 更新本地。参数1是数组时，覆盖本地；参数1是对象时，更新某条；参数2是给当前聊天插入最新消息记录(此时参数1是对象才有效)
WS.prototype.updateLocal = async function (v, m) {
  if (this.ws.readyState !== 1) return
  let chats
  if (Array.isArray(v)) {
    chats = v
  } else {
    chats = await this.getLocal()
    let rst = chats.find(f => f.target_id === v.target_id)
    if (rst) {
      Object.assign(rst, v)
      if (m) rst.messages.push(m)
    } else chats.push(v)
  }
  let save = (chats) => {
    // 判断超出内存时，清掉部分数据，或者提醒
    try {
      window.localStorage.setItem(this.getLocalField(), JSON.stringify(chats))
    } catch (error) {
      // 删除部分数据***，但是不友好，不知删除哪些
      // save(chats)
      alert('本地存储已超出，请清除部分聊天记录')
    }
  }
  save(chats)
}

// 查询本地，传参查询某条
WS.prototype.getLocal = async function (id) {
  let chats
  try {
    chats = JSON.parse(window.localStorage.getItem(this.getLocalField()) || '[]')
  } catch (error) {
    chats = []
  }
  if (id) {
    return chats.find(f => f.target_id === id)
  } else return chats
}

// 生成当前聊天的最新消息缩略，列表缩略显示
WS.prototype.getLastest = function (lastest, chat) {
  if (!lastest.message) return ''
  let name = ''
  if (chat.type !== 'user') {
    name = (chat[lastest.sender_id] || {}).user_name || ''
    name && (name += ': ')
  }

  if (lastest.type === 'img') {
    lastest = '[图片]'
  } else if (lastest.type === 'file') {
    lastest = '[文件]'
  } else if (lastest.type === 'video') {
    lastest = '[视频]'
  } else {
    lastest = (lastest.message + '').trim().slice(0, 50).replaceAll('<br>', '')
  }
  return name + lastest
}

// proxy_read_timeout 600s;
// location /wss {
//   proxy_pass http://websocket;
//   proxy_http_version 1.1;
//   proxy_set_header Upgrade $http_upgrade;
//   proxy_set_header Connection "Upgrade";
// }