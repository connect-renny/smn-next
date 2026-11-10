/** The hero's three stats, in the comp's order; their text is under `barkaPlant.hero.stats`. */
export const barkaStats = [
  { key: "location", icon: "/images/barka-plant/icon-location.png" },
  { key: "power", icon: "/images/barka-plant/icon-power.png" },
  { key: "water", icon: "/images/barka-plant/icon-water.png" },
] as const;

/** The two plants, as in the comp (both plant pages close with them), on the same tile art as Our Company's closing links. */
export const plantExploreLinks = {
  barka: {
    image: "/images/our-company/explore-mission-vision.jpg",
    href: { page: "plants/barka-ii" },
  },
  rusail: {
    image: "/images/our-company/explore-main-shareholders.jpg",
    href: { page: "plants/al-rusail" },
  },
} as const;

export const barkaImages = {
  plant: { src: "/images/barka-plant/plant-photo.jpg", width: 525, height: 575 },
  diagram: { src: "/images/barka-plant/plant-diagram.png", width: 1022, height: 724 },
} as const;
