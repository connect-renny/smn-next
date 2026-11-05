"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { useSmoothScroll } from "@/components/animations/smooth-scroll-provider";
import { boardMembers, type BoardMemberId } from "@/content/board-of-directors";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const DESKTOP = "(min-width: 64rem)";
/** One source width for tile and panel, so the panel reuses the tile's loaded file. */
const PHOTO_SIZES = "(min-width: 64rem) 240px, 45vw";
/** How long the outgoing text takes to clear before the new text is swapped in. */
const TEXT_OUT = 0.2;
const FLIGHT = 0.8;

type Copy = Dictionary["boardOfDirectors"];

/** Two-column explorer: pick a tile and that portrait flies across into the bio panel. */
export function BoardExplorer({ copy }: { copy: Copy }) {
  const scope = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const change = useRef<gsap.core.Timeline | null>(null);
  const flying = useRef(false);
  const { scrollTo } = useSmoothScroll();

  const [selected, setSelected] = useState<BoardMemberId>(boardMembers[0].id);
  // `version` remounts the panel content, so re-picking mid-change never leaves it half-hidden.
  const [shown, setShown] = useState({ id: boardMembers[0].id, version: 0 });

  const member = copy.members[shown.id];
  const shownPhoto = boardMembers.find((m) => m.id === shown.id)!.photo;

  // ─── Entrance: tiles rise into place, each figure lifting out of its backdrop ───
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rtl = document.documentElement.dir === "rtl";
        const tiles = gsap.utils.toArray<HTMLElement>("[data-board-tile]");
        const figures = gsap.utils.toArray<HTMLElement>("[data-board-figure]");
        const names = gsap.utils.toArray<HTMLElement>("[data-board-name]");
        const stagger = { amount: 0.55, grid: "auto", from: "start" } as const;

        gsap.set(panel.current, { autoAlpha: 0, x: rtl ? 48 : -48 });
        gsap.set(tiles, { autoAlpha: 0, y: 48 });
        gsap.set(figures, { yPercent: 22, autoAlpha: 0 });
        gsap.set(names, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
        tl.to(panel.current, { autoAlpha: 1, x: 0, duration: 1.2, clearProps: "all" }, 0)
          .to(tiles, { autoAlpha: 1, y: 0, duration: 1, stagger, clearProps: "all" }, 0.05)
          .to(
            figures,
            { yPercent: 0, autoAlpha: 1, duration: 1.2, stagger, clearProps: "all" },
            0.2,
          )
          .to(names, { autoAlpha: 1, duration: 0.6, stagger, clearProps: "all" }, 0.5);
      });
      return () => mm.revert();
    },
    { scope },
  );

  // ─── New bio: name and role rise from their masks, then the copy follows ───
  useGSAP(
    () => {
      if (shown.version === 0 || prefersReducedMotion()) return;
      const root = panel.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      root.querySelector("[data-panel-body]")?.scrollTo({ top: 0 });
      if (flying.current) gsap.set(q("[data-panel-photo]"), { autoAlpha: 0 });
      else gsap.from(q("[data-panel-photo]"), { autoAlpha: 0, scale: 0.94, duration: 0.6 });

      gsap.from(q("[data-panel-line]"), {
        yPercent: 110,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.07,
      });
      gsap.from(q("[data-panel-fade]"), {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.12,
      });
    },
    { scope: panel, dependencies: [shown.version] },
  );

  // A change started from a click lives outside the hooks above, so it's stopped by hand.
  useEffect(() => () => void change.current?.kill(), []);

  const clearGhost = () => ghost.current?.replaceChildren();

  /** Sends a copy of the tile's portrait along an arc onto the panel's portrait. */
  const addFlight = (tl: gsap.core.Timeline, tile: HTMLElement) => {
    const from = tile.querySelector<HTMLElement>("[data-board-portrait]");
    const to = panel.current?.querySelector<HTMLElement>("[data-panel-portrait]");
    const el = ghost.current;
    if (!from || !to || !el) return;

    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    el.replaceChildren(from.cloneNode(true));
    gsap.set(el, {
      left: b.left,
      top: b.top,
      width: b.width,
      height: b.height,
      transformOrigin: "0 0",
      autoAlpha: 1,
      x: a.left - b.left,
      y: a.top - b.top,
      scale: a.width / b.width,
      rotation: 0,
    });
    flying.current = true;

    // x and y ease differently, which is what bends the straight line into an arc.
    tl.to(el, { x: 0, duration: FLIGHT, ease: "power2.inOut" }, 0)
      .to(el, { y: 0, duration: FLIGHT, ease: "power3.out" }, 0)
      .to(el, { scale: 1, duration: FLIGHT, ease: "power2.inOut" }, 0)
      .to(el, { rotation: a.left > b.left ? -5 : 5, duration: FLIGHT / 2, ease: "sine.out" }, 0)
      .to(el, { rotation: 0, duration: FLIGHT / 2, ease: "sine.in" }, FLIGHT / 2)
      .add(() => {
        flying.current = false;
        const root = panel.current;
        if (!root) return;
        gsap.set(root.querySelector("[data-panel-photo]"), { autoAlpha: 1 });
        gsap.set(el, { autoAlpha: 0 });
        clearGhost();
        gsap.fromTo(
          root.querySelector("[data-panel-ring]"),
          { autoAlpha: 1, scale: 1 },
          { autoAlpha: 0, scale: 1.12, duration: 0.7, ease: "power2.out" },
        );
      }, FLIGHT);
  };

  const select = (id: BoardMemberId, tile: HTMLElement) => {
    if (id === selected) return;
    setSelected(id);

    const desktop = window.matchMedia(DESKTOP).matches;
    // Below desktop the panel sits above the grid, so bring it back into view.
    if (!desktop && panel.current) scrollTo(panel.current, { duration: 0.8 });

    if (prefersReducedMotion()) {
      setShown((s) => ({ id, version: s.version + 1 }));
      return;
    }

    change.current?.kill();
    flying.current = false;
    clearGhost();

    const root = panel.current;
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline();
    change.current = tl;

    tl.to(
      [...q("[data-panel-line]"), ...q("[data-panel-fade]")],
      { autoAlpha: 0, y: -10, duration: TEXT_OUT, ease: "power2.in" },
      0,
    )
      .to(q("[data-panel-photo]"), { autoAlpha: 0, duration: TEXT_OUT, ease: "power1.in" }, 0)
      .add(() => setShown((s) => ({ id, version: s.version + 1 })), TEXT_OUT);

    if (desktop) addFlight(tl, tile);
  };

  /** Feeds the depth effect in CSS: -1…1 across the tile. */
  const onTilePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((event.clientX - box.left) / box.width) * 2 - 1));
    el.style.setProperty("--my", String(((event.clientY - box.top) / box.height) * 2 - 1));
  };

  const onTilePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--mx", "0");
    event.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <div
      ref={scope}
      className="mt-[clamp(28px,3.4vw,66px)] grid items-start gap-[clamp(20px,1.6vw,31px)] lg:grid-cols-[537fr_752fr]"
    >
      {/* The bio panel */}
      <div ref={panel} className="board-panel" aria-live="polite">
        <div className="flex items-start gap-[clamp(16px,1.15vw,22px)] max-sm:flex-col">
          <div data-panel-portrait className="board-portrait board-panel-portrait">
            <Image
              key={shown.version}
              data-panel-photo
              src={shownPhoto}
              alt={member.name}
              width={230}
              height={235}
              sizes={PHOTO_SIZES}
              className="size-full object-cover object-top"
            />
            <span aria-hidden data-panel-ring className="board-panel-ring" />
          </div>

          <div
            key={shown.version}
            className="min-w-0 pt-[clamp(0px,2.4vw,46px)] rtl:tracking-normal"
          >
            <h3 className="overflow-hidden text-[clamp(18px,1.08vw,20.7px)] leading-[1.3] font-medium tracking-[-0.01em]">
              <span data-panel-line dir="auto" className="block">
                {member.name}
              </span>
            </h3>
            {member.role && (
              <p className="mt-[0.35em] overflow-hidden text-[clamp(13px,0.85vw,16.3px)] leading-[1.3] font-medium uppercase">
                <span data-panel-line className="block">
                  {member.role}
                </span>
              </p>
            )}
          </div>
        </div>

        <div
          key={shown.version}
          data-panel-body
          data-lenis-prevent
          tabIndex={0}
          className="board-panel-body lg:tracking-[-0.05em] rtl:tracking-normal"
        >
          {member.experience ? (
            <>
              <p data-panel-fade className="font-medium">
                {copy.yearOfJoining} : <span dir="ltr">{member.year}</span>
              </p>
              <p data-panel-fade>
                {copy.education} : {member.education}
              </p>
              <p data-panel-fade className="font-medium">
                {copy.experience} :
              </p>
              <p data-panel-fade>{member.experience}</p>
            </>
          ) : (
            <p data-panel-fade>{copy.profilePending}</p>
          )}
        </div>
      </div>

      {/* The tiles */}
      <ul className="grid grid-cols-2 gap-[clamp(10px,0.74vw,14px)] sm:grid-cols-3">
        {boardMembers.map(({ id, photo }) => {
          const active = id === selected;
          return (
            <li key={id} data-board-tile>
              <button
                type="button"
                aria-pressed={active}
                data-active={active || undefined}
                className="board-tile"
                onClick={(event) => select(id, event.currentTarget)}
                onPointerMove={onTilePointerMove}
                onPointerLeave={onTilePointerLeave}
              >
                <span data-board-portrait className="board-portrait">
                  <span data-board-figure className="block size-full">
                    <Image
                      src={photo}
                      alt=""
                      width={230}
                      height={235}
                      sizes={PHOTO_SIZES}
                      className="board-tile-photo size-full object-cover object-top"
                    />
                  </span>
                </span>
                <span aria-hidden className="board-tile-check">
                  <Check className="size-[58%]" strokeWidth={3} />
                </span>
                <span
                  data-board-name
                  dir="auto"
                  className="block px-1 py-[clamp(12px,1.05vw,20px)] text-center text-[clamp(11px,0.625vw,12px)] leading-[1.25] font-semibold"
                >
                  {copy.members[id].name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Fixed so the flight can cross both columns; filled only while one is under way. */}
      <div ref={ghost} aria-hidden className="board-ghost" />
    </div>
  );
}
