<script setup lang="ts">
import Trade from '@/client/TheTrade.vue'
import CountryResourcePrices from '@/client/country/CountryResourcePrice.vue'
import { onMounted, ref } from 'vue'
import type { Resource } from '@/domain/entities/Resource'
import { useRouter } from 'vue-router'
import { InMemoryConfigurator } from '@/configurator/InMemoryConfigurator'
import CountryDashboard from './country/CountryDashboard.vue'
import type { CountryListEntry } from '@/domain/drivingPorts/ForListingCountries'

let iteration = ref(0)
const configurator = new InMemoryConfigurator()
let resources: Resource[] = []
let countries: CountryListEntry[] = []
let playerPrices: Map<string, Map<string, number | undefined>>
let otherCountryPrices: Map<string, Map<string, number | undefined>>

const forValidatingTrade = configurator.buildForValidatingTrade()
const forMakingTrade = configurator.buildForMakingTrade()
const forListingResourcePrices = configurator.buildForListingResourcePrices()
const forListingResources = configurator.buildForListingResources()
const forListingCountries = configurator.buildForListingCountries()
const forListingCountryInventory = configurator.buildForListingCountryInventory()
const forListingTariffs = configurator.buildForListingTariffs()
const forSettingTariff = configurator.buildForSettingTariff()
const forListingCountryGoals = configurator.buildForListingCountryGoals()
const forCheckingIfGameIsOver = configurator.buildForCheckingIfGameIsOver()

const gameReady = ref(false)

const router = useRouter()
const isGameOver = ref(false)
const winnerName = ref('')

const updateGame = async () => {
  playerPrices = await forListingResourcePrices.execute(countries[0].id)
  otherCountryPrices = await forListingResourcePrices.execute(countries[1].id)
  countries = await forListingCountries.execute()
  iteration.value = iteration.value + 1

  const gameState = await forCheckingIfGameIsOver.execute()
  winnerName.value = gameState.winnerName ?? ''

  if (gameState.isGameOver) {
    isGameOver.value = true
    router.push({ name: 'gameOver', params: { winnerName: gameState.winnerName ?? 'Nobody' } })
  }
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
      <div>
        <CountryDashboard
          :country="countries[0]"
          :for-listing-tariffs="forListingTariffs"
          :for-setting-tariff="forSettingTariff"
          :for-listing-country-goals="forListingCountryGoals"
          :for-listing-country-inventory="forListingCountryInventory"
          :key="iteration"
          @tariff-updated="updateGame"
        ></CountryDashboard>
        <CountryDashboard
          :country="countries[1]"
          :for-listing-tariffs="forListingTariffs"
          :for-setting-tariff="forSettingTariff"
          :for-listing-country-goals="forListingCountryGoals"
          :for-listing-country-inventory="forListingCountryInventory"
          :key="iteration"
          @tariff-updated="updateGame"
        ></CountryDashboard>
      </div>
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
