import { Globe, Mail, Phone } from "lucide-react";

export type DrawerContact = {
  labels: { officeTel: string; fax: string; email: string };
  phone: { display: string; href: string };
  fax: string;
  email: string;
  website: { display: string; href: string };
};

type ContactCardProps = { title: string; contact: DrawerContact; opensInNewTab: string };

/** "Get in touch" card in the 4-dot drawer, in the designer's wording. */
export function ContactCard({ title, contact, opensInNewTab }: ContactCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-footer-bg px-6 py-7 text-white">
      {/* Brand droplet, as in the footer. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-14 -top-6 aspect-[512/700] w-40 bg-linear-to-b from-report to-footer-bg opacity-80 [mask:url(/images/brand/footer-droplet.png)_center/100%_100%_no-repeat] rtl:-scale-x-100"
      />
      <div className="relative">
        <p className="mb-3 text-[11px] font-semibold tracking-widest text-white/80 uppercase">
          {title}
        </p>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-start gap-2.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden />
            <span>
              {contact.labels.officeTel}{" "}
              <a href={contact.phone.href} dir="ltr" className="hover:text-orange">
                {contact.phone.display}
              </a>
              , {contact.labels.fax} <span dir="ltr">{contact.fax}</span>
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="size-4 shrink-0 text-orange" aria-hidden />
            <span>
              {contact.labels.email}{" "}
              <a href={`mailto:${contact.email}`} className="hover:text-orange">
                {contact.email}
              </a>
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <Globe className="size-4 shrink-0 text-orange" aria-hidden />
            <a
              href={contact.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange"
            >
              {contact.website.display}
              <span className="sr-only"> {opensInNewTab}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
