import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, doctor } from "@/lib/content";
import { Kicker, Reveal, RevealItem } from "../ui/Reveal";

export function Contact() {
  const rows = [
    { icon: Phone, label: "মোবাইল", value: doctor.phone, href: doctor.phoneHref, en: true },
    { icon: Mail, label: "ইমেইল", value: doctor.email, href: `mailto:${doctor.email}`, en: true },
    { icon: MapPin, label: "চেম্বার", value: `${doctor.affiliation}, ${doctor.address}` },
    { icon: Clock, label: "সাক্ষাতের সময়", value: doctor.hours },
  ];
  return (
    <section id="contact" className="relative px-4 pb-16 pt-12 md:px-8 md:pb-24">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[var(--radius-panel)] border border-white/80 bg-[linear-gradient(180deg,#b5dbf2_0%,#dcf0fa_55%,#eef8fd_100%)] shadow-float">
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[440px] w-[440px] rounded-full bg-accent/25 blur-3xl" />
        <div className="relative grid gap-12 px-6 py-14 sm:px-10 lg:grid-cols-12 lg:px-14 lg:py-20">
          <Reveal className="lg:col-span-6">
            <RevealItem>
              <Kicker>{contact.kicker}</Kicker>
            </RevealItem>
            <RevealItem as="h2" className="display-bn mt-6 text-[clamp(2.2rem,4.6vw,4rem)] text-ink">
              {contact.title}
            </RevealItem>
            <RevealItem as="p" className="mt-5 max-w-lg text-[16px] leading-[1.85] text-ink-soft">
              {contact.text}
            </RevealItem>
            <RevealItem className="mt-8">
              <a
                href={doctor.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-deep"
              >
                <Phone className="h-4.5 w-4.5" /> অ্যাপয়েন্টমেন্টের জন্য কল করুন
              </a>
            </RevealItem>
          </Reveal>

          <Reveal stagger={0.08} className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:self-center">
            {rows.map(({ icon: Icon, label, value, href, en }) => (
              <RevealItem key={label} className="glass relative rounded-3xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-4 text-xs text-ink-soft">{label}</p>
                <p className={`mt-1 break-words font-semibold leading-snug text-ink ${en ? "font-en" : ""}`}>
                  {href ? (
                    <a href={href} className="after:absolute after:inset-0 hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>

      <footer className="mx-auto mt-10 flex max-w-[1360px] flex-col gap-4 px-2 text-sm text-ink-soft md:flex-row md:items-start md:justify-between">
        <p className="max-w-2xl leading-relaxed">{contact.disclaimer}</p>
        <p className="font-en shrink-0">
          © {new Date().getFullYear()} {doctor.nameEn}
        </p>
      </footer>
    </section>
  );
}
