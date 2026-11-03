"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type QuickLinksProps = {
  label: string;
  links: { id: string; label: string }[];
};

/**
 * Pinned rail of section shortcuts. Its ink and current marker follow
 * whichever section sits behind it, sampled at the rail's own height so the
 * swap lands as the rail crosses the seam. It fades out once the footer
 * reaches it, so the two never overlap. Desktop only.
 */
export function QuickLinks({ label, links }: QuickLinksProps) {
  const [ink, setInk] = useState<"light" | "dark">("light");
  const [current, setCurrent] = useState("");
  const [overFooter, setOverFooter] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const probe = window.innerHeight * 0.52;
      let nextInk: "light" | "dark" = "light";
      let nextId = "";
      document
        .querySelectorAll<HTMLElement>("main [data-ql-ink], footer[data-snap]")
        .forEach((section) => {
          const box = section.getBoundingClientRect();
          if (box.top <= probe && box.bottom > probe) {
            nextInk = (section.dataset.qlInk as "light" | "dark") ?? "light";
            nextId = section.id;
          }
        });
      setInk(nextInk);
      setCurrent(nextId);

      const footer = document.querySelector("footer");
      const rail = ref.current?.getBoundingClientRect();
      setOverFooter(!!footer && !!rail && footer.getBoundingClientRect().top < rail.bottom);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      ref={ref}
      aria-label={label}
      aria-hidden={overFooter || undefined}
      inert={overFooter}
      className={cn(
        "quicklinks fixed start-[clamp(14px,1vw,20px)] top-[52%] z-50 -translate-y-1/2 transition-[opacity,visibility] duration-400 max-lg:hidden",
        overFooter && "invisible opacity-0",
      )}
      data-ink={ink}
    >
      <ul className="flex flex-col gap-[clamp(14px,2.4vh,26px)]">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              aria-current={current === link.id ? "true" : undefined}
              className="text-micro font-medium tracking-[0.035em] whitespace-nowrap uppercase"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
