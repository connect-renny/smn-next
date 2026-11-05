import { ArrowDown, ArrowUpRight, Mail, Mailbox, Phone, type LucideIcon } from "lucide-react";

import { AnimatedSection } from "@/components/animations/animated-section";
import { siteConfig } from "@/config/site";
import { headOffice } from "@/content/contact";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

import { ContactMap } from "./contact-map";
import { ContactMotion } from "./contact-motion";
import { PlantCards } from "./plant-cards";
import { Lines } from "@/components/ui/lines";

const OFFICE_ID = "head-office";
/** The config keeps the comp's double space for the footer; these read as plain numbers. */
const tidy = (text: string) => text.replace(/\s+/g, " ");

type ContactCardProps = {
  Icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  action: { label: string; href: string; icon?: LucideIcon; quiet?: boolean };
};

function ContactCard({ Icon, label, children, action }: ContactCardProps) {
  const ActionIcon = action.icon;
  return (
    <li data-contact-card className="contact-card">
      <span data-contact-icon className="contact-card-icon">
        <Icon aria-hidden className="size-[46%]" strokeWidth={1.9} />
      </span>
      <h2 className="contact-card-label">{label}</h2>
      <div className="contact-card-body">{children}</div>
      <a href={action.href} className="contact-card-action" data-quiet={action.quiet || undefined}>
        {action.label}
        {ActionIcon && <ActionIcon aria-hidden className="size-[1.1em]" />}
      </a>
    </li>
  );
}

export function ContactSection({
  dict,
  locale,
  id,
}: {
  dict: Dictionary;
  locale: Locale;
  id: string;
}) {
  const t = dict.contact;
  const { phone, fax, email, website } = siteConfig.contact;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="contact-page scroll-mt-(--header-h) bg-page-tint pb-[clamp(56px,6.2vw,120px)] text-about-ink"
    >
      <ContactMotion className="company-column grid gap-[clamp(40px,4.7vw,90px)]">
        {/* How to reach us: these float up over the hero */}
        <ul className="contact-cards">
          <ContactCard
            Icon={Phone}
            label={t.telephone}
            action={{ label: t.call, href: phone.href, icon: ArrowUpRight }}
          >
            <a href={phone.href} dir="ltr" className="contact-card-lead">
              {tidy(phone.display)}
            </a>
            <p>
              {t.fax}: <span dir="ltr">{tidy(fax.display)}</span>
            </p>
          </ContactCard>
          <ContactCard
            Icon={Mail}
            label={t.email}
            action={{ label: t.writeEmail, href: `mailto:${email}`, icon: ArrowUpRight }}
          >
            <a href={`mailto:${email}`} dir="ltr" className="contact-card-lead">
              {email}
            </a>
            <p>
              <a
                href={website.href}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="transition-colors hover:text-orange-dark"
              >
                {website.display}
              </a>
            </p>
          </ContactCard>
          <ContactCard
            Icon={Mailbox}
            label={t.postal}
            action={{ label: t.seeOffice, href: `#${OFFICE_ID}`, icon: ArrowDown, quiet: true }}
          >
            <p dir="auto" className="contact-card-lead">
              {t.postalLines[0]}
            </p>
            <p dir="auto">{t.postalLines[1]}</p>
          </ContactCard>
        </ul>

        {/* Where to find us */}
        <section id={OFFICE_ID} data-contact-office className="contact-office">
          <div className="contact-office-text">
            <h2 data-animate="up" className="contact-heading">
              {t.office.title}
            </h2>
            <dl className="contact-rows">
              {t.office.rows.map(({ label, value }) => (
                <div key={label} data-contact-row>
                  <dt>{label}</dt>
                  <dd dir="auto">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              data-contact-row
              href={headOffice.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-action justify-self-start"
            >
              {t.office.openMaps}
              <ArrowUpRight aria-hidden className="size-[1.1em] rtl:-scale-x-100" />
            </a>
          </div>
          <ContactMap copy={t} />
        </section>

        {/* The plants */}
        <section className="grid gap-[clamp(16px,1.5vw,28px)]">
          <h2 data-animate="up" className="contact-heading">
            <Lines lines={[t.plantsTitle]} />
          </h2>
          <PlantCards copy={t} locale={locale} />
        </section>
      </ContactMotion>
    </AnimatedSection>
  );
}
