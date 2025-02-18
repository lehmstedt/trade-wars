import type { IConfigurator } from '@/configurator/IConfigurator'
import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
import { ForListingCountries } from '@/domain/drivingPorts/ForListingCountries'
import type { ForListingCountryGoals } from '@/domain/drivingPorts/ForListingCountryGoals'
import { ForListingCountryInventory } from '@/domain/drivingPorts/ForListingCountryInventory'
import { ForListingResourcePrices } from '@/domain/drivingPorts/ForListingResourcePrices'
import { ForListingResources } from '@/domain/drivingPorts/ForListingResources'
import { ForListingTariffs } from '@/domain/drivingPorts/ForListingTariffs'
import { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'
import { ForSettingTariff } from '@/domain/drivingPorts/ForSettingTariff'
import { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import { Country } from '@/domain/entities/Country'
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
    const playerCountry = new Country('Player')
    playerCountry.setResource(iron, 12)
    playerCountry.setResource(charcoal, 240)
    playerCountry.setTariff(10, whool)
    const anotherCountry = new Country('Great-Britain')
    anotherCountry.setResource(iron, 30)
    anotherCountry.setResource(whool, 10)

    this.countryRepository = new InMemoryCountryRepository([playerCountry, anotherCountry])
    this.resourceRepository = new InMemoryResourceRepository([iron, charcoal, whool])
  }
  buildForListingCountryGoals(): ForListingCountryGoals {
    throw new Error('Method not implemented.')
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
