/**
 * Generates the dot lattices behind the Our Company globe from Natural Earth
 * (world-atlas). Run once and commit the output; nothing here ships to the browser.
 *
 *   node scripts/generate-oman-map-dots.mjs
 *
 * Output (src/content/oman-map-dots.json), all flat arrays:
 *   world  [lon, lat, …] × 100 — land dots outside Oman, evenly spaced on the sphere
 *   seeds  [lon, lat, …] × 100 — the same lattice's dots inside Oman
 *   oman   [lon, lat, coast, …] — lon/lat × 1000, coast = cells from the shoreline (capped)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const OMAN_ID = "512";
const OMAN_CENTER = { lon: 55.9, lat: 21.5 };
const WORLD_STEP_DEG = 1.6;
const OMAN_CELL = 0.0017; // lattice spacing on the unit sphere
const COAST_CAP = 6;
const RAD = Math.PI / 180;

const load = (name) =>
  JSON.parse(readFileSync(new URL(`../node_modules/world-atlas/${name}`, import.meta.url)));

const polygonsOf = (geometry) =>
  geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

const inRing = (lon, lat, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const inPolygon = (lon, lat, rings) =>
  inRing(lon, lat, rings[0]) && !rings.slice(1).some((hole) => inRing(lon, lat, hole));

/** Polygons with their bounding boxes, so most point tests exit immediately. */
const indexed = (polygons) =>
  polygons.map((rings) => {
    const lons = rings[0].map((p) => p[0]);
    const lats = rings[0].map((p) => p[1]);
    return {
      rings,
      box: [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)],
    };
  });

const hits = (lon, lat, list) =>
  list.some(
    ({ rings, box }) =>
      lon >= box[0] &&
      lon <= box[2] &&
      lat >= box[1] &&
      lat <= box[3] &&
      inPolygon(lon, lat, rings),
  );

// ─── World lattice: rows of equal angular spacing, staggered, Antarctica left out ───
const atlas50 = load("countries-50m.json");
const world = indexed(
  feature(atlas50, atlas50.objects.countries).features.flatMap((f) => polygonsOf(f.geometry)),
);

const atlas10 = load("countries-10m.json");
const omanDetail = feature(atlas10, atlas10.objects.countries).features.find(
  (f) => f.id === OMAN_ID,
);
const omanPolygons = indexed(polygonsOf(omanDetail.geometry));

const worldDots = [];
const seedDots = [];
let row = 0;
for (let lat = -56; lat <= 84; lat += WORLD_STEP_DEG, row++) {
  const step = WORLD_STEP_DEG / Math.max(0.12, Math.cos(lat * RAD));
  for (let lon = -180 + (row % 2 ? step / 2 : 0); lon < 180; lon += step) {
    const target = hits(lon, lat, omanPolygons)
      ? seedDots
      : hits(lon, lat, world)
        ? worldDots
        : null;
    if (target) target.push(Math.round(lon * 100), Math.round(lat * 100));
  }
}

// ─── Oman lattice: a hexagonal grid in the final map's own plane, so it reads perfectly regular ───
const sinC = Math.sin(OMAN_CENTER.lat * RAD);
const cosC = Math.cos(OMAN_CENTER.lat * RAD);

/** Inverse orthographic projection centred on Oman. */
const unproject = (x, y) => {
  const z = Math.sqrt(1 - x * x - y * y);
  const lat = Math.asin(y * cosC + z * sinC) / RAD;
  const lon = OMAN_CENTER.lon + Math.atan2(x, z * cosC - y * sinC) / RAD;
  return [lon, lat];
};

const project = (lon, lat) => {
  const dl = (lon - OMAN_CENTER.lon) * RAD;
  const phi = lat * RAD;
  return [Math.cos(phi) * Math.sin(dl), cosC * Math.sin(phi) - sinC * Math.cos(phi) * Math.cos(dl)];
};

const ROW_H = (OMAN_CELL * Math.sqrt(3)) / 2;
const REACH = 0.1;
const SPAN = Math.ceil(REACH / ROW_H);
const key = (r, c) => `${r}:${c}`;
const cellXY = (r, c) => [(c + (r & 1 ? 0.5 : 0)) * OMAN_CELL, r * ROW_H];

const land = new Set();
for (let r = -SPAN; r <= SPAN; r++) {
  for (let c = -SPAN; c <= SPAN; c++) {
    const [lon, lat] = unproject(...cellXY(r, c));
    if (hits(lon, lat, omanPolygons)) land.add(key(r, c));
  }
}

// Exclaves and islands smaller than a cell (Madha, say) still get their nearest cell.
const MIN_AREA_DOTTED = 0.002; // deg² — ignores the stray coastal rocks
for (const { rings, box } of omanPolygons) {
  if ((box[2] - box[0]) * (box[3] - box[1]) < MIN_AREA_DOTTED) continue;
  const [px, py] = project((box[0] + box[2]) / 2, (box[1] + box[3]) / 2);
  const r = Math.round(py / ROW_H);
  const c = Math.round(px / OMAN_CELL - (r & 1 ? 0.5 : 0));
  let found = false;
  for (let dr = -2; dr <= 2 && !found; dr++) {
    for (let dc = -2; dc <= 2 && !found; dc++) {
      const [lon, lat] = unproject(...cellXY(r + dr, c + dc));
      if (land.has(key(r + dr, c + dc)) && inPolygon(lon, lat, rings)) found = true;
    }
  }
  if (!found) land.add(key(r, c));
}

const neighbours = (r, c) => {
  const shift = r & 1 ? 0 : -1;
  return [
    [r, c - 1],
    [r, c + 1],
    [r - 1, c + shift],
    [r - 1, c + shift + 1],
    [r + 1, c + shift],
    [r + 1, c + shift + 1],
  ];
};

// Breadth-first from the shoreline: the coast value drives the halftone in the shader.
const coast = new Map();
let frontier = [...land].filter((k) => {
  const [r, c] = k.split(":").map(Number);
  return neighbours(r, c).some(([nr, nc]) => !land.has(key(nr, nc)));
});
frontier.forEach((k) => coast.set(k, 0));
for (let depth = 1; depth <= COAST_CAP && frontier.length; depth++) {
  const next = [];
  for (const k of frontier) {
    const [r, c] = k.split(":").map(Number);
    for (const [nr, nc] of neighbours(r, c)) {
      const nk = key(nr, nc);
      if (land.has(nk) && !coast.has(nk)) {
        coast.set(nk, depth);
        next.push(nk);
      }
    }
  }
  frontier = next;
}

const omanDots = [];
for (const k of land) {
  const [r, c] = k.split(":").map(Number);
  const [lon, lat] = unproject(...cellXY(r, c));
  omanDots.push(Math.round(lon * 1000), Math.round(lat * 1000), coast.get(k) ?? COAST_CAP);
}

writeFileSync(
  new URL("../src/content/oman-map-dots.json", import.meta.url),
  JSON.stringify({
    center: OMAN_CENTER,
    coastCap: COAST_CAP,
    cell: OMAN_CELL,
    world: worldDots,
    seeds: seedDots,
    oman: omanDots,
  }),
);
console.log(
  `world ${worldDots.length / 2}  seeds ${seedDots.length / 2}  oman ${omanDots.length / 3}  polygons ${omanPolygons.length}`,
);
