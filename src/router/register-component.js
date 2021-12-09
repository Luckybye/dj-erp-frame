import { camelCase, upperFirst } from "lodash";
import store from "@/store";
import Mixins from "./mixins";
import { i18n } from "@/lang";

const route = Object.create(null);
route.install = function(vue) {
  // 第一个字符串是 组件名，第二个是组件路径，第三个是包名(如果不指定则已1.js,2.js....n.js命名)
  // vue.component('home', (resolve) => {require.ensure([], ()=>resolve(require('@/Views/home.vue')), 'home')})
  let tabs = require.context("@/views/", true, /\$([a-zA-Z\-_0-9]+)\.vue$/i);
  let mpa = require.context("@/mpa/", true, /\$([a-zA-Z\-_0-9]+)\.vue$/i);
  let pageMessages = {en: i18n.messages.en.cmpt || {}, cn: i18n.messages.cn.cmpt || {}}
  let component = (v) => {
    return v.keys().reduce((pre, key) => {
      let cmpt = v(key);
      let routeName = key.match(/\$([a-zA-Z\-_0-9]+)\.vue$/i)[1] || "404";
      routeName = upperFirst(camelCase(routeName));
      cmpt.default.name = cmpt.default.name || routeName
      cmpt.default.mixins = cmpt.default.mixins || [];
      cmpt.default.mixins.push(Mixins);
      // componentName
      vue.component(routeName, (resolve) =>
        require.ensure([], () => resolve(cmpt))
      );
      let name = cmpt.default.name;
      let cmptName = "cmpt." + name;

      // 子菜单默认名称-----
      let options = cmpt.default.options
      if (options) {
        pageMessages.en[name] = options.title_en || options.title
        pageMessages.cn[name] = options.title || options.title_en
      }
      // ------------

      pre[routeName] = {
        part_name: routeName,
        name,
        title: cmptName,
        desc: (options || {}).desc,
        icon: (options || {}).icon,
        icon_text: (options || {}).icon_text,
        // i18n.te(cmptName) ? i18n.t(cmptName) : i18n.t(name),
      };
      return pre;
    }, {});
  };
  store.dispatch("SetMenus", { ...component(tabs), ...component(mpa) });

  i18n.mergeLocaleMessage('en', {cmpt: pageMessages.en})
  i18n.mergeLocaleMessage('cn', {cmpt: pageMessages.cn})
};
export default route;
