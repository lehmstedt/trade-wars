<script setup lang="ts">
import Trade from '@/app/trade/TheTrade.vue'
import CountryResourcePrices from '@/app/country/CountryResourcePrice.vue';
import { onMounted, ref } from 'vue';
import { GameFactory } from '@/domain/GameFactory';
import type { Resource } from '@/domain/entities/Resource';
import type { Country } from '@/domain/entities/Country';
import type { Game } from '@/domain/application/Game';



let iteration = ref(0)
let resources: Resource[] = []
let countries: Country[] = []
let game: Game

const updateGame = () => {
  iteration.value = iteration.value + 1
}

onMounted(async() => {
  const gameFactory = new GameFactory()
  game = await gameFactory.buildInMemoryGame()
  resources = await game.listResources()
  countries = await game.listCountries()
})

</script>

<template>
  <div class="row" v-if="countries.length > 0 && resources.length > 0">
    <div class="column">
      <Trade :player-country="countries[0]" :other-country="countries[1]" @trade-made="updateGame" :resources="resources"></Trade>
    </div>

    <div class="column">
      <h1>Prices</h1>
      <h2>Player</h2>
      <Suspense>
        <CountryResourcePrices :country-id="countries[0].id" :game="game" :resources="resources" :key="iteration">
        </CountryResourcePrices>
      </Suspense>
      <h2>Great-Britain</h2>
      <Suspense>
        <CountryResourcePrices :country-id="countries[1].id" :game="game" :resources="resources" :key="iteration">
        </CountryResourcePrices>
      </Suspense>
    </div>
    
    
  </div>

</template>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .column {
    display: flex;
    flex-direction: column;
    margin: 20px;
  }
</style>
