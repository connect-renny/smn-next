type HeroPlayButtonProps = { label: string };

/**
 * "Play Video" is visual only for now — no player or popup is wired up.
 * It is hidden from assistive tech so nobody lands on a control that does nothing.
 */
export function HeroPlayButton({ label }: HeroPlayButtonProps) {
  return (
    <div
      aria-hidden
      data-hero-fade
      className="mt-[clamp(22px,5.4vh,60px)] inline-flex items-center gap-[clamp(12px,1.2vw,22px)] text-[clamp(10px,0.52vw,10px)] font-semibold tracking-[0.12em] text-white uppercase select-none max-lg:text-xs"
    >
      <span>{label}</span>
      <span className="play-circle">
        <svg viewBox="0 0 24 24" className="ms-0.5 size-[13px] fill-white rtl:-scale-x-100">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
  );
}
