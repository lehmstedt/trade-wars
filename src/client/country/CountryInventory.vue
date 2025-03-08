<script setup lang="ts">
import { ForListingCountryInventory } from '@/domain/drivingPorts/ForListingCountryInventory'
import { CountryId, type ResourceInventoryEntry } from '@/domain/entities/Country'

const props = defineProps({
  countryId: {
    type: CountryId,
    required: true
  },
  forListingCountryInventory: {
    type: ForListingCountryInventory,
    required: true
  }
})

let inventories: ResourceInventoryEntry[] = await props.forListingCountryInventory.execute(
  props.countryId
)
</script>
<template>
  <div v-for="inventory in inventories" :key="inventory.name">
    {{ inventory.name }} : {{ inventory.qty?.toFixed(2) }}
  </div>
</template>
