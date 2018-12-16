// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'iview/dist/styles/iview.css'
import { Input, Button, Popover, Radio, RadioGroup, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import { Tabs, TabPane, Header, Icon, Tag, Table, Select, Option, Notice, Cascader } from 'iview'
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Header', Header)
Vue.component('Icon', Icon)
Vue.component('Tag', Tag)
Vue.component('Table', Table)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Cascader', Cascader)
Vue.prototype.$Notice = Notice
// Vue.use(Cascader)
Vue.use(Input)
Vue.use(Button)
// Vue.use(Menu)
// Vue.use(MenuItemGroup)
// Vue.use(Submenu)
// Vue.use(MenuItem)
Vue.use(Popover)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
// Vue.use(Select)
// Vue.use(Option)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
