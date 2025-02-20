<script setup lang="ts">
import Trade from '@/client/TheTrade.vue'
import CountryResourcePrices from '@/client/country/CountryResourcePrice.vue'
import { onMounted, ref } from 'vue'
import type { Resource } from '@/domain/entities/Resource'
import type { Country } from '@/domain/entities/Country'
import CountryInventory from '@/client/country/CountryInventory.vue'
import type { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import { InMemoryConfigurator } from './configurator/InMemoryConfigurator'
import type { ForMakingTrade } from './domain/drivingPorts/ForMakingTrade'
import { ForListingResourcePrices } from './domain/drivingPorts/ForListingResourcePrices'
import CountryDashboard from './client/country/CountryDashboard.vue'

let iteration = ref(0)
const configurator = new InMemoryConfigurator()
let resources: Resource[] = []
let countries: Country[] = []
let playerPrices: Map<string, Map<string, number | undefined>>
let otherCountryPrices: Map<string, Map<string, number | undefined>>

const forValidatingTrade: ForValidatingTrade = configurator.buildForValidatingTrade()
const forMakingTrade: ForMakingTrade = configurator.buildForMakingTrade()
const forListingResourcePrices: ForListingResourcePrices =
  configurator.buildForListingResourcePrices()
const forListingResources = configurator.buildForListingResources()
const forListingCountries = configurator.buildForListingCountries()
const forListingCountryInventory = configurator.buildForListingCountryInventory()
const forListingTariffs = configurator.buildForListingTariffs()
const forSettingTariff = configurator.buildForSettingTariff()
const forListingCountryGoals = configurator.buildForListingCountryGoals()

const gameReady = ref(false)

const updateGame = async () => {
  playerPrices = await forListingResourcePrices.execute(countries[0].id)
  otherCountryPrices = await forListingResourcePrices.execute(countries[1].id)
  iteration.value = iteration.value + 1
}

onMounted(async () => {
  resources = await forListingResources.execute()
  countries = await forListingCountries.execute()
  await updateGame()
  gameReady.value = true
})
</script>

<template>
  <div class="row" v-if="gameReady">
    <Suspense>
      <CountryDashboard
        :country-id="countries[0].id"
        :for-listing-tariffs="forListingTariffs"
        :for-setting-tariff="forSettingTariff"
        :for-listing-country-goals="forListingCountryGoals"
      ></CountryDashboard>
    </Suspense>
    <div class="column">
      <Trade
        :player-country="countries[0]"
        :other-country="countries[1]"
        @trade-made="updateGame"
        :resources="resources"
        :for-validating-trade="forValidatingTrade"
        :for-making-trade="forMakingTrade"
      ></Trade>
    </div>

    <Suspense>
      <div class="column">
        <h1>Inventories</h1>

        <CountryInventory
          :country-id="countries[0].id"
          :for-listing-country-inventory="forListingCountryInventory"
          :key="iteration"
          name="The player country"
        ></CountryInventory>
        <CountryInventory
          :country-id="countries[1].id"
          :for-listing-country-inventory="forListingCountryInventory"
          :key="iteration"
          name="Great-Britain"
        ></CountryInventory>
      </div>
    </Suspense>

    <div class="column">
      <h1>Prices</h1>
      <h2>Player</h2>
      <CountryResourcePrices
        :country-id="countries[0].id"
        :prices="playerPrices"
        :resources="resources"
        :key="iteration"
      >
      </CountryResourcePrices>
      <h2>Great-Britain</h2>
      <CountryResourcePrices
        :country-id="countries[1].id"
        :prices="otherCountryPrices"
        :resources="resources"
        :key="iteration"
      >
      </CountryResourcePrices>
    </div>
  </div>
</template>

<style>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.column {
  display: flex;
  flex-direction: column;
}
</style>
