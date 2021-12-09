import Vue from "vue"
import Vuex from "vuex"
import frame from "./frame"
import user from "./user"
import sys from "./sys"

Vue.use(Vuex);

let Store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    frame,
    user,
    sys
  },
});

Vue.prototype.$state = function (key) {
  return Store.getters[key]
}

export default Store
