import { createApp } from 'vue'
import App from './App.vue'
import GameOver from '@/client/GameOver.vue'
import { createRouter, createWebHistory } from 'vue-router'
import TheGame from '@/client/TheGame.vue'

const routes = [
    { path: '/', component: TheGame},
    { path: '/gameOver', component: GameOver}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App)
    .use(router)
    .mount('#app')
