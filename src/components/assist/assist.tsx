"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Mic, X } from "lucide-react";

import { useGsapPresence } from "@/hooks/use-gsap-presence";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { createAssistSearch, type AssistEntry } from "./assist-search";
import { useSpeech } from "./use-speech";

export type AssistCopy = {
  title: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  listening: string;
  speak: string;
  open: string;
  close: string;
  more: string;
  less: string;
  resultsLabel: string;
  found: string;
  notFound: string;
  tags: string[];
  stopWords: string;
  softWords: string;
};

type AssistProps = {
  copy: AssistCopy;
  index: AssistEntry[];
  /** Entry offered when nothing matches (Contact). */
  fallbackId: string;
  speechLang: string;
};

const VISIBLE_TAGS = 4;
const ease = "power3.out";
const panelHidden = { opacity: 0, y: 14, scale: 0.96 };
const iconSwap =
  "[grid-area:1/1] transition-[opacity,rotate,scale] duration-300 motion-reduce:transition-none";

/**
 * Types the reply out character by character (instant for reduced motion).
 * `runId` restarts the effect even when the same reply text repeats.
 */
function useTypewriter(text: string, runId: number) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [typed, setTyped] = useState({ runId: -1, count: 0 });

  useEffect(() => {
    if (!text || reduce) return;
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setTyped({ runId, count });
      if (count >= text.length) window.clearInterval(timer);
    }, 14);
    return () => window.clearInterval(timer);
  }, [text, runId, reduce]);

  if (reduce) return text;
  return typed.runId === runId ? text.slice(0, typed.count) : "";
}

/**
 * "Ask SMN": floating mic launcher → a panel where visitors type, speak or pick
 * a topic and get matching sections back. Fully client-side; no API involved.
 */
export function Assist({ copy, index, fallbackId, speechLang }: AssistProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [result, setResult] = useState<{ reply: string; items: AssistEntry[]; run: number } | null>(
    null,
  );

  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const inputId = useId();

  const search = useMemo(
    () => createAssistSearch(index, copy.stopWords, copy.softWords),
    [index, copy],
  );
  const reply = useTypewriter(result?.reply ?? "", result?.run ?? 0);

  const [panelRef, panelMounted] = useGsapPresence<HTMLDivElement>(open, {
    enter: (el) =>
      gsap.fromTo(el, panelHidden, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease }),
    exit: (el) => gsap.to(el, { ...panelHidden, duration: 0.4, ease }),
  });

  // Extra topic chips rise in when "More" expands the list.
  useGSAP(
    () => {
      if (!expanded || prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-chip-extra]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease },
      );
    },
    { scope: root, dependencies: [expanded] },
  );

  // Each new set of results staggers in.
  useGSAP(
    () => {
      if (!result || prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-result]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease, stagger: 0.08 },
      );
    },
    { scope: root, dependencies: [result?.run] },
  );

  const run = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const found = search(text);
    const fallback = index.find((e) => e.id === fallbackId);
    setResult((prev) => ({
      reply: found.length ? copy.found : copy.notFound,
      items: found.length ? found : fallback ? [fallback] : [],
      run: (prev?.run ?? 0) + 1,
    }));
  };

  const speech = useSpeech(speechLang, (heard) => {
    setQuery(heard);
    run(heard);
  });

  const close = (restoreFocus = false) => {
    setOpen(false);
    speech.stop();
    if (restoreFocus) toggleRef.current?.focus();
  };

  // Escape + outside click close the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    const focus = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.clearTimeout(focus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `close` is stable in intent
  }, [open]);

  return (
    <div ref={root} className="fixed right-4 bottom-[calc(1rem+62px)] z-90">
      {panelMounted && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={copy.title}
          data-lenis-prevent
          className="assist-panel absolute right-0 bottom-[calc(100%+14px)] max-h-[min(600px,calc(100svh-200px))] w-[min(380px,calc(100vw-2rem))] origin-bottom-right overflow-y-auto overscroll-contain rounded-[18px] border border-white/16 px-4 pt-[18px] pb-5 text-white backdrop-blur-lg sm:px-[22px] sm:pt-[22px] sm:pb-6"
        >
          {/* Head */}
          <div className="mb-[18px] flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-[34px] shrink-0 place-items-center rounded-full bg-orange/16"
            >
              <svg viewBox="0 0 24 32" className="w-3 fill-orange">
                <path d="M12 1s10 13.6 10 20.1A10 10 0 0 1 2 21.1C2 14.6 12 1 12 1z" />
              </svg>
            </span>
            <div>
              <p className="text-[15px] leading-[1.2] font-semibold">{copy.title}</p>
              <p className="mt-0.5 text-xs text-white/62">{copy.subtitle}</p>
            </div>
          </div>

          {/* Field + mic */}
          <form
            autoComplete="off"
            className="flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(query);
            }}
          >
            <label htmlFor={inputId} className="sr-only">
              {copy.inputLabel}
            </label>
            <div className="assist-field relative min-w-0 flex-1">
              <input
                ref={input}
                id={inputId}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={speech.listening ? copy.listening : copy.placeholder}
                className="w-full border-0 border-b border-white/16 bg-transparent py-2.5 text-[15px] font-medium text-white caret-orange outline-none placeholder:font-normal placeholder:text-white/62 [&::-webkit-search-cancel-button]:hidden"
              />
              {speech.interim && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute start-0 top-1/2 max-w-full -translate-y-1/2 truncate text-[15px] text-white/62 italic"
                >
                  {speech.interim}
                </span>
              )}
            </div>
            {speech.supported && (
              <button
                type="button"
                aria-label={copy.speak}
                aria-pressed={speech.listening}
                data-listening={speech.listening}
                onClick={speech.toggle}
                className={cn(
                  "relative grid size-[46px] shrink-0 place-items-center rounded-full border border-white/16 transition-colors hover:border-orange",
                  speech.listening && "border-orange",
                )}
              >
                <span
                  aria-hidden
                  className="assist-mic-ring absolute inset-0 rounded-full border border-orange"
                />
                <span
                  aria-hidden
                  className="assist-mic-ring absolute inset-0 rounded-full border border-orange"
                />
                <span
                  aria-hidden
                  className={cn(
                    "relative z-1 grid size-[34px] place-items-center rounded-full bg-white/10 transition-colors",
                    speech.listening && "bg-orange",
                  )}
                >
                  <Mic className="size-4" strokeWidth={1.8} />
                </span>
              </button>
            )}
          </form>

          {/* Topic chips */}
          <ul className="mt-[18px] flex flex-wrap gap-2">
            {copy.tags.map((tag, i) =>
              i < VISIBLE_TAGS || expanded ? (
                <li key={tag} data-chip-extra={i >= VISIBLE_TAGS || undefined}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      run(tag);
                    }}
                    className="rounded-full border border-white/16 bg-white/7 px-[15px] py-2 text-[13px] leading-[1.2] font-medium transition-colors hover:border-orange hover:bg-orange/14"
                  >
                    {tag}
                  </button>
                </li>
              ) : null,
            )}
            <li>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
                className="rounded-full border border-dashed border-white/16 bg-white/7 px-[15px] py-2 text-[13px] leading-[1.2] font-medium text-orange transition-colors hover:border-orange hover:bg-orange/14"
              >
                {expanded ? copy.less : copy.more}
              </button>
            </li>
          </ul>

          {/* Results */}
          {result && (
            <div className="mt-5 border-t border-white/16 pt-[18px]">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
                {copy.resultsLabel}
              </p>
              <p aria-live="polite" className="mb-3.5 min-h-[1.5em] text-[13.5px] leading-[1.55]">
                {reply}
              </p>
              <ul key={result.run} className="flex flex-col gap-2">
                {result.items.map((item) => (
                  <li key={item.id} data-result>
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      className="assist-card relative block rounded-[10px] border border-transparent bg-white/7 py-[13px] ps-4 pe-11 text-white transition-colors hover:border-orange/55 hover:bg-white/11"
                    >
                      <span className="mb-1 block text-[11.5px] text-white/62">{item.path}</span>
                      <span className="block text-[14.5px] leading-[1.3] font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Launcher */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? copy.close : copy.open}
        onClick={() => (open ? close() : setOpen(true))}
        className="relative ms-auto grid size-[50px] place-items-center rounded-full"
      >
        <span
          aria-hidden
          className="assist-halo absolute inset-0 rounded-full bg-orange opacity-45"
        />
        <span
          aria-hidden
          className="assist-disc relative z-1 grid size-full place-items-center rounded-full text-white"
        >
          {/* Mic ⇄ close: both icons stay stacked and cross-fade with a turn. */}
          <span className={cn(iconSwap, open ? "scale-60 rotate-90 opacity-0" : "opacity-100")}>
            <Mic className="size-5" strokeWidth={1.8} />
          </span>
          <span className={cn(iconSwap, open ? "opacity-100" : "scale-60 -rotate-90 opacity-0")}>
            <X className="size-5" strokeWidth={1.8} />
          </span>
        </span>
      </button>
    </div>
  );
}
