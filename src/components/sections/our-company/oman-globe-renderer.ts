/**
 * The dotted globe behind the Our Company map: one orthographic camera over real
 * geography, from a spinning world down to a dense Oman. Plain WebGL points, because
 * a few thousand dots at 60fps is all this needs and a 3D library would outweigh it.
 *
 * Every position stays a true lon/lat on the sphere, so markers placed with
 * `project()` line up with the dots at any size.
 */

export type GlobeData = {
  center: { lon: number; lat: number };
  coastCap: number;
  /** Spacing of the Oman lattice on the unit sphere. */
  cell: number;
  world: number[];
  seeds: number[];
  oman: number[];
};

const RAD = Math.PI / 180;
const MUSCAT = { lon: 58.41, lat: 23.59 };
/** Where the opening spin starts, relative to Oman. */
const START_LON_OFFSET = 324;
/**
 * The scroll makes one turn, not a fixed number of degrees: it has to land on Oman from
 * wherever the idle spin left the globe, so it runs from half a turn to a turn and a half.
 */
const TOUR_MIN_DEGREES = 180;
const STAR_COUNT = 170;
const ORANGE = [0.953, 0.573, 0.0] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const segment = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function toSphere(lon: number, lat: number): [number, number, number] {
  const l = lon * RAD;
  const f = lat * RAD;
  return [Math.cos(f) * Math.sin(l), Math.sin(f), Math.cos(f) * Math.cos(l)];
}

/** The unit-plane position of a point once Oman is centred, north up. */
export function project(lon: number, lat: number, center: GlobeData["center"]) {
  const dl = (lon - center.lon) * RAD;
  const f = lat * RAD;
  const c = center.lat * RAD;
  return {
    x: Math.cos(f) * Math.sin(dl),
    y: Math.cos(c) * Math.sin(f) - Math.sin(c) * Math.cos(f) * Math.cos(dl),
  };
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export type GlobeView = {
  width: number;
  height: number;
  /** Globe radius at the start of the dive, in CSS px. */
  globeR: number;
  globeX: number;
  globeY: number;
  /** Sphere radius once Oman fills the stage, and where the sphere's centre sits then. */
  mapR: number;
  mapX: number;
  mapY: number;
};

function omanBounds(data: GlobeData) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < data.oman.length; i += 3) {
    const { x, y } = project(data.oman[i] / 1000, data.oman[i + 1] / 1000, data.center);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}

export function computeView(
  data: GlobeData,
  width: number,
  height: number,
  /** Height of the fixed header the map has to clear. */
  headerH: number,
): GlobeView {
  const narrow = width < 768;
  const bounds = omanBounds(data);

  // Phones also keep the journey rail above the map.
  const top = headerH + (narrow ? 56 : 20);
  const bottom = narrow ? 168 : Math.min(56, height * 0.06);
  const availW = narrow ? width - 28 : width * 0.6;
  const availH = height - top - bottom;

  const mapR = Math.min(availW / (bounds.maxX - bounds.minX), availH / (bounds.maxY - bounds.minY));
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;

  return {
    width,
    height,
    globeR: Math.min(width * 0.44, (height - top * 0.6) * 0.43),
    globeX: width / 2,
    globeY: height / 2 + top * 0.18,
    mapR,
    mapX: width / 2 - mapR * midX,
    mapY: top + availH / 2 + mapR * midY,
  };
}

// ─── The scroll timeline, as plain numbers ────────────────────────────────────

/** Scroll progress at which the map has landed and the markers should play. */
export const MARKERS_AT = 0.86;
/** Scroll progress at which the globe starts levelling out for Oman. */
const SETTLE_FROM = 0.3;

export type GlobeFrame = {
  lon: number;
  lat: number;
  roll: number;
  r: number;
  x: number;
  y: number;
  /** 0 → 1 through the dive. */
  dive: number;
  /** 0 → 1 as the world dots leave. */
  worldOut: number;
  /** Oman's coarse dots: orange as it comes round, gone once the map has formed. */
  seedHeat: number;
  seedOut: number;
  /** Coarse dots splitting into the detailed map. */
  morph: number;
  /** Bell curve for the lock-on ring. */
  lock: number;
  /** The gradient arriving behind the finished map. */
  backdrop: number;
};

export function globeFrame(
  p: number,
  view: GlobeView,
  data: GlobeData,
  idleLon: number,
): GlobeFrame {
  // Eases out only: the very first scroll has to turn the globe visibly, then Oman
  // arrives gently and holds while the lock-on ring closes around it.
  const toured = 1 - segment(p, 0, 0.46);
  const tour = 1 - toured * toured;
  const settle = smooth(segment(p, SETTLE_FROM, 0.46));
  const dive = smoother(segment(p, 0.56, 0.84));
  const turn =
    TOUR_MIN_DEGREES + ((((START_LON_OFFSET + idleLon - TOUR_MIN_DEGREES) % 360) + 360) % 360);

  return {
    lon: data.center.lon + turn * (1 - tour),
    lat: mix(14, data.center.lat, settle),
    roll: mix(-17, 0, settle),
    // Exponential, so the camera feels like it travels at one speed all the way in.
    r: view.globeR * Math.pow(view.mapR / view.globeR, dive),
    x: mix(view.globeX, view.mapX, dive),
    y: mix(view.globeY, view.mapY, dive),
    dive,
    worldOut: smooth(segment(p, 0.62, 0.76)),
    // Already warm on the opening globe, so Oman reads as the destination from the start.
    seedHeat: mix(0.75, 1, smooth(segment(p, 0.4, 0.54))),
    seedOut: smooth(segment(p, 0.74, 0.82)),
    morph: segment(p, 0.62, 0.87),
    lock: smooth(segment(p, 0.44, 0.52)) * (1 - smooth(segment(p, 0.6, 0.67))),
    backdrop: smooth(segment(p, 0.58, 0.84)),
  };
}

function rotation(lon: number, lat: number, roll: number) {
  const cy = Math.cos(lon * RAD);
  const sy = Math.sin(lon * RAD);
  const cx = Math.cos(lat * RAD);
  const sx = Math.sin(lat * RAD);
  const cz = Math.cos(roll * RAD);
  const sz = Math.sin(roll * RAD);
  // Ry(-lon) brings the longitude to the front, Rx tilts its latitude up, Rz rolls the axis.
  const r00 = cy;
  const r02 = -sy;
  const r10 = -sx * sy;
  const r11 = cx;
  const r12 = -sx * cy;
  const r20 = cx * sy;
  const r21 = sx;
  const r22 = cx * cy;
  // GLSL takes the matrix column by column.
  return new Float32Array([
    cz * r00 - sz * r10,
    sz * r00 + cz * r10,
    r20,
    -sz * r11,
    cz * r11,
    r21,
    cz * r02 - sz * r12,
    sz * r02 + cz * r12,
    r22,
  ]);
}

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERTEX = /* glsl */ `
precision highp float;
attribute vec3 aPos;
attribute vec3 aSeed;
attribute vec4 aMeta; // rand, coast (1 on the shore), delay, x across the map

uniform float uKind; // 0 stars, 1 world, 2 coarse Oman, 3 detailed Oman
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uR;
uniform mat3 uRot;
uniform float uDpr;
uniform float uSize;
uniform float uFineSize;
uniform float uAlpha;
uniform float uReveal;
uniform float uMorph;
uniform float uHeat;
uniform float uTime;
uniform float uWarp;
uniform vec2 uMouse;
uniform vec2 uOffset;
uniform float uShadow;
uniform vec2 uShadowOff;
uniform float uWave;
uniform vec2 uWaveAt;
uniform vec3 uOrange;

varying vec4 vColor;
varying float vRadius;

void main() {
  vec2 px;
  float size;
  float alpha;
  vec3 color = vec3(1.0);

  if (uKind < 0.5) {
    float depth = aPos.z;
    px = uRes * 0.5 + aPos.xy * uRes * 0.62 * (1.0 + uWarp * (1.0 + depth * 2.5)) + uOffset * depth * 2.0;
    size = (0.7 + depth * 1.3) * (1.0 + uWarp * 1.5);
    alpha = uAlpha * (0.14 + 0.5 * depth) * (0.65 + 0.35 * sin(uTime * 0.9 + aMeta.x * 40.0)) * uReveal;
    color = vec3(0.78, 0.88, 1.0);
  } else {
    vec3 sphere = aPos;
    float settled = 1.0;
    if (uKind > 2.5) {
      settled = smoothstep(aMeta.z, aMeta.z + 0.4, uMorph);
      sphere = normalize(mix(aSeed, aPos, settled));
    }
    vec3 p = uRot * sphere;
    px = uCenter + uR * vec2(p.x, -p.y) + uOffset;

    if (uKind < 1.5) {
      float front = smoothstep(-0.05, 0.16, p.z);
      float shown = smoothstep(aMeta.x * 0.6, aMeta.x * 0.6 + 0.4, uReveal);
      size = uSize * mix(0.58, 1.0, front) * (0.8 + 0.2 * p.z) * shown;
      alpha = mix(0.17, 1.0 - 0.28 * (1.0 - p.z), front) * uAlpha * shown;
      color = mix(vec3(0.55, 0.72, 1.0), vec3(1.0), front);
    } else if (uKind < 2.5) {
      float beat = 1.0 + uHeat * (0.55 + 0.35 * sin(uTime * 4.2 + aMeta.x * 6.0));
      float facing = smoothstep(-0.05, 0.1, p.z);
      size = uSize * beat * facing;
      alpha = uAlpha * facing * uReveal;
      color = mix(vec3(1.0), uOrange, uHeat);
    } else {
      float halftone = mix(0.44, 1.0, aMeta.y);
      float shimmer = 1.0 + 0.09 * sin(uTime * 1.3 + p.x * 90.0 + p.y * 70.0);
      float gap = (distance(p.xy, uWaveAt) - uWave) / 0.012;
      float ring = uWave < 0.0 ? 0.0 : exp(-gap * gap);
      size = mix(uSize * 0.9, uFineSize * halftone * shimmer, settled) * (1.0 + ring * 0.75);
      alpha = smoothstep(0.0, 0.1, settled) * uAlpha * mix(0.5, 1.0, aMeta.y);
      vec3 tint = mix(vec3(0.62, 0.86, 1.0), vec3(0.64, 0.98, 0.72), aMeta.w);
      color = mix(mix(uOrange, tint, smoothstep(0.1, 0.8, settled)), vec3(1.0), aMeta.y * aMeta.y * 0.85);
      color = mix(color, uOrange, ring * 0.65);
      if (uShadow > 0.0) {
        px += uShadowOff * settled;
        color = vec3(0.01, 0.07, 0.17);
        alpha *= uShadow * settled;
        size = max(size, uFineSize * 0.7);
      }
    }
  }

  // The cursor acts as a soft lens over whichever dots lie beneath it.
  if (uKind > 0.5 && uMouse.x > -9000.0 && uShadow <= 0.0) {
    vec2 away = px - uMouse;
    float lens = exp(-dot(away, away) / 8100.0);
    px += normalize(away + 0.001) * lens * 7.0;
    size *= 1.0 + lens * 0.7;
  }

  gl_Position = vec4((px / uRes * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = (size + 1.5) * uDpr;
  vRadius = size * uDpr * 0.5;
  vColor = vec4(color * alpha, alpha);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
varying vec4 vColor;
varying float vRadius;
uniform float uDpr;

void main() {
  float span = vRadius * 2.0 + 1.5 * uDpr;
  float d = length(gl_PointCoord - 0.5) * span;
  float edge = 1.0 - smoothstep(vRadius - 0.6, vRadius + 0.6, d);
  if (edge <= 0.0) discard;
  gl_FragColor = vColor * edge;
}
`;

// ─── Vertex data ──────────────────────────────────────────────────────────────

const STRIDE = 10; // aPos 3 + aSeed 3 + aMeta 4

function buildVertices(data: GlobeData) {
  // Deterministic, so the sparkle doesn't reshuffle after a lost context.
  let state = 7;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };

  const worldCount = data.world.length / 2;
  const seedCount = data.seeds.length / 2;
  const fineCount = data.oman.length / 3;
  const out = new Float32Array((STAR_COUNT + worldCount + seedCount + fineCount) * STRIDE);
  let o = 0;
  const push = (pos: readonly number[], seed: readonly number[], meta: readonly number[]) => {
    out.set(pos, o);
    out.set(seed, o + 3);
    out.set(meta, o + 6);
    o += STRIDE;
  };

  for (let i = 0; i < STAR_COUNT; i++) {
    push([random() * 2 - 1, random() * 2 - 1, random()], [0, 0, 0], [random(), 0, 0, 0]);
  }

  for (let i = 0; i < data.world.length; i += 2) {
    const pos = toSphere(data.world[i] / 100, data.world[i + 1] / 100);
    push(pos, pos, [random(), 0, 0, 0]);
  }

  const seeds: [number, number, number][] = [];
  for (let i = 0; i < data.seeds.length; i += 2) {
    const pos = toSphere(data.seeds[i] / 100, data.seeds[i + 1] / 100);
    seeds.push(pos);
    push(pos, pos, [random(), 0, 0, 0]);
  }

  // Each detailed dot is born at its nearest coarse dot, then travels out to its true place.
  const muscat = toSphere(MUSCAT.lon, MUSCAT.lat);
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (let i = 0; i < data.oman.length; i += 3) {
    minLon = Math.min(minLon, data.oman[i]);
    maxLon = Math.max(maxLon, data.oman[i]);
  }
  for (let i = 0; i < data.oman.length; i += 3) {
    const pos = toSphere(data.oman[i] / 1000, data.oman[i + 1] / 1000);
    let nearest = seeds[0];
    let best = -Infinity;
    for (const seed of seeds) {
      const dot = seed[0] * pos[0] + seed[1] * pos[1] + seed[2] * pos[2];
      if (dot > best) {
        best = dot;
        nearest = seed;
      }
    }
    const fromMuscat = Math.acos(
      Math.min(1, muscat[0] * pos[0] + muscat[1] * pos[1] + muscat[2] * pos[2]),
    );
    const coast = 1 - data.oman[i + 2] / data.coastCap;
    const across = (data.oman[i] - minLon) / (maxLon - minLon);
    const delay = Math.min(0.6, random() * 0.22 + (fromMuscat / 0.2) * 0.38);
    push(pos, nearest, [random(), coast, delay, across]);
  }

  return {
    vertices: out,
    ranges: {
      stars: [0, STAR_COUNT],
      world: [STAR_COUNT, worldCount],
      seeds: [STAR_COUNT + worldCount, seedCount],
      fine: [STAR_COUNT + worldCount + seedCount, fineCount],
    },
  } as const;
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export type GlobeInput = {
  time: number;
  reveal: number;
  /** Seconds since the shockwave started, or negative when none is running. */
  wave: number;
  mouseX: number;
  mouseY: number;
  offsetX: number;
  offsetY: number;
};

export function supportsWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl"));
  } catch {
    return false;
  }
}

export function createGlobeRenderer(canvas: HTMLCanvasElement, data: GlobeData) {
  const { vertices, ranges } = buildVertices(data);
  const waveAt = project(MUSCAT.lon, MUSCAT.lat, data.center);

  let gl: WebGLRenderingContext;
  let uniform: (name: string) => WebGLUniformLocation | null;
  let lost = false;
  let dpr = 1;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Globe shader failed to compile");
    }
    return shader;
  };

  const init = () => {
    const context = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!context) throw new Error("WebGL unavailable");
    gl = context;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
      throw new Error(gl.getProgramInfoLog(program) ?? "Globe program failed to link");
    }
    gl.useProgram(program);

    const cache = new Map<string, WebGLUniformLocation | null>();
    uniform = (name) => {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
      return cache.get(name)!;
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const bytes = STRIDE * 4;
    (
      [
        ["aPos", 3, 0],
        ["aSeed", 3, 12],
        ["aMeta", 4, 24],
      ] as const
    ).forEach(([name, size, offset]) => {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, bytes, offset);
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    init();
    lost = false;
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  init();

  return {
    resize(view: GlobeView) {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(view.width * dpr);
      canvas.height = Math.round(view.height * dpr);
    },

    draw(view: GlobeView, frame: GlobeFrame, input: GlobeInput) {
      if (lost) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const f1 = (name: string, value: number) => gl.uniform1f(uniform(name), value);
      const f2 = (name: string, x: number, y: number) => gl.uniform2f(uniform(name), x, y);

      f2("uRes", view.width, view.height);
      f2("uCenter", frame.x, frame.y);
      f1("uR", frame.r);
      gl.uniformMatrix3fv(uniform("uRot"), false, rotation(frame.lon, frame.lat, frame.roll));
      f1("uDpr", dpr);
      f1("uSize", Math.max(2, view.globeR * 0.0098));
      f1("uFineSize", view.mapR * data.cell * 0.66);
      f1("uReveal", input.reveal);
      f1("uMorph", frame.morph);
      f1("uHeat", frame.seedHeat);
      f1("uTime", input.time);
      f1("uWarp", frame.dive * frame.dive * 2.2);
      f2("uMouse", input.mouseX, input.mouseY);
      f2("uOffset", input.offsetX, input.offsetY);
      f1("uWave", input.wave < 0 ? -1 : input.wave * 0.11);
      f2("uWaveAt", waveAt.x, waveAt.y);
      gl.uniform3f(uniform("uOrange"), ORANGE[0], ORANGE[1], ORANGE[2]);
      f1("uShadow", 0);
      f2("uShadowOff", 0, 0);

      const pass = (kind: number, alpha: number, [start, count]: readonly [number, number]) => {
        if (alpha <= 0.001) return;
        f1("uKind", kind);
        f1("uAlpha", alpha);
        gl.drawArrays(gl.POINTS, start, count);
      };

      pass(0, 1 - frame.backdrop * 0.7, ranges.stars);
      pass(1, 1 - frame.worldOut, ranges.world);

      // The client's map throws a long shadow to the south-west; here it is, in dots.
      if (frame.morph > 0) {
        const unit = view.mapR * data.cell * 0.62;
        [
          [4, 0.14],
          [3, 0.2],
          [2, 0.3],
          [1, 0.42],
        ].forEach(([steps, strength]) => {
          f1("uShadow", strength);
          f2("uShadowOff", -steps * unit, steps * unit);
          pass(3, 1, ranges.fine);
        });
        f1("uShadow", 0);
        f2("uShadowOff", 0, 0);
        pass(3, 1, ranges.fine);
      }

      pass(2, 1 - frame.seedOut, ranges.seeds);
    },

    destroy() {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    },
  };
}

/** The finished map on a 2D canvas: for reduced motion, or a browser without WebGL. */
export function drawStaticMap(canvas: HTMLCanvasElement, data: GlobeData, view: GlobeView) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(view.width * dpr);
  canvas.height = Math.round(view.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#fff";
  for (let i = 0; i < data.oman.length; i += 3) {
    const { x, y } = project(data.oman[i] / 1000, data.oman[i + 1] / 1000, data.center);
    const coast = 1 - data.oman[i + 2] / data.coastCap;
    ctx.globalAlpha = mix(0.5, 1, coast);
    ctx.beginPath();
    ctx.arc(
      view.mapX + view.mapR * x,
      view.mapY - view.mapR * y,
      (view.mapR * data.cell * 0.66 * mix(0.44, 1, coast)) / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
