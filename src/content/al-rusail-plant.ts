/** The hero's three stats; their text is under `rusailPlant.hero.stats`. */
export const rusailStats = [
  { key: "location", icon: "/images/barka-plant/icon-location.png" },
  { key: "power", icon: "/images/barka-plant/icon-power.png" },
  { key: "turbines", icon: "/images/al-rusail-plant/icon-turbine.png" },
] as const;

export const rusailImages = {
  plant: { src: "/images/our-company/al-rusail-plant.jpg", width: 525, height: 575 },
  diagram: { src: "/images/al-rusail-plant/plant-diagram.png", width: 1060, height: 519 },
} as const;
