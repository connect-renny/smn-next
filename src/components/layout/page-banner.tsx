import Image from "next/image";

import { heroMedia } from "@/content/home";
import { Eyebrow } from "@/components/ui/eyebrow";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

/** Navy banner for inner pages: the hero still under the same scrim language. */
export function PageBanner({ eyebrow, title, children }: PageBannerProps) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-navy-deep pt-(--header-h) text-white">
      <Image
        src={heroMedia.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover brightness-[0.6]"
      />
      <span aria-hidden className="hero-scrim absolute inset-0 -z-10" />

      <div className="site-container w-full pt-16 pb-16 lg:pb-24">
        <div className="max-w-3xl lg:ps-[clamp(0px,2.8vw,52px)]">
          <Eyebrow className="text-eyebrow-md tracking-[0.06em]">{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-sh-title leading-[1.1] font-medium tracking-[-0.01em] text-balance">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}
