import { Country, CountryId } from '@/domain/entities/Country'

export interface ICountryPort {
  save(country: Country): Promise<void>
  getById(countryId: CountryId): Promise<Country | undefined>
  list(): Promise<Country[]>
}
