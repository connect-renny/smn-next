import Image from "next/image";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { cn } from "@/lib/utils";

type ImageData = { src: string; width: number; height: number };

export type PlantDescriptionCopy = {
  eyebrow: string;
  title: string;
  imageAlt: string;
  diagramAlt: string;
  intro: readonly string[];
  details: readonly string[];
};

/** A `\n` in a paragraph is the comp's line break with no gap after it. */
function Copy({ paragraphs, className }: { paragraphs: readonly string[]; className?: string }) {
  return (
    <div className="space-y-[1.34em]">
      {paragraphs.map((paragraph, i) => (
        <p key={i} data-animate="up" className={cn("company-copy whitespace-pre-line", className)}>
          <Lines lines={[paragraph]} />
        </p>
      ))}
    </div>
  );
}

/** A plant's description: intro beside its photo, the process diagram, then the details. */
export function PlantDescription({
  copy: t,
  images,
  id,
  children,
}: {
  copy: PlantDescriptionCopy;
  images: { plant: ImageData; diagram: ImageData };
  id: string;
  /** Anything the page adds after the details. */
  children?: React.ReactNode;
}) {
  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white pt-[clamp(56px,5.4vw,104px)] pb-[clamp(64px,7.8vw,149px)] text-about-ink"
    >
      <div className="company-column">
        <div className="grid items-start gap-[clamp(32px,2.92vw,56px)] lg:grid-cols-[minmax(0,1fr)_min(27.4vw,525px)]">
          <div>
            <Eyebrow data-animate="up" className="text-eyebrow">
              {t.eyebrow}
            </Eyebrow>
            <h2
              data-animate="up"
              className="mt-[clamp(16px,1.3vw,25px)] text-page-title leading-[1.2] font-medium tracking-[-0.03em] lg:tracking-[-0.05em] rtl:leading-[1.4] rtl:tracking-normal"
            >
              <span dir="auto">{t.title}</span>
            </h2>
            <div className="mt-[clamp(20px,2.3vw,44px)] lg:max-w-[min(34.2vw,656px)]">
              <Copy paragraphs={t.intro} className="font-medium" />
            </div>
          </div>

          <div data-animate="clip" data-reveal="slow" className="lg:mt-[min(1.04vw,20px)]">
            <Image
              {...images.plant}
              alt={t.imageAlt}
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* The labels are inside the image: phones scroll it rather than shrink them away. */}
        <div data-animate="up" className="mt-[clamp(40px,3.1vw,60px)]">
          <div
            dir="ltr"
            tabIndex={0}
            role="group"
            aria-label={t.diagramAlt}
            className="overflow-x-auto"
          >
            <Image
              {...images.diagram}
              alt={t.diagramAlt}
              sizes="(min-width: 1024px) 54vw, 640px"
              className="mx-auto h-auto w-full max-w-[1022px] max-sm:w-[640px] max-sm:max-w-none lg:w-[53.2vw]"
            />
          </div>
        </div>

        {t.details.length > 0 && (
          <div className="mt-[clamp(40px,5.5vw,106px)]">
            <Copy paragraphs={t.details} />
          </div>
        )}

        {children}
      </div>
    </AnimatedSection>
  );
}
