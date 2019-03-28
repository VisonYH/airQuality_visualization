import Vue from 'vue'
import Router from 'vue-router'
import MyMap from '@/components/Map'
import Calender from '@/components/Calender'
import Heatcircle from '@/components/Heatcircle'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: MyMap
    }, {
      path: '/calender',
      name: 'Calender',
      component: Calender
    }, {
      path: '/heatcircle',
      name: 'Heatcircle',
      component: Heatcircle
    }
  ]
})
