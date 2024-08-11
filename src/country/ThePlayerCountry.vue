<script setup lang="ts">
import { Country } from './Country'

const props = defineProps({
  country: Country
})

const inventories = props.country?.getResourceInventories()

defineExpose({ inventories })
</script>
<template>
  <h1>The player country</h1>

  <div v-for="inventory in inventories" :key="inventory.name">
    {{ inventory.name }} : {{ inventory.qty }}
  </div>
</template>
