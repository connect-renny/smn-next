import { Handshake, Scale, ShieldCheck, Users, type LucideIcon } from "lucide-react";

import { ethicsPrinciples, type EthicsPrincipleId } from "@/content/ethics";

export const principleIcons: Record<EthicsPrincipleId, LucideIcon> = {
  compliance: Scale,
  integrity: ShieldCheck,
  fairness: Handshake,
  respect: Users,
};

/** The site's droplet, tip at the centre, so that four of them make one flower. */
const PETAL = "M0 -5C-5 -20 -33 -36 -33 -62A33 33 0 1 1 33 -62C33 -36 5 -20 0 -5Z";
const PETAL_CENTRE = -62;
const ICON = 26;

type EthicsEmblemProps = {
  /** Keeps gradient ids unique when the emblem appears more than once on a page. */
  idPrefix: string;
  icons?: boolean;
  className?: string;
};

/** One petal per principle. Motion is applied from outside through the data attributes. */
export function EthicsEmblem({ idPrefix, icons = true, className }: EthicsEmblemProps) {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden className={className}>
      <defs>
        {ethicsPrinciples.map(({ id, colors }) => (
          <linearGradient
            key={id}
            id={`${idPrefix}-${id}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="-5"
            x2="0"
            y2="-95"
          >
            <stop offset="0" stopColor={colors[0]} />
            <stop offset="1" stopColor={colors[1]} />
          </linearGradient>
        ))}
      </defs>

      <g data-emblem-ring>
        <circle r="98.5" className="ethics-emblem-ring" pathLength={360} />
      </g>

      <g data-emblem-spin>
        {ethicsPrinciples.map(({ id }, i) => {
          const Icon = principleIcons[id];
          return (
            <g key={id} transform={`rotate(${i * 90})`}>
              <path d={PETAL} className="ethics-petal-base" />
              <path data-emblem-fill d={PETAL} fill={`url(#${idPrefix}-${id})`} />
              {icons && (
                <g transform={`translate(0 ${PETAL_CENTRE})`}>
                  <g data-emblem-icon transform={`rotate(${-i * 90})`}>
                    <Icon
                      x={-ICON / 2}
                      y={-ICON / 2}
                      width={ICON}
                      height={ICON}
                      strokeWidth={1.6}
                      className="text-white"
                    />
                  </g>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
