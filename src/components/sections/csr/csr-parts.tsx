import Image from "next/image";

import { Lines } from "@/components/ui/lines";
import type { csrImages } from "@/content/csr";
import { cn } from "@/lib/utils";

const IMAGE_SIZES = "(min-width: 1024px) 33vw, 100vw";

export function CsrCopy({
  paragraphs,
  className,
}: {
  paragraphs: readonly string[];
  className?: string;
}) {
  return (
    <div className="space-y-[1.34em]">
      {paragraphs.map((paragraph, i) => (
        <p key={i} data-animate="up" className={cn("company-copy", className)}>
          <Lines lines={[paragraph]} />
        </p>
      ))}
    </div>
  );
}

export function CsrPhoto({
  image,
  alt,
  className,
  imageClassName,
}: {
  image: (typeof csrImages)[keyof typeof csrImages];
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      data-animate="clip"
      data-reveal="slow"
      className={cn("isolate overflow-hidden rounded-[clamp(12px,1.1vw,20px)]", className)}
    >
      <Image
        {...image}
        alt={alt}
        sizes={IMAGE_SIZES}
        className={cn("h-auto w-full", imageClassName)}
      />
    </div>
  );
}
