"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPinned } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { contactPlants, siteMapEmbedUrl, siteMapViewerUrl, type PlantId } from "@/content/contact";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

type PlantCardsProps = { copy: Dictionary["contact"]; locale: Locale };

/** Lights up the plant on the map above; the attribute is read only by the stylesheet. */
const pointAt = (el: HTMLElement, plant: PlantId | null) => {
  const map = el.closest("[data-contact-root]")?.querySelector<HTMLElement>("[data-contact-map]");
  if (!map) return;
  if (plant) map.dataset.focus = plant;
  else delete map.dataset.focus;
};

export function PlantCards({ copy, locale }: PlantCardsProps) {
  const [open, setOpen] = useState<PlantId | null>(null);
  const plant = contactPlants.find((p) => p.id === open);

  return (
    <>
      <ul className="grid gap-[clamp(12px,1.25vw,24px)] md:grid-cols-2">
        {contactPlants.map(({ id, photo }) => (
          <li key={id} data-contact-plant>
            <button
              type="button"
              className="contact-plant"
              onClick={() => setOpen(id)}
              onPointerEnter={(e) => pointAt(e.currentTarget, id)}
              onPointerLeave={(e) => pointAt(e.currentTarget, null)}
              onFocus={(e) => pointAt(e.currentTarget, id)}
              onBlur={(e) => pointAt(e.currentTarget, null)}
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="(min-width: 48rem) 34vw, 100vw"
                className="contact-plant-photo object-cover"
              />
              <span className="contact-plant-text">
                <span className="contact-plant-title">{copy.plants[id]}</span>
                <span className="contact-plant-sub">{copy.viewMap}</span>
              </span>
              <span aria-hidden className="contact-plant-button">
                <MapPinned className="size-[46%]" strokeWidth={2} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!open} onOpenChange={(next) => !next && setOpen(null)}>
        {plant && (
          <DialogContent
            aria-describedby={undefined}
            closeLabel={copy.close}
            overlayClassName="z-1000 bg-black/50"
            className="contact-map-dialog z-1000 max-w-[min(94vw,1100px)]! sm:max-w-[min(94vw,1100px)]!"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pe-10">
              <DialogTitle className="text-lead font-semibold">{copy.plants[plant.id]}</DialogTitle>
              <a
                href={siteMapViewerUrl(plant.mapId, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-eyebrow text-orange underline-offset-4 hover:underline"
              >
                {copy.office.openMaps}
                <ArrowUpRight aria-hidden className="size-[1.15em] rtl:-scale-x-100" />
              </a>
            </div>
            {/* Google loads only once a visitor asks for the map. */}
            <iframe
              src={siteMapEmbedUrl(plant.mapId, locale)}
              title={copy.plants[plant.id]}
              loading="lazy"
              className="contact-map-frame"
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
