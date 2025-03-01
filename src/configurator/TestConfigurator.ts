import type { IConfigurator } from '@/configurator/IConfigurator'
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

type GameActors = { countries: Country[] }
export class TestConfigurator implements IConfigurator {
  countryRepository: InMemoryCountryRepository
  resourceRepository: InMemoryResourceRepository

  constructor(actors?: GameActors) {
    this.countryRepository = actors?.countries
      ? new InMemoryCountryRepository(actors.countries)
      : new InMemoryCountryRepository()
    this.resourceRepository = new InMemoryResourceRepository()
  }

  buildForListingCountryGoals(): ForListingCountryGoals {
    return new ForListingCountryGoals(this.countryRepository)
  }

  buildForValidatingTrade(
    countries: Country[],
    resources: Resource[],
    price: number = 0
  ): ForValidatingTrade {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForValidatingTrade(
      this.countryRepository,
      this.resourceRepository,
      new TestPriceProvider(price)
    )
  }

  buildForMakingTrade(
    countries: Country[],
    resources: Resource[],
    price: number = 0
  ): ForMakingTrade {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForMakingTrade(
      this.countryRepository,
      this.resourceRepository,
      new TestPriceProvider(price)
    )
  }

  buildForListingResourcePrices(
    countries: Country[],
    resources: Resource[]
  ): ForListingResourcePrices {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForListingResourcePrices(this.countryRepository, this.resourceRepository)
  }

  buildForListingResources(resources: Resource[]): ForListingResources {
    this.resourceRepository.set(resources)
    return new ForListingResources(this.resourceRepository)
  }

  buildForListingCountries(countries: Country[]): ForListingCountries {
    this.countryRepository.set(countries)
    return new ForListingCountries(this.countryRepository)
  }

  buildForListingCountryInventory(countries: Country[]): ForListingCountryInventory {
    this.countryRepository.set(countries)
    return new ForListingCountryInventory(this.countryRepository)
  }

  buildForSettingTariff(countries: Country[], resources: Resource[]): ForSettingTariff {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForSettingTariff(this.countryRepository, this.resourceRepository)
  }

  buildForListingTariffs(countries: Country[], resources: Resource[]): ForListingTariffs {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForListingTariffs(this.countryRepository, this.resourceRepository)
  }

  buildForCheckingIfGameIsOver(): ForCheckingIfGameIsOver {
    return new ForCheckingIfGameIsOver(this.countryRepository)
  }
}
