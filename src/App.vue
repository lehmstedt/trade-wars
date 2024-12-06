<script setup lang="ts">
import { Country, CountryId } from '@/domain/entities/Country'
import Trade from '@/app/trade/TheTrade.vue'
import CountryResourcePrices from '@/app/country/CountryResourcePrice.vue';
import { Game } from '@/domain/application/Game';
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository';
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository';
import { Resource } from '@/domain/entities/Resource';
import { ref } from 'vue';

const countryRepo = new InMemoryCountryRepository()
const resourceRepo = new InMemoryResourceRepository()
const game = new Game(countryRepo, resourceRepo)

const iron = new Resource('Iron')
const charcoal = new Resource('Charcoal')
const whool = new Resource('Whool')
const resources: Resource[] = [
  iron, charcoal, whool
]
resourceRepo.add(iron)
resourceRepo.add(charcoal)
resourceRepo.add(whool)

const playerCountry = new Country()
playerCountry.id = new CountryId('player')

playerCountry.setResource('Iron', 12)
playerCountry.setResource('Charcoal', 240)

const anotherCountry = new Country()
anotherCountry.setResource('Iron', 30)
anotherCountry.setResource('Whool', 10)

countryRepo.save(playerCountry)
countryRepo.save(anotherCountry)

let iteration = ref(0)

const updateGame = () => {
  iteration.value = iteration.value + 1
}

</script>

<template>
  <div class="row">
    <div class="column">
      <Trade :player-country="playerCountry" :other-country="anotherCountry" @trade-made="updateGame"></Trade>
    </div>

    <div class="column">
      <h1>Prices</h1>
      <h2>Player</h2>
      <Suspense>
        <CountryResourcePrices :country-id="playerCountry.id" :game="game" :resources="resources" :key="iteration">
        </CountryResourcePrices>
      </Suspense>
      <h2>Great-Britain</h2>
      <Suspense>
        <CountryResourcePrices :country-id="anotherCountry.id" :game="game" :resources="resources" :key="iteration">
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
