<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const winnerName = ref('To be implemented')

function restart() {
  router.push({ path: '/' })
}
</script>
<template>
  <h1>This is game over</h1>
  <p>And the winner is ... {{ winnerName }}</p>
  <button @click="restart">Restart ?</button>
</template>
