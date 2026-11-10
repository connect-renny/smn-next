import Image from "next/image";

import { Lines } from "@/components/ui/lines";

export type PlantStat = { key: string; icon: string };
export type PlantStatCopy = { label: string; value: string; sub: string };

/** A plant hero's icon stats, split by thin rules from the 1920 comp; stacked on phones. */
export function PlantStats({
  stats,
  copy,
}: {
  stats: readonly PlantStat[];
  copy: Record<string, PlantStatCopy>;
}) {
  return (
    <ul className="mt-[clamp(32px,3.5vw,67px)] flex tracking-[-0.045em] max-sm:flex-col max-sm:gap-6 rtl:tracking-normal">
      {stats.map(({ key, icon }) => (
        <li
          key={key}
          data-hero-fade
          className="plant-stat border-white/35 not-first:border-s max-sm:not-first:border-s-0 max-sm:not-first:border-t max-sm:not-first:pt-6 sm:pe-[clamp(16px,3.6vw,69px)] sm:not-first:ps-[clamp(16px,1.95vw,37px)]"
        >
          <Image
            src={icon}
            alt=""
            width={90}
            height={90}
            className="plant-stat-icon size-[clamp(60px,4.69vw,90px)] object-contain"
          />
          <p className="mt-[clamp(14px,1.4vw,27px)] text-[clamp(14px,1.04vw,20px)] leading-[1.3]">
            <Lines lines={[copy[key].label]} />
          </p>
          <p className="text-hero-fact leading-[1.25] font-semibold whitespace-nowrap">
            <Lines lines={[copy[key].value]} />
          </p>
          <p className="text-[clamp(14px,1.04vw,20px)] leading-[1.3] font-medium">
            <Lines lines={[copy[key].sub]} />
          </p>
        </li>
      ))}
    </ul>
  );
}
