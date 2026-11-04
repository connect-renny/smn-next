import { describe, expect, it } from "vitest";

import {
  globeFrame,
  type GlobeData,
  type GlobeView,
} from "../../src/components/sections/our-company/oman-globe-renderer";

const data: GlobeData = {
  center: { lon: 55.9, lat: 21.5 },
  coastCap: 6,
  cell: 0.0017,
  world: [],
  seeds: [],
  oman: [],
};

const view: GlobeView = {
  width: 1440,
  height: 810,
  globeR: 320,
  globeX: 720,
  globeY: 420,
  mapR: 6000,
  mapX: 720,
  mapY: 420,
};

describe("globe rotation over the scroll", () => {
  it("turns one way only, about once, and lands on Oman from any idle angle", () => {
    for (let idle = 0; idle < 360; idle += 5) {
      const lons = Array.from({ length: 401 }, (_, i) => globeFrame(i / 400, view, data, idle).lon);

      lons.slice(1).forEach((lon, i) => expect(lon).toBeLessThanOrEqual(lons[i]));
      const turned = lons[0] - lons[lons.length - 1];
      expect(turned).toBeGreaterThanOrEqual(180);
      expect(turned).toBeLessThan(540);
      expect(lons[lons.length - 1]).toBeCloseTo(data.center.lon, 5);
    }
  });

  it("has finished turning before the zoom starts", () => {
    const atZoom = globeFrame(0.56, view, data, 200);
    expect(atZoom.lon).toBeCloseTo(data.center.lon, 5);
    expect(atZoom.dive).toBe(0);
  });
});
