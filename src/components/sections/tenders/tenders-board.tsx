"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Clock, FileSpreadsheet, FileText, Plus } from "lucide-react";

import { Droplet } from "@/components/ui/droplet";
import { tenders, type Tender, type TenderId, type TenderStatus } from "@/content/tenders";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Copy = Dictionary["tenders"];
type Filter = "all" | TenderStatus;

const FILTERS: readonly Filter[] = ["all", "open", "closed"];
const STATUSES: readonly TenderStatus[] = ["open", "closed"];

const countOf = (filter: Filter) =>
  filter === "all" ? tenders.length : tenders.filter((t) => t.status === filter).length;

/** As in the client's reference: an open tender with a single file starts unfolded. */
const startsExpanded = (tender: Tender) =>
  tender.status === "open" && tender.documents.length === 1;

export function TendersBoard({ copy, locale }: { copy: Copy; locale: Locale }) {
  const scope = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const filtered = useRef(false);

  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<ReadonlySet<TenderId>>(
    () => new Set(tenders.filter(startsExpanded).map((t) => t.id)),
  );

  const toggle = (id: TenderId) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const pick = (next: Filter) => {
    filtered.current = true;
    setFilter(next);
  };

  // ─── Entrance: the filter panel slides in, then the cards rise one after another ───
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const rtl = document.documentElement.dir === "rtl";
        gsap.set(q("[data-tender-filters]"), { autoAlpha: 0, x: rtl ? 40 : -40 });
        gsap.set(q("[data-tender-reveal]"), { autoAlpha: 0, y: 36 });
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
          })
          .to(
            q("[data-tender-filters]"),
            { autoAlpha: 1, x: 0, duration: 1.1, clearProps: "all" },
            0,
          )
          .to(
            q("[data-tender-reveal]"),
            { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.08, clearProps: "all" },
            0.1,
          );
      });
      return () => mm.revert();
    },
    { scope },
  );

  // ─── Picking a filter deals the matching cards back in ───
  useGSAP(
    () => {
      if (!filtered.current || prefersReducedMotion()) return;
      gsap.from(gsap.utils.selector(list)("[data-tender-reveal]"), {
        autoAlpha: 0,
        y: 22,
        duration: 0.65,
        ease: "expo.out",
        stagger: 0.05,
        clearProps: "all",
      });
    },
    { scope: list, dependencies: [filter] },
  );

  return (
    <div
      ref={scope}
      className="company-column grid items-start gap-[clamp(24px,3.2vw,62px)] lg:grid-cols-[minmax(240px,3fr)_9fr]"
    >
      {/* The filter, doubling as the count of what's on the board */}
      <div
        data-tender-filters
        role="group"
        aria-label={copy.filterLabel}
        className="tender-filters"
      >
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            className="tender-filter"
            onClick={() => pick(item)}
          >
            <span dir="ltr" className="tender-filter-count">
              {String(countOf(item)).padStart(2, "0")}
            </span>
            <span className="tender-filter-label">
              {item === "open" && <span aria-hidden className="tender-pulse" />}
              {copy.filters[item]}
            </span>
          </button>
        ))}
      </div>

      {/* The tenders */}
      <div ref={list} className="min-w-0">
        {STATUSES.filter((status) => filter === "all" || filter === status).map((status) => (
          <section key={`${status}-${filter}`} className="tender-group">
            <h2 data-tender-reveal className="tender-group-title">
              <Droplet className={status === "closed" ? "opacity-40 grayscale" : undefined} />
              {copy.filters[status]}
              <span dir="ltr">{String(countOf(status)).padStart(2, "0")}</span>
            </h2>
            <ul className="grid gap-[clamp(10px,0.85vw,16px)]">
              {tenders.map((tender, i) =>
                tender.status === status ? (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    number={i + 1}
                    copy={copy}
                    locale={locale}
                    expanded={expanded.has(tender.id)}
                    onToggle={() => toggle(tender.id)}
                  />
                ) : null,
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

type TenderCardProps = {
  tender: Tender;
  number: number;
  copy: Copy;
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
};

function TenderCard({ tender, number, copy, locale, expanded, onToggle }: TenderCardProps) {
  const panelId = `tender-${tender.id}`;
  const count = tender.documents.length;
  const countLabel = (count === 1 ? copy.documentCountOne : copy.documentCountMany).replace(
    "{n}",
    String(count),
  );

  return (
    <li
      data-tender-reveal
      data-status={tender.status}
      data-open={expanded || undefined}
      className="tender-card"
    >
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          className="tender-head"
          onClick={onToggle}
        >
          <span dir="ltr" className="tender-number">
            {String(number).padStart(2, "0")}
          </span>
          <Droplet className="tender-drop" />
          <span className="min-w-0">
            <span className="tender-title">{copy.titles[tender.id]}</span>
            <span className="tender-meta">
              <span className="tender-status">
                {tender.status === "open" && <span aria-hidden className="tender-pulse" />}
                {copy.filters[tender.status]}
              </span>
              <span>{countLabel}</span>
            </span>
          </span>
          <span aria-hidden className="tender-toggle">
            <Plus className="size-1/2" strokeWidth={2.4} />
          </span>
        </button>
      </h3>

      <div id={panelId} className="tender-panel">
        <div className="tender-panel-inner">
          <div className="tender-body">
            {tender.hasDeadline && (
              <p className="tender-deadline">
                <Clock aria-hidden className="size-[1.25em] shrink-0" />
                {copy.sparePartsDeadline}
              </p>
            )}
            <ul className="tender-docs">
              {tender.documents.map((doc) => {
                const Icon = doc.type === "xlsx" ? FileSpreadsheet : FileText;
                return (
                  <li key={doc.label}>
                    <a
                      href={locale === "ar" && doc.hrefAr ? doc.hrefAr : doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tender-doc"
                      data-type={doc.type}
                    >
                      <span className="tender-doc-icon">
                        <Icon aria-hidden className="size-[1.3em]" strokeWidth={1.8} />
                        <b dir="ltr">{doc.type.toUpperCase()}</b>
                      </span>
                      <span className="min-w-0 flex-1">{copy.documents[doc.label]}</span>
                      <ArrowUpRight aria-hidden className="tender-doc-arrow rtl:-scale-x-100" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
