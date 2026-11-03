"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registered once, on the client only.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && !window.matchMedia(MOTION_OK).matches;
}

export { gsap, ScrollTrigger, useGSAP };
