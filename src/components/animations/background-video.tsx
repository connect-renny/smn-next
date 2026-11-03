"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Load straight away (above the fold) instead of when scrolled near. */
  eager?: boolean;
};

/**
 * Muted, looping decorative video.
 *  - Off-screen videos are not downloaded until they come near the viewport,
 *    and pause again when they leave it (saves data, battery and CPU).
 *  - Reduced-motion or Save-Data visitors get a still frame instead.
 */
export function BackgroundVideo({ src, poster, className, eager = false }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | undefined>(eager ? src : undefined);
  const still = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ??
      false;
    still.current = reduce || saveData;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSource(src);
          if (!still.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  // A freshly assigned source needs an explicit play() once it can start.
  useEffect(() => {
    const video = ref.current;
    if (!video || !source || still.current) return;
    video.play().catch(() => {});
  }, [source]);

  return (
    <video
      ref={ref}
      className={cn("size-full object-cover", className)}
      src={source}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : source ? "metadata" : "none"}
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
    />
  );
}
