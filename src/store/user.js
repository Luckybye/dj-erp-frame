let isTest = !![
  'localhost',
  '127.0.0.1',
  'djtest.wokelink.com',
  'saas.in-ideal.com',
].find(f => location.host.includes(f))
const state = {
  me: {user_name: ''},
  com: {},
  isTest,
  user_auth: {},
  isAdmin: false,
  unread: 0
}

const getters = {
  me: state => state.me,
  com: state => state.com,
  isTest: state => state.isTest,
  user_auth: state => state.user_auth,
  isAdmin: state => state.isAdmin,
  unread: state => state.unread
}

const actions = {
  'UserLogin' ({commit}, data) {
    commit('UserLogin', data)
  },
  'SetComInfo' ({commit}, data) {
    commit('SetComInfo', data)
  },
  'SetEnv' ({commit}, data) {
    commit('SetEnv', data)
  },
  'SetUserAuth' ({commit}, data) {
    commit('SetUserAuth', data)
  },
  'SetUnread' ({commit}, data) {
    commit('SetUnread', data)
  }
}

const mutations = {
  'UserLogin' (state, payload) {
    Object.assign(state.me, payload)
    state.isAdmin = state.me.role === '1' || state.me.role === '2'
  },
  'SetEnv' (state, data) {
    state.isTest = data
  },
  SetComInfo (state, data) {
    state.com = data
  },
  'SetUserAuth' (state, data) {
    state.user_auth = data || {}
  },
  'SetUnread' (state, data) {
    state.unread = data
  }
}
// 注意不能写default
export default {
  state,
  getters,
  actions,
  mutations
}
