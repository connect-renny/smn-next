"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useMediaQuery, useSaveData } from "@/hooks/use-media-query";
import { onPageReady } from "@/lib/page-ready";
import { cn } from "@/lib/utils";

type HeroMediaProps = { video: string; poster: string };

/**
 * The poster is a real, priority-loaded <Image> (it is the LCP element); the
 * film fades in over it once it is actually playing. Reduced-motion and
 * Save-Data visitors keep the still.
 */
export function HeroMedia({ video, poster }: HeroMediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Server renders the still; the film is only attached in the browser.
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const saveData = useSaveData();
  const enabled = motionOk && !saveData;

  // Buffer behind the preloader, but only start the film once it has lifted,
  // so the opening frames aren't spent hidden under the overlay.
  useEffect(() => {
    if (!enabled) return;
    return onPageReady(() => ref.current?.play().catch(() => {}));
  }, [enabled]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        src={poster}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="size-full object-cover brightness-[0.78] saturate-[1.06]"
      />
      {enabled && (
        <video
          ref={ref}
          src={video}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={cn(
            "absolute inset-0 size-full object-cover brightness-[0.78] saturate-[1.06] transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
