import { cn } from "@/lib/utils";

/** The SMN droplet mark used beside every section eyebrow. */
export function Droplet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      aria-hidden
      className={cn("h-auto w-drop shrink-0 fill-orange", className)}
    >
      <path d="M12 1s10 13.6 10 20.1A10 10 0 0 1 2 21.1C2 14.6 12 1 12 1z" />
    </svg>
  );
}
