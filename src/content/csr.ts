export const csrImages = {
  donating: { src: "/images/csr/oman-charitable-organization.jpg", width: 630, height: 500 },
  hackathon: { src: "/images/csr/goodness-hackathon.jpg", width: 630, height: 570 },
  craftVillage: { src: "/images/csr/craft-village.jpg", width: 630, height: 520 },
  rumaisPark: { src: "/images/csr/al-rumais-park.jpg", width: 630, height: 320 },
  agreementStanding: { src: "/images/csr/rumais-agreement-standing.jpg", width: 630, height: 400 },
  agreementSigning: { src: "/images/csr/rumais-agreement-signing.jpg", width: 630, height: 400 },
  awards: { src: "/images/csr/oman-csr-awards.jpg", width: 465, height: 255 },
} as const;

/** In the design's order; the text for each is under `csr.rumaisPark.components`. */
export const rumaisComponentIcons = {
  mosque: "/images/csr/icon-mosque.png",
  gardens: "/images/csr/icon-gardens.png",
  playAreas: "/images/csr/icon-play-areas.png",
  serviceFacilities: "/images/csr/icon-service-facilities.png",
} as const;
