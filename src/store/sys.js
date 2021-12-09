const state = {
  icons: {}
}

const getters = {
  icons: state => state.icons
}

const actions = {
  'SetIcons' ({commit}, data) {
    commit('SetIcons', data)
  },
}

const mutations = {
  'SetIcons' (state, payload) {
    state.authorized = true
    state.icons = Object.assign({}, state.icons, payload)
  }
}
// 注意不能写default
export default {
  state,
  getters,
  actions,
  mutations
}
