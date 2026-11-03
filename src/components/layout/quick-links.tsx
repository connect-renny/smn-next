"use client";

import { useEffect, useState } from "react";

type QuickLinksProps = {
  label: string;
  links: { id: string; label: string }[];
};

/**
 * Pinned rail of section shortcuts. Its ink and current marker follow
 * whichever section sits behind it, sampled at the rail's own height so the
 * swap lands as the rail crosses the seam. Desktop only.
 */
export function QuickLinks({ label, links }: QuickLinksProps) {
  const [ink, setInk] = useState<"light" | "dark">("light");
  const [current, setCurrent] = useState("");

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
      aria-label={label}
      className="quicklinks fixed start-[clamp(14px,1vw,20px)] top-[52%] z-50 -translate-y-1/2 max-lg:hidden"
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
