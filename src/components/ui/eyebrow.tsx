import { cn } from "@/lib/utils";

import { Droplet } from "./droplet";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * "inline": droplet + words side by side (About, Shareholders, Media).
   * "hanging": words centre on the page, the droplet hangs off their start
   *            edge without taking part in the centring (Leadership, Links).
   */
  variant?: "inline" | "hanging";
} & Omit<React.ComponentProps<"p">, "children">;

export function Eyebrow({ children, className, variant = "inline", ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "m-0 items-center font-semibold uppercase",
        variant === "inline" ? "flex gap-eyebrow" : "relative inline-flex",
        className,
      )}
      {...props}
    >
      <Droplet className={variant === "hanging" ? "absolute end-full me-eyebrow" : undefined} />
      <span>{children}</span>
    </p>
  );
}
