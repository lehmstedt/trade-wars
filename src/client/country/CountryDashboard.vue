<script setup lang="ts">
import { ForListingTariffs } from '@/domain/drivingPorts/ForListingTariffs';
import { CountryId } from '@/domain/entities/Country';


const props = defineProps({
    countryId: {
        type: CountryId,
        required: true
    },
    forListingTariffs: {
        type: ForListingTariffs,
        required: true
    }
})

const tariffs = await props.forListingTariffs.execute(props.countryId)
</script>

<template>

    <div class="country-dashboard">
        <h1>This should be the country name</h1>
        <h2>Tariffs</h2>
        <div v-for="tariff in tariffs" :key="tariff.resourceName">
            {{ tariff.resourceName }} : {{ tariff.rate }}
        </div>
    </div>
</template>

<style>
.country-dashboard {
    background-color: burlywood;
    padding: 1rem;
}
</style>