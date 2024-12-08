<script setup lang="ts">
import Trade from '@/app/trade/TheTrade.vue'
import CountryResourcePrices from '@/app/country/CountryResourcePrice.vue';
import { onMounted, ref } from 'vue';
import { GameFactory } from '@/domain/GameFactory';
import type { Resource } from '@/domain/entities/Resource';
import type { Country } from '@/domain/entities/Country';
import type { Game } from '@/domain/application/Game';
import CountryInventory from '@/app/country/CountryInventory.vue';



let iteration = ref(0)
let resources: Resource[] = []
let countries: Country[] = []
let game: Game
let playerPrices: Map<string, Map<string, number>>
let otherCountryPrices: Map<string, Map<string, number>>

const gameReady = ref(false)

const updateGame = async() => {
  playerPrices = await game.listResourcePrices(countries[0].id)
  otherCountryPrices = await game.listResourcePrices(countries[1].id)
  iteration.value = iteration.value + 1
}

onMounted(async() => {
  const gameFactory = new GameFactory()
  game = await gameFactory.buildInMemoryGame()
  resources = await game.listResources()
  countries = await game.listCountries()
  await updateGame()
  gameReady.value = true
})

</script>

<template>
  <div class="row" v-if="gameReady">
    <div class="column">
      <Trade :player-country="countries[0]" :other-country="countries[1]" @trade-made="updateGame" :resources="resources"></Trade>
    </div>

    <div class="column">
      <h1>Inventories</h1>
      <CountryInventory :country="countries[0]" name="The player country"></CountryInventory>
      <CountryInventory :country="countries[1]" name="Great-Britain"></CountryInventory>
    </div>

    <div class="column">
      <h1>Prices</h1>
      <h2>Player</h2>
      <Suspense>
        <CountryResourcePrices :country-id="countries[0].id" :prices="playerPrices" :resources="resources" :key="iteration">
        </CountryResourcePrices>
      </Suspense>
      <h2>Great-Britain</h2>
      <Suspense>
        <CountryResourcePrices :country-id="countries[1].id" :prices="otherCountryPrices" :resources="resources" :key="iteration">
        </CountryResourcePrices>
      </Suspense>
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
