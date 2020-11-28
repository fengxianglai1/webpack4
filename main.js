// import addContent from './add-content.js'
import Vue from 'vue'
import App from './main.vue'
import http from './http'
// import axios from 'axios'; /* 引入axios进行地址访问*/
// import VueAxios from 'vue-axios'; /* 引入axios进行地址访问*/
// Vue.use(VueAxios,axios)
Vue.prototype.$http = http
console.log('多页面mian')
console.log('多页面mian',http)
// addContent()

new Vue({
    el: '#app',
    render: h => h(App)
  })