import type { IConfigurator } from '@/configurator/IConfigurator'
import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
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
import { CountryBuilder } from '@/domain/entities/CountryBuilder'
import { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'

export class InMemoryConfigurator implements IConfigurator {
  countryRepository: InMemoryCountryRepository
  resourceRepository: InMemoryResourceRepository

  constructor() {
    const iron = new Resource('Iron')
    const charcoal = new Resource('Charcoal')
    const whool = new Resource('Whool')

    const playerCountry = new CountryBuilder()
      .withName('Player')
      .withGoal(whool, 10)
      .withResource(iron, 12)
      .withResource(charcoal, 240)
      .withTariff(whool, 10)
      .build()

    const greatBritain = new CountryBuilder()
      .withName('Great-Britain')
      .withGoal(charcoal, 6)
      .withResource(iron, 30)
      .withResource(whool, 10)
      .build()

    this.countryRepository = new InMemoryCountryRepository([playerCountry, greatBritain])
    this.resourceRepository = new InMemoryResourceRepository([iron, charcoal, whool])
  }
  buildForCheckingIfGameIsOver(): ForCheckingIfGameIsOver {
    return new ForCheckingIfGameIsOver(this.countryRepository)
  }

  buildForListingCountryGoals(): ForListingCountryGoals {
    return new ForListingCountryGoals(this.countryRepository)
  }

  buildForValidatingTrade(): ForValidatingTrade {
    return new ForValidatingTrade(
      this.countryRepository,
      this.resourceRepository,
      new CountryPairPriceProvider()
    )
  }

  buildForMakingTrade(): ForMakingTrade {
    return new ForMakingTrade(
      this.countryRepository,
      this.resourceRepository,
      new CountryPairPriceProvider()
    )
  }

  buildForListingResourcePrices(): ForListingResourcePrices {
    return new ForListingResourcePrices(this.countryRepository, this.resourceRepository)
  }

  buildForListingResources(): ForListingResources {
    return new ForListingResources(this.resourceRepository)
  }

  buildForListingCountries(): ForListingCountries {
    return new ForListingCountries(this.countryRepository)
  }

  buildForListingCountryInventory(): ForListingCountryInventory {
    return new ForListingCountryInventory(this.countryRepository)
  }

  buildForListingTariffs(): ForListingTariffs {
    return new ForListingTariffs(this.countryRepository, this.resourceRepository)
  }

  buildForSettingTariff(): ForSettingTariff {
    return new ForSettingTariff(this.countryRepository, this.resourceRepository)
  }
}
