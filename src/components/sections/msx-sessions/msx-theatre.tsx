"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { useSmoothScroll } from "@/components/animations/smooth-scroll-provider";
import { Droplet } from "@/components/ui/droplet";
import {
  formatRunningTime,
  msxSessions,
  msxSessionsByYear,
  vimeoEmbedUrl,
  type MsxSession,
  type MsxSessionId,
} from "@/content/msx-sessions";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Copy = Dictionary["msxSessions"];

const years = msxSessionsByYear();
const pad = (n: number) => String(n).padStart(2, "0");

/** A still sound wave for the poster; CSS keeps it moving. Fixed, so server and client agree. */
const WAVE = Array.from({ length: 64 }, (_, i) =>
  Math.round(14 + 72 * Math.abs(Math.sin(i * 0.47) * Math.cos(i * 0.17))),
);

/** The session theatre: one large player, with the years laid out on a timeline beneath it. */
export function MsxTheatre({ copy }: { copy: Copy }) {
  const scope = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const meta = useRef<HTMLDivElement>(null);
  const change = useRef<gsap.core.Timeline | null>(null);
  const changed = useRef(false);
  const { scrollTo } = useSmoothScroll();

  // `active` answers the click at once; the stage and its text swap behind the shutter.
  const [active, setActive] = useState<MsxSessionId>(msxSessions[0].id);
  const [shown, setShown] = useState<{ id: MsxSessionId; playing: boolean }>({
    id: msxSessions[0].id,
    playing: false,
  });

  const index = msxSessions.findIndex((s) => s.id === active);
  const session = msxSessions.find((s) => s.id === shown.id) as MsxSession;
  const yearIndex = years.findIndex((y) => y.year === msxSessions[index].year);
  const externalHref = "vimeo" in session.video ? session.video.href : session.video.file;

  // ─── Entrance: the stage opens out, then the timeline draws itself ───
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        gsap.set(q("[data-msx-frame]"), { clipPath: "inset(14% 18% round 14px)", autoAlpha: 0 });
        gsap.set(q("[data-msx-glow]"), { autoAlpha: 0 });
        gsap.set(meta.current, { autoAlpha: 0, y: 28 });
        gsap.set(q("[data-msx-axis]"), { autoAlpha: 0 });
        gsap.set(q("[data-msx-year]"), { autoAlpha: 0, y: 32 });

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: scope.current, start: "top 72%", once: true },
          })
          .to(
            q("[data-msx-frame]"),
            { clipPath: "inset(0% 0% round 14px)", autoAlpha: 1, duration: 1.4, clearProps: "all" },
            0,
          )
          .to(q("[data-msx-glow]"), { autoAlpha: 1, duration: 1.6, clearProps: "all" }, 0.3)
          .to(meta.current, { autoAlpha: 1, y: 0, duration: 1.1, clearProps: "all" }, 0.35)
          .to(q("[data-msx-axis]"), { autoAlpha: 1, duration: 0.8, clearProps: "all" }, 0.45)
          .to(
            q("[data-msx-year]"),
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, clearProps: "all" },
            0.5,
          );
      });
      return () => mm.revert();
    },
    { scope },
  );

  // ─── The text beside the stage rises in as each new session takes over ───
  useGSAP(
    () => {
      if (!changed.current || prefersReducedMotion()) return;
      gsap.from(gsap.utils.selector(meta)("[data-msx-rise]"), {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.06,
      });
    },
    { scope: meta, dependencies: [shown.id] },
  );

  // A change started from a click lives outside the hooks above, so it's stopped by hand.
  useEffect(() => () => void change.current?.kill(), []);

  // ─── More years than fit: track which way the timeline can still slide ───
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const travelled = Math.abs(el.scrollLeft);
      const room = el.scrollWidth - el.clientWidth;
      setEdges({ start: travelled > 2, end: travelled < room - 2 });
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  // ...and keep the chosen year in view, whichever control picked it.
  useEffect(() => {
    const el = track.current;
    const column = el?.querySelectorAll("[data-msx-year]")[yearIndex];
    if (!el || !column || el.scrollWidth <= el.clientWidth) return;
    const box = column.getBoundingClientRect();
    const view = el.getBoundingClientRect();
    if (box.left >= view.left && box.right <= view.right) return;
    el.scrollBy({
      left: box.left + box.width / 2 - (view.left + view.width / 2),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [yearIndex]);

  const bringStageIntoView = () => {
    const box = stage.current?.getBoundingClientRect();
    if (!box || !stage.current) return;
    const header = Number.parseFloat(getComputedStyle(stage.current).scrollMarginTop) || 0;
    if (box.top < header || box.bottom > window.innerHeight) {
      scrollTo(stage.current, { duration: 0.7 });
    }
  };

  const go = (id: MsxSessionId, play: boolean) => {
    if (id === active && (!play || shown.playing)) {
      if (play) bringStageIntoView();
      return;
    }
    changed.current = true;
    setActive(id);
    bringStageIntoView();

    const swap = () => setShown({ id, playing: play });
    if (prefersReducedMotion()) {
      swap();
      return;
    }

    change.current?.kill();
    const blades = gsap.utils.selector(stage)("[data-msx-blade]");
    const from = document.documentElement.dir === "rtl" ? 125 : -125;

    // Two brand-coloured blades cross the stage; the new session is there once they pass.
    change.current = gsap
      .timeline()
      .fromTo(
        blades,
        { xPercent: from },
        { xPercent: 0, duration: 0.42, ease: "power3.in", stagger: 0.06 },
      )
      .add(swap)
      .to(blades, { xPercent: -from, duration: 0.6, ease: "power3.out", stagger: 0.06 });
  };

  const step = (by: number) => {
    const next = msxSessions[index + by];
    if (next) go(next.id, shown.playing);
  };

  /** Moves the timeline by most of a screenful; -1 towards newer years, 1 towards older. */
  const slide = (direction: number) => {
    const el = track.current;
    if (!el) return;
    const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
    el.scrollBy({
      left: direction * rtl * el.clientWidth * 0.8,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  /** Column count and droplet position for the timeline; the sums are in the stylesheet. */
  const railStyle = {
    "--msx-years": years.length,
    "--msx-i": yearIndex,
  } as React.CSSProperties;

  return (
    <div ref={scope} className="msx-theatre-inner">
      <div className="msx-top">
        {/* The stage */}
        <div ref={stage} className="msx-stage" data-playing={shown.playing || undefined}>
          <div aria-hidden data-msx-glow className="msx-stage-glow" />
          <div data-msx-frame className="msx-stage-frame">
            {shown.playing ? (
              <SessionPlayer key={session.id} session={session} title={copy.sessions[session.id]} />
            ) : (
              <button
                type="button"
                className="msx-poster"
                aria-label={`${copy.play}: ${copy.sessions[session.id]}`}
                onClick={() => go(session.id, true)}
              >
                <span aria-hidden className="msx-poster-mark" />
                <span className="msx-poster-period">
                  <Droplet />
                  {copy.periods[session.period]}
                </span>
                <span className="msx-poster-year">
                  <span dir="ltr">{session.year}</span>
                </span>
                <span aria-hidden className="msx-poster-wave">
                  {WAVE.map((height, i) => (
                    <span
                      key={i}
                      style={{ height: `${height}%`, animationDelay: `${(i % 16) * -140}ms` }}
                    />
                  ))}
                </span>
                <span aria-hidden className="msx-poster-play">
                  <Play className="size-[38%] fill-current" strokeWidth={0} />
                </span>
              </button>
            )}
            <span aria-hidden data-msx-blade className="msx-blade msx-blade-orange" />
            <span aria-hidden data-msx-blade className="msx-blade msx-blade-green" />
          </div>
        </div>

        {/* What's on */}
        <div ref={meta} className="msx-meta">
          <div key={shown.id} className="grid justify-items-start">
            <p data-msx-rise className="msx-counter">
              <span dir="ltr">
                <b>{pad(msxSessions.findIndex((s) => s.id === shown.id) + 1)}</b>
                <span className="opacity-60"> / {pad(msxSessions.length)}</span>
              </span>
            </p>
            <h2 data-msx-rise className="msx-meta-title">
              <span dir="auto">{copy.sessions[session.id]}</span>
            </h2>
            <p data-msx-rise dir="ltr" className="msx-meta-time">
              {formatRunningTime(session.seconds)}
            </p>
            {!shown.playing && (
              <button
                type="button"
                data-msx-rise
                className="msx-play-button"
                onClick={() => go(session.id, true)}
              >
                <Play className="size-[1em] fill-current" strokeWidth={0} />
                {copy.play}
              </button>
            )}
            <a
              data-msx-rise
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="msx-open-link"
            >
              {copy.openVideo}
              <ArrowUpRight aria-hidden className="size-[1.15em] rtl:-scale-x-100" />
            </a>
          </div>

          <div className="msx-step">
            <button
              type="button"
              aria-label={copy.previous}
              disabled={index === 0}
              onClick={() => step(-1)}
            >
              <ChevronLeft aria-hidden className="size-1/2 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              disabled={index === msxSessions.length - 1}
              onClick={() => step(1)}
            >
              <ChevronRight aria-hidden className="size-1/2 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>

      {/* The timeline */}
      <div
        className="msx-rail"
        data-more-start={edges.start || undefined}
        data-more-end={edges.end || undefined}
      >
        {edges.start && (
          <button
            type="button"
            className="msx-rail-arrow msx-rail-arrow-start"
            aria-label={copy.newerYears}
            onClick={() => slide(-1)}
          >
            <ChevronLeft aria-hidden className="size-1/2 rtl:-scale-x-100" />
          </button>
        )}
        {edges.end && (
          <button
            type="button"
            className="msx-rail-arrow msx-rail-arrow-end"
            aria-label={copy.olderYears}
            onClick={() => slide(1)}
          >
            <ChevronRight aria-hidden className="size-1/2 rtl:-scale-x-100" />
          </button>
        )}
        <div ref={track} className="msx-rail-track">
          <div className="msx-rail-inner" style={railStyle}>
            <div aria-hidden data-msx-axis className="msx-axis">
              <span className="msx-axis-fill" />
              <span className="msx-axis-drop">
                <Droplet />
              </span>
            </div>
            <ul className="msx-years">
              {years.map(({ year, fullYear, h1 }) => (
                <li key={year} data-msx-year className="msx-year">
                  <p dir="ltr" className="msx-year-label">
                    {year}
                  </p>
                  {[fullYear, h1].map((item, slot) =>
                    item ? (
                      <button
                        key={item.id}
                        type="button"
                        className="msx-tile"
                        aria-pressed={item.id === active}
                        data-active={item.id === active || undefined}
                        data-playing={(item.id === shown.id && shown.playing) || undefined}
                        onClick={() => go(item.id, true)}
                      >
                        <span dir="auto" className="msx-tile-title">
                          {copy.sessions[item.id]}
                        </span>
                        <span dir="ltr" className="msx-tile-time">
                          {formatRunningTime(item.seconds)}
                        </span>
                        <span aria-hidden className="msx-tile-icon">
                          <Play className="msx-tile-play fill-current" strokeWidth={0} />
                          <span className="msx-tile-eq">
                            <i />
                            <i />
                            <i />
                          </span>
                        </span>
                      </button>
                    ) : (
                      <span key={slot} aria-hidden className="msx-tile-empty" />
                    ),
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionPlayer({ session, title }: { session: MsxSession; title: string }) {
  if ("vimeo" in session.video) {
    return (
      <iframe
        src={vimeoEmbedUrl(session.video.vimeo)}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="size-full border-0"
      />
    );
  }
  return (
    <video
      src={session.video.file}
      aria-label={title}
      controls
      autoPlay
      playsInline
      preload="metadata"
      className="size-full bg-black object-contain"
    />
  );
}
