import type { SocialNetwork } from "@/config/site";

/** Brand marks (Lucide no longer ships brand icons). */
const paths: Record<SocialNetwork, React.ReactNode> = {
  facebook: (
    <path
      fill="currentColor"
      d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .4 0 1 0 1.5.1a8.7 8.7 0 0 1 1.1.2V8a8.6 8.6 0 0 0-1.4 0c-.7 0-1.3.1-1.7.3a1.7 1.7 0 0 0-.7.6c-.2.4-.3 1-.3 1.8V12h3.9l-.4 2.1-.3 1.6h-3.2V24C19.4 23.2 24 18.2 24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
    </g>
  ),
  x: (
    <path
      fill="currentColor"
      d="M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.4h2L6.5 3.2H4.3Z"
    />
  ),
};

export function BrandIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      {paths[network]}
    </svg>
  );
}
