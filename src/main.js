import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill'

import VueVuecmfTable from './lib/vue-vuecmf-table'

Vue.use(VueVuecmfTable)

new Vue({
  el: '#app',
  render: h => h(App)
})
