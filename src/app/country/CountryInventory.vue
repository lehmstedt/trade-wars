<script setup lang="ts">
import { Country } from '@/domain/entities/Country'

const props = defineProps({
  country: Country,
  name: String
})

const inventories = props.country?.getResourceInventories()

defineExpose({ inventories })
</script>
<template>
  <h3>{{ name }}</h3>
  <div v-for="inventory in inventories" :key="inventory.name">
    {{ inventory.name }} : {{ inventory.qty }}
  </div>
</template>
