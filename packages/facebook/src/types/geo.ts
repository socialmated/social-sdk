import type { Page } from './page.js';

/**
 * A mailing address
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/mailing-address/ | Graph API Reference - Mailing Address}
 */
interface MailingAddress {
  /**
   * The mailing address ID
   */
  id: string;

  /**
   * Address city name
   */
  city: string;

  /**
   * Page representing the address city
   */
  city_page?: Page;

  /**
   * Country of the address
   */
  country: string;

  /**
   * Postal code of the address
   */
  postal_code: string;

  /**
   * Region or state of the address
   */
  region: string;

  /**
   * Street address
   */
  street1: string;

  /**
   * Second part of the street address - apt, suite, etc
   */
  street2: string;
}

/**
 * Represents a location.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/location/ | Graph API Reference - Location}
 */
interface Location {
  /**
   * City.
   */
  city: string;

  /**
   * City ID. Any city identified is also a city you can use for targeting ads.
   */
  city_id?: number;

  /**
   * Country.
   */
  country: string;

  /**
   * Country code.
   */
  country_code?: string;

  /**
   * Latitude.
   */
  latitude: number;

  /**
   * The parent location if this location is located within another location.
   */
  located_in: string;

  /**
   * Longitude.
   */
  longitude: number;

  /**
   * Name.
   */
  name: string;

  /**
   * Region.
   */
  region?: string;

  /**
   * Region ID. Specifies a geographic region, such as California.
   * An identified region is the same as one you can use to target ads.
   */
  region_id?: number;

  /**
   * State.
   */
  state: string;

  /**
   * Street.
   */
  street: string;

  /**
   * Zip code.
   */
  zip: string;
}

export type { MailingAddress, Location };
