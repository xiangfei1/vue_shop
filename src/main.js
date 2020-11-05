import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '../http'
// 导入elementui组件库
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import 'assets/CSS/global.css'

import TreeTable from 'vue-table-with-tree-grid'
// 全局使用组件
import './plugins/elementui'

Vue.component('tree-table', TreeTable)
// 配置请求参数
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
