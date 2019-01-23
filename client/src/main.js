// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import theme from './assets/theme'
import 'vuetify/dist/vuetify.min.css'
import 'vue-material/dist/vue-material.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  options: { customProperties: true },
  theme
})

/* eslint-disable no-new */
/** TODO: delete window.application */
window.application = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
