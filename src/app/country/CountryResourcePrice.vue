<script setup lang="ts">
import type { Game } from '@/domain/application/Game';
import { CountryId } from '@/domain/entities/Country';
import type { Resource } from '@/domain/entities/Resource';

interface Props {
    game: Game,
    resources: Resource[],
    countryId: CountryId
}
const props = defineProps<Props>()

const prices = await props.game.listResourcePrices(props.countryId)

</script>
<template>
    <table>
        <tr>
            <th></th>
            <th v-for="expressedResource in resources" :key="expressedResource.name">{{ expressedResource.name }}</th>
        </tr>
        <tr v-for="resource in resources" :key="resource.name">
            <td>{{ resource.name }}</td>
            <td v-for="expressedResource in resources" :key="expressedResource.name">{{ prices.get(expressedResource.name)?.get(resource.name)?.toFixed(2) }}</td>
        </tr>
    </table>
</template>

<style scoped>
table, th, td {
    border: 1px solid;
}
</style>