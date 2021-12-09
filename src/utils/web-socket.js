/* eslint-disable */
import Vue from 'vue';
import WS from './ws'
import Store from '@/store'

let host = location.hostname + ':8087'
if (host.indexOf('localhost') >= 0) host = 'saas.in-ideal.com:8087'
// host = 'saas.in-ideal.com:8087'
// host = 'localhost'
Vue.prototype.$ws = new WS(host)

// 登陆后从服务器更新本地所有，并通知未读
Vue.prototype.$ws.addEvent('/socket/message/update', updateLocalFromServer)
// 时时监听服务器推送，更新本地
Vue.prototype.$ws.addEvent('/socket/message/receive', updateInBack)
// 更新消息之外的聊天信息，比如修改群名、删除群成员
Vue.prototype.$ws.addEvent('/socket/chat/update', updateChat)

// 添加系统提示
Vue.prototype.$ws.addEvent('/socket/sysTip', d => {
  Vue.prototype.$notify2({
    title: '系统提示',
    message: d.message
  })
})
// 添加任务提示
Vue.prototype.$ws.addEvent('/socket/taskTip', data => {
  let {audit_id, message} = data
  Vue.prototype.$event.$emit('updateSysNotices')
  Vue.prototype.$notify2({
    title: '任务提示',
    message
  }).click.call(Vue.prototype, async function () {
    if (!audit_id) return
    let d = await this.$get('/ideal/wf/queryTaskInsDetail', {task_ins_id: audit_id})
    d = d.wf_task_ins || {}
    let {contract_id, bookorder_id} = d
    let page_id = bookorder_id || contract_id || audit_id
    if (!page_id) return
    let title = d.x_contract_id || d.x_bookorder_id || d.type
    let path = 'TaskExecutionResults'
    if (contract_id) path = 'ScEdit'
    if (bookorder_id) path = 'BkEdit'
    this.$tab.open({title, page_id, path, query: d})
  })
})

// window.syncAllChat = true

async function updateLocalFromServer (d) {
  // 登录后，服务器会传来最近2天（或未读的）的消息
  // 为考虑本地存储的大小限制，不全量同步所有设备消息，需用户手动同步，下面只会自动同步最近两天的
  let server_datas = d.chats || []
  let local_chats = await Vue.prototype.$ws.getLocal()
  let local_chatsMap = local_chats._object('target_id')
  let newChats = []
  server_datas.forEach(f => {
    let v = local_chatsMap[f.target_id]
    f = updateTip(f)
    if (v) {
      // 聊天列表存在该聊天记录，则更新
      if (f.unread_length) notify(v)
      f.unread_length += (v.unread_length || 0)
      let latestMessages = f.messages || []
      delete f.messages
      Object.assign(v, f)
      // 查找截至日期
      if (latestMessages.length) {
        let [min] = latestMessages
        min = new Date(min.create_date).getTime()
        let lastIndex = v.messages.findLastIndex(f => new Date(f.create_date).getTime() < min)
        if (lastIndex >= 0) {
          v.messages = v.messages.slice(0, lastIndex + 1)
          v.messages.push(...latestMessages)
        } else v.messages = latestMessages
      }
    } else if (f.unread_length || window.syncAllChat) {
      // 聊天列表不存在该记录，但是有新的未读消息，则加一条记录
      newChats.push(f)
      f.unread_length && notify(f)
    }
  })
  let all = local_chats.concat(newChats)
  await Vue.prototype.$ws.updateLocal(all)
  Store.dispatch('SetUnread', all.reduce((pre, val) => (pre += val.unread_length), 0))

  // if (window.inChatPage) {
    // 在聊天页面,不弹窗提醒
    Vue.prototype.$event.$emit('updateLocalFromServer')
  // }
}

async function updateChat (d) {
  let chat = await Vue.prototype.$ws.getLocal(d.target_id)
  if (!chat) return
  Object.assign(chat, d)
  await Vue.prototype.$ws.updateLocal(chat)
  Vue.prototype.$event.$emit('updateLocalFromServer')
}

function updateTip (chat) {
  let lastest = chat.messages[chat.messages.length - 1] || {}
  chat.lastest = Vue.prototype.$ws.getLastest(lastest, chat)
  chat.update_time = lastest.create_date
  let v = chat[chat.target_id] || {}
  chat.chat_name = v.busi_group_name || v.user_name || chat.chat_name,
  chat.avatar = v.avatar,
  chat.dflt_avatar = v.busi_code || v.busi_group_name || v.user_name
  return chat
}

function notify (chat) {
  if (window.inChatPage && !document.hidden) return
  setTimeout(() => {
    Vue.prototype.$notify2({
      title: chat.chat_name,
      message: `[${chat.unread_length || 1}条], ${chat.lastest}`
    }).click(() => {
      if (document.hidden) window.focus()
      Vue.prototype.$tab.open({
        title: '聊天',
        tab_id: 'chat_page',
        path: 'ChatPage',
        query: {target_id: chat.target_id},
        target: document.hidden && 'refresh'
      })
    })
  }, 100)
}

async function updateInBack (d) {
  let id = d.target_id
  if (d.chat_type === 'user') id = d.sender_id
  let chat = await Vue.prototype.$ws.getLocal(id)
  if (!chat) {
    let {chat_type: type, target_id, sender_id} = d
    let q = {type, target_id, sender_id}
    chat = await Vue.prototype.$ws.send('/socket/chat/get', q)
    chat.unread_length = 0
  } else chat.messages.push(d)
  chat.unread_length || (chat.unread_length = 0)
  let allUnread = Store.getters.unread - chat.unread_length
  if (window.chatTargetId && window.chatTargetId === chat.target_id) {
    chat.unread_length = 0
  } else chat.unread_length++

  allUnread += chat.unread_length
  Store.dispatch('SetUnread', allUnread)

  updateTip(chat)

  await Vue.prototype.$ws.updateLocal(chat)
  Vue.prototype.$event.$emit('updateInBack', chat)
  notify(chat)
}