import { createApp } from 'vue'
import App from './App.vue'
import GameOver from '@/client/GameOver.vue'
import { createRouter, createWebHistory } from 'vue-router'
import TheGame from '@/client/TheGame.vue'

const routes = [
  { path: '/', component: TheGame },
  { path: '/gameOver/:winnerName', name: 'gameOver', component: GameOver, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
