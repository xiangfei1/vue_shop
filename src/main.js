import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '../http'
// 导入elementui组件库
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import 'assets/CSS/global.css'

// 表格树
import TreeTable from 'vue-table-with-tree-grid'
// 全局使用组件
import './plugins/elementui'

// 全局引用富文本组件
import VueQuillEditor from 'vue-quill-editor'

// 引用富文本组件的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)

Vue.component('tree-table', TreeTable)
// 配置请求参数
Vue.prototype.$http = http

// 配置时间格式过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const dd = (dt.getDay() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${dd}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
