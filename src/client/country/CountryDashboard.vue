<script setup lang="ts">
import { ForListingCountryGoals } from '@/domain/drivingPorts/ForListingCountryGoals'
import { ForListingTariffs } from '@/domain/drivingPorts/ForListingTariffs'
import { ForSettingTariff } from '@/domain/drivingPorts/ForSettingTariff'
import { CountryId } from '@/domain/entities/Country'
import type { Tariff } from '@/domain/entities/Tariff'
import { ref, type Ref } from 'vue'

const props = defineProps({
  countryId: {
    type: CountryId,
    required: true
  },
  forListingTariffs: {
    type: ForListingTariffs,
    required: true
  },
  forSettingTariff: {
    type: ForSettingTariff,
    required: true
  },
  forListingCountryGoals: {
    type: ForListingCountryGoals,
    required: true
  }
})

type TariffQuery = { current: Tariff; newRate: number }

let tariffsRef: Ref<TariffQuery[]> = ref([])
const goals = await props.forListingCountryGoals.execute(props.countryId)

await updateTariffs()

async function setTariff(rate: number, resourceName: string) {
  await props.forSettingTariff.execute(props.countryId, rate, resourceName)
  await updateTariffs()
}

async function updateTariffs() {
  let tariffs = await props.forListingTariffs.execute(props.countryId)
  tariffsRef.value = tariffs.map((tariff) => ({ current: tariff, newRate: tariff.rate }))
}
</script>

<template>
  <div class="country-dashboard">
    <h1>This should be the country name</h1>
    <h2>Tariffs</h2>
    <div v-for="tariff in tariffsRef" :key="tariff.current.resourceName">
      {{ tariff.current.resourceName }} : {{ tariff.current.rate }} %
      <input v-model="tariff.newRate" type="number" />
      <button @click="setTariff(tariff.newRate, tariff.current.resourceName)">
        Set a tariff of {{ tariff.newRate }} % on {{ tariff.current.resourceName }}
      </button>
    </div>
    <h2>Goals</h2>
    <div v-for="goal in goals" :key="goal.resource.name">
      {{ goal.resource.name }} : {{ goal.quantity }}
    </div>
  </div>
</template>

<style>
.country-dashboard {
  background-color: burlywood;
  padding: 1rem;
}
</style>
