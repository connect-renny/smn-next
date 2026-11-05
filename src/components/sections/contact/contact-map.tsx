import { Droplet } from "@/components/ui/droplet";
import { contactPlants, headOffice } from "@/content/contact";
import omanDots from "@/content/oman-map-dots.json";
import type { Dictionary } from "@/i18n/get-dictionary";

const WIDTH = 700;
const HEIGHT = 460;
const CENTRE = { lon: 58.15, lat: 23.45 };
/** Pixels per degree of latitude: close enough to the coast to part Muscat from Barka. */
const SCALE = 170;
const LON_SCALE = SCALE * Math.cos((CENTRE.lat * Math.PI) / 180);
/** Rings the dots ripple out in, from the head office. */
const RINGS = 16;

const project = (lon: number, lat: number) => ({
  x: WIDTH / 2 + (lon - CENTRE.lon) * LON_SCALE,
  y: HEIGHT / 2 - (lat - CENTRE.lat) * SCALE,
});

const office = project(headOffice.lon, headOffice.lat);

/**
 * Worked out on the server, so the full dot file never reaches the browser. Each ring
 * and shade is one path of zero-length round-capped lines, which draw as dots.
 */
function dotRings() {
  const reach = Math.hypot(WIDTH, HEIGHT);
  const rings = new Map<string, { ring: number; coast: boolean; d: string }>();
  for (let i = 0; i < omanDots.oman.length; i += 3) {
    const { x, y } = project(omanDots.oman[i] / 1000, omanDots.oman[i + 1] / 1000);
    if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT) continue;
    const ring = Math.min(
      RINGS - 1,
      Math.floor((Math.hypot(x - office.x, y - office.y) / reach) * RINGS * 1.5),
    );
    const coast = omanDots.oman[i + 2] <= 1;
    const key = `${ring}-${coast}`;
    const entry = rings.get(key) ?? { ring, coast, d: "" };
    entry.d += `M${Math.round(x)} ${Math.round(y)}h0`;
    rings.set(key, entry);
  }
  return [...rings.values()];
}

/** A line arcing from the head office out to a plant. */
function arcTo(x: number, y: number) {
  const midX = (office.x + x) / 2;
  const midY = (office.y + y) / 2 - Math.hypot(x - office.x, y - office.y) * 0.42;
  return `M${office.x.toFixed(1)} ${office.y.toFixed(1)}Q${midX.toFixed(1)} ${midY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
}

const percent = (value: number, of: number) => `${((value / of) * 100).toFixed(2)}%`;

/** SMN's own dotted Oman, at true positions. It keeps its geography in Arabic too. */
export function ContactMap({ copy }: { copy: Dictionary["contact"] }) {
  return (
    <div data-contact-map className="contact-map">
      {/* One frame for dots and pins, so they stay together at any panel shape. */}
      <div className="contact-map-stage">
        <svg aria-hidden viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          {dotRings().map(({ ring, coast, d }) => (
            <path
              key={`${ring}-${coast}`}
              d={d}
              className="contact-map-dots"
              data-coast={coast || undefined}
              style={{ "--ring": ring } as React.CSSProperties}
            />
          ))}
          {contactPlants.map(({ id, lon, lat }) => {
            const { x, y } = project(lon, lat);
            return (
              <path
                key={id}
                d={arcTo(x, y)}
                pathLength={1}
                data-arc={id}
                className="contact-map-arc"
              />
            );
          })}
        </svg>

        {contactPlants.map(({ id, lon, lat }) => {
          const { x, y } = project(lon, lat);
          return (
            <span
              key={id}
              data-pin={id}
              className="contact-pin contact-pin-plant"
              style={{ left: percent(x, WIDTH), top: percent(y, HEIGHT) }}
            >
              <i aria-hidden />
              <b dir="auto">{copy.map[id]}</b>
            </span>
          );
        })}

        <span
          data-pin="office"
          className="contact-pin contact-pin-office"
          style={{ left: percent(office.x, WIDTH), top: percent(office.y, HEIGHT) }}
        >
          <i aria-hidden />
          <Droplet />
          <b dir="auto">
            {copy.map.office}
            <small>{copy.office.area}</small>
          </b>
        </span>
      </div>
    </div>
  );
}
