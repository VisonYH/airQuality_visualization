// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import { Cascader, Input, Button, Menu, MenuItem, MenuItemGroup, Submenu, Popover } from 'element-ui'

Vue.use(Cascader)
Vue.use(Input)
Vue.use(Button)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Popover)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
