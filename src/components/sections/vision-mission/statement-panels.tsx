"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { statementOrder, visionMissionImage, type StatementId } from "@/content/vision-mission";
import type { Dictionary } from "@/i18n/get-dictionary";

const number = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The photo beside two statement panels, after the designer's reference. Only the
 * headings show until a panel opens; the first starts open. Hovering, focusing or
 * tapping a panel opens it and folds the other, and the last one opened stays open,
 * so moving the pointer away never collapses the row. The photo eases in a little
 * closer for each statement and its caption follows the open panel.
 */
export function StatementPanels({ copy }: { copy: Dictionary["visionMission"] }) {
  const [active, setActive] = useState<StatementId>(statementOrder[0]);
  const baseId = useId();
  const activeIndex = statementOrder.indexOf(active);

  return (
    <div className="vm-stage" data-active={activeIndex}>
      <div data-animate="clip" data-reveal="slow" className="vm-photo">
        <div className="vm-photo-zoom">
          <Image
            {...visionMissionImage}
            alt={copy.imageAlt}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="vm-photo-img"
          />
        </div>
        <div className="vm-photo-shade" aria-hidden />
        <div className="vm-photo-caption" aria-hidden>
          <span className="vm-photo-count">
            <span className="vm-photo-reel">
              {statementOrder.map((id, i) => (
                <span key={id}>{number(i)}</span>
              ))}
            </span>
            <span className="vm-photo-total">/ {number(statementOrder.length - 1)}</span>
          </span>
          <span className="vm-photo-titles">
            {statementOrder.map((id) => (
              <span key={id} data-on={id === active ? "" : undefined}>
                {copy.statements[id].title}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="vm-list">
        {statementOrder.map((id, i) => {
          const statement = copy.statements[id];
          const open = id === active;
          const bodyId = `${baseId}-${id}`;
          return (
            <article
              key={id}
              data-animate="up"
              className="vm-panel"
              data-open={open ? "" : undefined}
              onClick={() => setActive(id)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(id);
              }}
            >
              <span className="vm-glow" aria-hidden />
              <span className="vm-num" aria-hidden>
                {number(i)}
              </span>
              <div className="vm-main">
                <h2 className="vm-heading">
                  <button
                    type="button"
                    className="vm-trigger"
                    aria-expanded={open}
                    aria-controls={bodyId}
                    onClick={() => setActive(id)}
                    onFocus={() => setActive(id)}
                  >
                    <span dir="auto">{statement.title}</span>
                    <span className="vm-icon" aria-hidden />
                  </button>
                </h2>
                <div id={bodyId} className="vm-body" inert={!open}>
                  <div className="vm-body-clip">
                    <span className="vm-rule" aria-hidden />
                    <p className="vm-text" dir="auto">
                      {statement.text}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
