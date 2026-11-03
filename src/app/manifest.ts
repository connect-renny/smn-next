import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SMN Power Holding SAOG",
    short_name: "SMN Power",
    start_url: "/en",
    display: "standalone",
    theme_color: "#12294f",
    background_color: "#ffffff",
    icons: [
      { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
