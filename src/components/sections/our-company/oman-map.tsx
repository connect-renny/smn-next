import type { Dictionary } from "@/i18n/get-dictionary";

import { OmanMapStage } from "./oman-map-stage";

/** Where SMN operates: the scroll-driven dotted globe that lands on Oman. */
export function OmanMap({ dict }: { dict: Dictionary }) {
  const copy = dict.ourCompany.map;
  return (
    <section data-ql-ink="light" aria-label={copy.ariaLabel} className="relative">
      <OmanMapStage copy={copy} />
    </section>
  );
}
