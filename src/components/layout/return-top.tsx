"use client";

import { useEffect, useRef, useState } from "react";

import { useSmoothScroll } from "@/components/animations/smooth-scroll-provider";
import { cn } from "@/lib/utils";

/**
 * Back-to-top with a scroll-progress ring: the rim fills orange as you read,
 * the face shows the percentage, and at the very bottom the number turns into
 * an up arrow. The ring is driven straight through a CSS variable, so scrolling
 * only re-renders when the whole-number percentage changes.
 */
export function ReturnTop({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ref.current?.style.setProperty("--scroll-progress", `${(progress * 100).toFixed(2)}%`);
      setPercent(Math.round(progress * 100));
      setVisible(window.scrollY >= 200);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const complete = percent >= 100;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollTo(0)}
      className={cn(
        // The rim: orange up to the scroll position, pale track after it.
        "group fixed right-4 bottom-4 z-60 grid aspect-square w-13 place-items-center rounded-full",
        "bg-[conic-gradient(var(--color-orange)_var(--scroll-progress,0%),rgb(255_255_255/0.92)_var(--scroll-progress,0%))]",
        "transition-[opacity,visibility,scale,translate] duration-350 ease-assist focus-visible:outline-offset-3",
        visible
          ? "visible opacity-100"
          : "pointer-events-none invisible translate-y-3 scale-60 opacity-0",
      )}
    >
      <span className="grid size-[calc(100%-4px)] place-items-center rounded-full bg-white text-navy shadow-[0_5px_15px_rgb(0_0_0/0.08)] transition-colors duration-300 group-hover:bg-orange group-hover:text-white">
        {complete ? (
          <svg
            viewBox="0 0 12 14"
            aria-hidden
            className="h-3.5 w-3 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M6 13.2V1.4M1.2 6.2 6 1.4l4.8 4.8" />
          </svg>
        ) : (
          <span aria-hidden dir="ltr" className="text-xs leading-none font-semibold tabular-nums">
            {percent}%
          </span>
        )}
      </span>
    </button>
  );
}
