"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Header shell: overlays the hero, then docks as a navy bar after 80px. */
export function StickyHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const update = () => setStuck(window.scrollY >= 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header data-stuck={stuck} className={cn(className)}>
      {children}
    </header>
  );
}
