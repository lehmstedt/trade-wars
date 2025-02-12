import type { Country, CountryId } from '@/domain/entities/Country'

export interface ForListingCountryTariffs {
  getById(countryId: CountryId): Promise<Country | undefined>
}
