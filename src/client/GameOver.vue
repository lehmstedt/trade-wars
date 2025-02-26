<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  winnerName: string
}
defineProps<Props>()

const router = useRouter()

function restart() {
  router.push({ path: '/' })
}
</script>
<template>
  <h1>This is game over</h1>
  <p>And the winner is ... {{ winnerName }}</p>
  <button @click="restart">Restart ?</button>
</template>
