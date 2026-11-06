import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";

import { BoardExplorer, type ExplorerCopy, type ExplorerMember } from "./board-explorer";

/** The green leadership band, shared by the Board of Directors and Management pages. */
export function BoardMembers({
  copy,
  members,
  id,
}: {
  copy: ExplorerCopy & { eyebrow: string; title: string };
  members: readonly ExplorerMember[];
  id: string;
}) {
  return (
    <AnimatedSection
      id={id}
      ink="light"
      snap={false}
      className="board-band scroll-mt-(--header-h) pt-[clamp(56px,5.2vw,100px)] pb-[clamp(64px,10.9vw,210px)] text-white"
    >
      <div className="company-column">
        <div data-animate="up">
          <Eyebrow className="text-eyebrow-md">
            <span dir="auto">{copy.eyebrow}</span>
          </Eyebrow>
        </div>
        <h2
          data-animate="up"
          className="mt-[clamp(18px,1.9vw,36px)] text-page-title leading-[1.2] font-medium tracking-[-0.05em] rtl:tracking-normal"
        >
          {copy.title}
        </h2>

        <BoardExplorer copy={copy} members={members} />
      </div>
    </AnimatedSection>
  );
}
