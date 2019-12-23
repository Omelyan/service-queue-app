import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './Service-Queue-Display'
import router from './router'

import theme from './assets/theme'
import config from './assets/config'

import 'vuetify/dist/vuetify.min.css'
import 'vue-material/dist/vue-material.min.css'

Vue.use(Vuetify, {
  options: { customProperties: true },
  theme
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router: router(config),
  components: { 'Service-Queue-Display': App },
  template: '<Service-Queue-Display/>'
})
