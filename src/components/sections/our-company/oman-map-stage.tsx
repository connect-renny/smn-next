"use client";

import { useRef, useState } from "react";

import { omanPlaces, type OmanPlaceKind } from "@/content/our-company";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import {
  computeView,
  createGlobeRenderer,
  drawStaticMap,
  globeFrame,
  IDLE_UNTIL,
  MARKERS_AT,
  project,
  supportsWebGL,
  type GlobeData,
  type GlobeView,
} from "./oman-globe-renderer";
import { OmanMapIcon } from "./oman-map-icons";

const LEGEND: { kind: OmanPlaceKind; key: keyof Dictionary["ourCompany"]["map"]["legend"] }[] = [
  { kind: "desalination", key: "desalination" },
  { kind: "power", key: "power" },
  { kind: "capital", key: "capital" },
  { kind: "town", key: "willayah" },
];

const SIDE_CLASS = {
  // Long labels near the phone's right edge flip to the side with room.
  "end-or-start":
    "top-1/2 -translate-y-1/2 max-md:right-full max-md:mr-[0.55em] md:left-full md:ml-[0.55em]",
  "end-or-top":
    "max-md:right-0 max-md:bottom-full max-md:mb-[0.35em] md:top-1/2 md:left-full md:ml-[0.55em] md:-translate-y-1/2",
  top: "bottom-full left-1/2 mb-[0.35em] -translate-x-1/2",
  bottom: "top-full left-1/2 mt-[0.35em] -translate-x-1/2",
  "top-end": "bottom-[85%] left-[75%]",
} as const;

const IDLE_DEG_PER_SECOND = 5;
const MOUSE_NONE = -99999;
/** Where the scroll hint bows out: phones sooner, since the legend takes that corner. */
const HINT_UNTIL = { narrow: MARKERS_AT - 0.04, wide: 0.97 };

/**
 * The pinned world-to-Oman sequence. CSS `sticky` holds the stage (no pin spacer to
 * fight the smooth scroller) while scroll progress drives the camera; a little time-
 * based motion keeps the globe alive when the reader stops scrolling.
 */
export function OmanMapStage({ copy }: { copy: Dictionary["ourCompany"]["map"] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const lockRing = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const markers = useRef<HTMLDivElement>(null);
  const [isStatic, setStatic] = useState(false);
  const [focus, setFocus] = useState<OmanPlaceKind | null>(null);

  useGSAP(
    () => {
      const root = track.current;
      const stageEl = stage.current;
      const canvasEl = canvas.current;
      const markerLayer = markers.current;
      if (!root || !stageEl || !canvasEl || !markerLayer) return;

      let cancelled = false;
      let teardown: (() => void) | undefined;

      const headerHeight = () =>
        parseFloat(getComputedStyle(stageEl).getPropertyValue("--header-h")) || 80;

      /** Puts every marker where its coordinates land, sized in step with the map. */
      const placeMarkers = (data: GlobeData, view: GlobeView) => {
        const size = Math.min(26, Math.max(13, view.mapR * 0.0044));
        markerLayer.style.setProperty("--marker", `${size}px`);
        markerLayer.querySelectorAll<HTMLElement>("[data-lon]").forEach((el) => {
          const { x, y } = project(Number(el.dataset.lon), Number(el.dataset.lat), data.center);
          el.style.left = `${view.mapX + view.mapR * x}px`;
          el.style.top = `${view.mapY - view.mapR * y}px`;
        });
      };

      const showStatic = (data: GlobeData) => {
        setStatic(true);
        const layout = () => {
          const view = computeView(data, stageEl.clientWidth, stageEl.clientHeight, headerHeight());
          drawStaticMap(canvasEl, data, view);
          placeMarkers(data, view);
        };
        layout();
        const observer = new ResizeObserver(layout);
        observer.observe(stageEl);
        teardown = () => observer.disconnect();
      };

      const showAnimated = (data: GlobeData) => {
        const renderer = createGlobeRenderer(canvasEl, data);

        let view = computeView(data, stageEl.clientWidth, stageEl.clientHeight, headerHeight());
        const layout = () => {
          view = computeView(data, stageEl.clientWidth, stageEl.clientHeight, headerHeight());
          renderer.resize(view);
          placeMarkers(data, view);
        };
        layout();
        const resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(stageEl);

        // ─── Marker choreography: time-based, so it always finishes cleanly ───
        const icons = markerLayer.querySelectorAll("[data-marker-icon]");
        const labels = markerLayer.querySelectorAll("[data-marker-label]");
        const pulses = markerLayer.querySelectorAll("[data-marker-pulse]");
        const extras = stageEl.querySelectorAll("[data-map-extra]");
        const country = markerLayer.querySelector("[data-map-country]");
        const reveal = gsap
          .timeline({ paused: true })
          .fromTo(
            icons,
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.6)", stagger: 0.07 },
          )
          .fromTo(
            labels,
            { autoAlpha: 0, y: 7, filter: "blur(5px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.6,
              ease: "expo.out",
              stagger: 0.07,
            },
            0.14,
          )
          .fromTo(
            country,
            { autoAlpha: 0, letterSpacing: "0.3em" },
            { autoAlpha: 1, letterSpacing: "0.04em", duration: 1.3, ease: "expo.out" },
            0.5,
          )
          .fromTo(
            extras,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 },
            0.7,
          );
        // Everything inside is now hidden by the timeline, so the layer itself can show.
        gsap.set(markerLayer, { autoAlpha: 1 });

        // ─── Scroll input ───
        let target = 0;
        let revealTarget = 0;
        const pin = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => (target = self.progress),
          onRefresh: (self) => (target = self.progress),
        });
        const entrance = ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          end: "top 22%",
          onUpdate: (self) => (revealTarget = self.progress),
          onRefresh: (self) => (revealTarget = self.progress),
        });
        target = pin.progress;
        revealTarget = entrance.progress;
        let progress = target;
        let revealed = revealTarget;

        // ─── Pointer: the globe leans toward it, the dots swell beneath it ───
        let aimX = 0;
        let aimY = 0;
        let leanX = 0;
        let leanY = 0;
        let mouseX = MOUSE_NONE;
        let mouseY = MOUSE_NONE;
        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const box = stageEl.getBoundingClientRect();
          mouseX = event.clientX - box.left;
          mouseY = event.clientY - box.top;
          aimX = (mouseX / box.width) * 2 - 1;
          aimY = (mouseY / box.height) * 2 - 1;
        };
        const onLeave = () => {
          mouseX = MOUSE_NONE;
          mouseY = MOUSE_NONE;
          aimX = 0;
          aimY = 0;
        };
        stageEl.addEventListener("pointermove", onMove);
        stageEl.addEventListener("pointerleave", onLeave);

        // ─── Only draw while on screen ───
        let onScreen = true;
        const visibility = new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting;
        });
        visibility.observe(stageEl);

        let idle = 0;
        let time = 0;
        let waveStart = -1;
        let markersShown = false;

        const tick = (_: number, deltaMs: number) => {
          if (!onScreen) return;
          const dt = Math.min(deltaMs, 50) / 1000;
          time += dt;

          // A second smoothing stage, so touch and stepped wheels glide as well.
          const ease = 1 - Math.exp(-dt * 7);
          progress += (target - progress) * ease;
          revealed += (revealTarget - revealed) * ease;
          leanX += (aimX - leanX) * (1 - Math.exp(-dt * 3.5));
          leanY += (aimY - leanY) * (1 - Math.exp(-dt * 3.5));

          // Spins by itself until the approach to Oman begins; then scroll has sole charge.
          if (progress < IDLE_UNTIL) idle = (idle - dt * IDLE_DEG_PER_SECOND) % 360;

          const frame = globeFrame(progress, view, data, idle);
          const onGlobe = 1 - frame.dive;
          frame.lon += leanX * 9 * onGlobe;
          frame.lat -= leanY * 6 * onGlobe;

          const offsetX = leanX * -9 * frame.dive;
          const offsetY = leanY * -7 * frame.dive;

          const atMap = progress >= MARKERS_AT;
          if (atMap !== markersShown) {
            markersShown = atMap;
            if (atMap) {
              reveal.timeScale(1).play();
              // Outside the timeline: a ripple plays forwards only, never back in on itself.
              gsap.fromTo(
                pulses,
                { scale: 0.5, opacity: 0.9 },
                { scale: 3.2, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 },
              );
              waveStart = time;
            } else {
              reveal.timeScale(2.2).reverse();
            }
          }
          const waveAge = waveStart < 0 ? -1 : time - waveStart;
          if (waveAge > 2.4) waveStart = -1;

          renderer.draw(view, frame, {
            time,
            reveal: revealed,
            wave: waveAge,
            mouseX,
            mouseY,
            offsetX,
            offsetY,
          });

          markerLayer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

          if (halo.current) {
            // Sized against a 1000px element so nothing re-rasterises as it scales.
            const scale = (frame.r * 2.46) / 1000;
            halo.current.style.transform = `translate(${frame.x - 500}px, ${frame.y - 500}px) scale(${scale})`;
            halo.current.style.opacity = String(revealed * (1 - Math.min(1, frame.dive * 3.2)));
          }
          if (lockRing.current) {
            const size = frame.r * 0.3;
            lockRing.current.style.transform = `translate(${frame.x - size / 2}px, ${frame.y - size / 2}px)`;
            lockRing.current.style.width = `${size}px`;
            lockRing.current.style.height = `${size}px`;
            lockRing.current.style.opacity = String(frame.lock);
          }
          if (backdrop.current) backdrop.current.style.opacity = String(frame.backdrop);

          const hintUntil = view.width < 768 ? HINT_UNTIL.narrow : HINT_UNTIL.wide;
          scrollHint.current?.toggleAttribute("data-shown", revealed > 0.7 && progress < hintUntil);
        };
        gsap.ticker.add(tick);

        teardown = () => {
          gsap.ticker.remove(tick);
          resizeObserver.disconnect();
          visibility.disconnect();
          stageEl.removeEventListener("pointermove", onMove);
          stageEl.removeEventListener("pointerleave", onLeave);
          pin.kill();
          entrance.kill();
          reveal.kill();
          renderer.destroy();
        };
      };

      const start = async () => {
        // Sixty-odd KB of coordinates: fetched only as the reader approaches.
        const { default: data } = await import("@/content/oman-map-dots.json");
        if (cancelled) return;
        const animated = window.matchMedia(MOTION_OK).matches && supportsWebGL();
        if (animated) showAnimated(data as GlobeData);
        else showStatic(data as GlobeData);
      };

      const approach = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          approach.disconnect();
          void start();
        },
        { rootMargin: "150% 0px" },
      );
      approach.observe(root);

      return () => {
        cancelled = true;
        approach.disconnect();
        teardown?.();
      };
    },
    { scope: track },
  );

  return (
    <div
      ref={track}
      className={cn("relative h-[560svh] motion-reduce:h-auto", isStatic && "h-auto")}
    >
      <div
        ref={stage}
        dir="ltr"
        data-focus={focus ?? undefined}
        className={cn(
          "oman-stage top-0 h-svh min-h-[560px] overflow-hidden",
          isStatic ? "relative" : "sticky",
        )}
      >
        <div
          ref={backdrop}
          aria-hidden
          className={cn(
            "oman-stage-backdrop absolute inset-0 opacity-0",
            isStatic && "opacity-100",
          )}
        />
        <div
          ref={halo}
          aria-hidden
          className="oman-stage-halo pointer-events-none absolute top-0 left-0 size-[1000px] origin-center opacity-0"
        />
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        <div
          ref={lockRing}
          aria-hidden
          className="oman-lock pointer-events-none absolute top-0 left-0 opacity-0"
        >
          <span />
        </div>

        <div
          ref={markers}
          className={cn("oman-markers absolute inset-0", !isStatic && "invisible")}
        >
          <p
            data-lon="55.55"
            data-lat="20.75"
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span
              data-map-country
              dir="auto"
              className={cn(
                "oman-marker-label block text-[clamp(13px,1.45vw,27px)] font-medium tracking-[0.04em] whitespace-nowrap",
                !isStatic && "invisible",
              )}
            >
              {copy.country}
            </span>
          </p>

          <ul>
            {omanPlaces.map((place) => {
              const label = place.label ? copy.places[place.label] : null;
              return (
                <li
                  key={place.id}
                  data-lon={place.lon}
                  data-lat={place.lat}
                  data-kind={place.kind}
                  className="oman-marker absolute size-(--marker) -translate-x-1/2 -translate-y-1/2"
                >
                  <span data-marker-pulse aria-hidden className="oman-marker-pulse" />
                  <span data-marker-icon className="oman-marker-icon block size-full">
                    <OmanMapIcon kind={place.kind} />
                  </span>
                  {label && (
                    <span
                      data-marker-label
                      dir="auto"
                      className={cn(
                        "oman-marker-label absolute whitespace-nowrap",
                        place.capital && "font-semibold",
                        SIDE_CLASS[place.side],
                      )}
                    >
                      {label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div ref={scrollHint} aria-hidden className="oman-scroll-hint">
          <span dir="auto" className="oman-scroll-hint-text">
            {copy.keepScrolling}
          </span>
          <span className="oman-scroll-hint-line" />
        </div>

        <div className="absolute right-20 bottom-3 left-3.5 flex flex-col gap-2 md:right-[clamp(84px,6vw,115px)] md:bottom-[clamp(16px,3vw,48px)] md:left-auto md:w-[clamp(220px,15vw,288px)]">
          <ul
            data-map-extra
            className={cn(
              "oman-legend grid gap-y-1 rounded-[12px] px-3 py-2 md:gap-y-2 md:p-4",
              !isStatic && "invisible",
            )}
          >
            {LEGEND.map(({ kind, key }) => (
              <li
                key={kind}
                onPointerEnter={() => setFocus(kind)}
                onPointerLeave={() => setFocus(null)}
                className="flex cursor-default items-center gap-2.5 text-[clamp(11px,0.78vw,15px)] text-white/90"
              >
                <span className="size-[1.25em] shrink-0">
                  <OmanMapIcon kind={kind} />
                </span>
                <span dir="auto">{copy.legend[key]}</span>
              </li>
            ))}
          </ul>
          <p
            data-map-extra
            dir="auto"
            className={cn(
              "text-[clamp(9px,0.6vw,11.5px)] leading-snug text-white/65",
              !isStatic && "invisible",
            )}
          >
            {copy.note}
          </p>
        </div>
      </div>
    </div>
  );
}
