<script setup lang="ts">
import { ForListingCountryInventory } from '@/domain/drivingPorts/ForListingCountryInventory';
import { CountryId, type ResourceInventory } from '@/domain/entities/Country'

const props = defineProps({
  countryId: {
    type: CountryId,
    required: true
  }
    ,
  name: String,
  forListingCountryInventory: {
    type: ForListingCountryInventory,
    required: true
  }
})

let inventories: ResourceInventory[] = await props.forListingCountryInventory.execute(props.countryId)

</script>
<template>
  <h3>{{ name }}</h3>
    <div v-for="inventory in inventories" :key="inventory.name">
      {{ inventory.name }} : {{ inventory.qty?.toFixed(2) }}
    </div>
  
</template>
