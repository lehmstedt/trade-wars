import { CountryNotFoundError } from '@/domain/Errors'
import type { CountryId } from '@/domain/entities/Country'
import { Tariff } from '@/domain/entities/Tariff'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'

export class ForListingTariffs {
  forListingCountryTariffs: ICountryPort
  constructor(forListingCountryTariffs: ICountryPort) {
    this.forListingCountryTariffs = forListingCountryTariffs
  }

  async execute(id: CountryId): Promise<Tariff[]> {
    const country = await this.forListingCountryTariffs.getById(id)

    if (!country) {
      throw new CountryNotFoundError()
    }

    return country.listTariffs()
  }
}
