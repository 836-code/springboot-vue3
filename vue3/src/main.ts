import { createApp} from 'vue'
import App from './App.vue'
import request from '@/utils/request.ts'
import { createPinia } from 'pinia'
import router from '@/router'
import ElementPlus, { ElTree } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './style.css'



const app = createApp(App)
app.config.globalProperties.request = request
app.use(createPinia)
app.use(router)
app.use(ElementPlus)


// -------------------- 注册全局组件 --------------------
app.component('el-tree', ElTree)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.mount('#app')
