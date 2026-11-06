/** A printed book in CSS 3D: the cover, spine, page block and back of one report. */
export function ReportBook({
  year,
  spineTone,
  children,
}: {
  year: string;
  spineTone?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="report-book">
      <span className="report-book-body">
        <span className="report-book-back" style={{ background: spineTone }} />
        <span className="report-book-pages" />
        <span className="report-book-spine" style={{ background: spineTone }}>
          <span dir="ltr">{year}</span>
        </span>
        <span className="report-book-front">{children}</span>
      </span>
    </span>
  );
}
