/**
 * Contact page places, from the map embeds on smnpower.com/contact-us.php. The plant
 * positions are the ones the Our Company map uses. Wording lives in the dictionaries.
 */
import type { Locale } from "@/i18n/config";

export const headOffice = {
  lon: 58.4958,
  lat: 23.6171229,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=23.6171229%2C58.4958",
} as const;

export type PlantId = "rusail" | "barka";

export const contactPlants: readonly {
  id: PlantId;
  photo: string;
  lon: number;
  lat: number;
  /** The client's Google My Maps site map. */
  mapId: string;
}[] = [
  {
    id: "rusail",
    photo: "/images/our-company/al-rusail-plant.jpg",
    lon: 58.16,
    lat: 23.5,
    mapId: "1hSw_ZcTSRhIEXDerhIFR3mK_UD4",
  },
  {
    id: "barka",
    photo: "/images/our-company/barka-plant.jpg",
    lon: 57.92,
    lat: 23.68,
    mapId: "1EJMjEEi7LTsU_42TXGuPGqBM6kk",
  },
];

export const siteMapEmbedUrl = (mapId: string, locale: Locale) =>
  `https://www.google.com/maps/d/embed?mid=${mapId}&hl=${locale}`;

export const siteMapViewerUrl = (mapId: string, locale: Locale) =>
  `https://www.google.com/maps/d/viewer?mid=${mapId}&hl=${locale}`;
