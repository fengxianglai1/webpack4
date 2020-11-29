import Vue from 'vue'
import App from '../..//src/views/home.vue'
import http from '../../src/js/http'
Vue.prototype.$http = http
console.log('多页面mian')
console.log('多页面mian', http)
new Vue({
  el: '#app',
  render: h => h(App)
})