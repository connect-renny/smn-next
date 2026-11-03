"use client";

import { useRef } from "react";

import { useScrollAnimations } from "@/hooks/use-scroll-animations";

type AnimatedSectionProps = React.ComponentProps<"section"> & {
  /** Ink the quick-link rail should use over this section. */
  ink?: "light" | "dark";
  /** Participates in the desktop settle-snap. */
  snap?: boolean;
};

/**
 * A <section> that wires up the declarative scroll animations for its
 * children. Children stay Server Components — only this shell is client-side.
 */
export function AnimatedSection({
  ink = "light",
  snap = true,
  children,
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollAnimations(ref);

  return (
    <section ref={ref} data-ql-ink={ink} data-snap={snap ? "" : undefined} {...props}>
      {children}
    </section>
  );
}
