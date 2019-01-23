import Vue from 'vue'
import Router from 'vue-router'
import Queue from '@/components/Queue'
import Signup from '@/components/Signup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/queue',
      name: 'queue',
      component: Queue
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ]
})
