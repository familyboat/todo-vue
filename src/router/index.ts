import { routerConfig } from '@/configs'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from './Home/HomeView.vue'
import ToDoView from './ToDo/ToDoView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: routerConfig.HomePath,
    component: HomeView,
  },
  {
    path: routerConfig.ToDoPath,
    component: ToDoView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
