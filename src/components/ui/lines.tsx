import { Fragment } from "react";

/** Renders `**word**` as <strong>, everything else as text. */
function Emphasis({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

type LinesProps = {
  lines: readonly string[];
  /**
   * Where the comp's hard line breaks apply. Below it the copy wraps
   * naturally — fixed breaks would leave ragged lines on a phone.
   */
  breakFrom?: "always" | "md" | "lg";
};

const breakClass = { always: "", md: "max-md:hidden", lg: "max-lg:hidden" } as const;

/**
 * The copy sits in an inline `dir="auto"` run so it reads in its own
 * direction: English left in the Arabic site keeps its word order and
 * full stops while the block keeps the page's alignment.
 */
export function Lines({ lines, breakFrom = "lg" }: LinesProps) {
  return (
    <span dir="auto">
      {lines.map((line, i) => (
        <Fragment key={i}>
          <Emphasis text={line} />
          {i < lines.length - 1 && (
            <>
              {" "}
              <br className={breakClass[breakFrom]} />
            </>
          )}
        </Fragment>
      ))}
    </span>
  );
}
