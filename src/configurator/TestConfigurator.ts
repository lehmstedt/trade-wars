import { ForCheckingIfGameIsOver } from '@/domain/drivingPorts/ForCheckingIfGameIsOver'
import { ForListingCountries } from '@/domain/drivingPorts/ForListingCountries'
import { ForListingCountryGoals } from '@/domain/drivingPorts/ForListingCountryGoals'
import { ForListingCountryInventory } from '@/domain/drivingPorts/ForListingCountryInventory'
import { ForListingResourcePrices } from '@/domain/drivingPorts/ForListingResourcePrices'
import { ForListingResources } from '@/domain/drivingPorts/ForListingResources'
import { ForListingTariffs } from '@/domain/drivingPorts/ForListingTariffs'
import { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'
import { ForSettingTariff } from '@/domain/drivingPorts/ForSettingTariff'
import { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import type { Country } from '@/domain/entities/Country'
import type { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'
import { TestPriceProvider } from '@/tests/TestPriceProvider'

export class TestConfigurator {

  buildForListingCountryGoals(countries: Country[]): ForListingCountryGoals {
    return new ForListingCountryGoals(new InMemoryCountryRepository(countries))
  }

  buildForValidatingTrade(
    countries: Country[],
    resources: Resource[],
    price: number = 0
  ): ForValidatingTrade {
    return new ForValidatingTrade(
      new InMemoryCountryRepository(countries),
      new InMemoryResourceRepository(resources),
      new TestPriceProvider(price)
    )
  }

  buildForMakingTrade(
    countries: Country[],
    resources: Resource[],
    price: number = 0
  ): ForMakingTrade {
    return new ForMakingTrade(
      new InMemoryCountryRepository(countries),
      new InMemoryResourceRepository(resources),
      new TestPriceProvider(price)
    )
  }

  buildForListingResourcePrices(
    countries: Country[],
    resources: Resource[]
  ): ForListingResourcePrices {
    
    return new ForListingResourcePrices(new InMemoryCountryRepository(countries),
    new InMemoryResourceRepository(resources),)
  }

  buildForListingResources(resources: Resource[]): ForListingResources {
    return new ForListingResources(new InMemoryResourceRepository(resources))
  }

  buildForListingCountries(countries: Country[]): ForListingCountries {
    return new ForListingCountries(new InMemoryCountryRepository(countries))
  }

  buildForListingCountryInventory(countries: Country[]): ForListingCountryInventory {
    return new ForListingCountryInventory(new InMemoryCountryRepository(countries))
  }

  buildForSettingTariff(countries: Country[], resources: Resource[]): ForSettingTariff {
    return new ForSettingTariff(new InMemoryCountryRepository(countries),
    new InMemoryResourceRepository(resources))
  }

  buildForListingTariffs(countries: Country[], resources: Resource[]): ForListingTariffs {
    return new ForListingTariffs(new InMemoryCountryRepository(countries),
    new InMemoryResourceRepository(resources))
  }

  buildForCheckingIfGameIsOver(countries: Country[]): ForCheckingIfGameIsOver {
    return new ForCheckingIfGameIsOver(new InMemoryCountryRepository(countries))
  }
}
