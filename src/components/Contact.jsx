import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { sound } from "../lib/sound";
import { profile } from "../data/site";
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  GithubIcon,
  LinkedinIcon,
} from "./Icons";
import { Spider, WebCorner, WebDrape, WebOrb } from "./WebDecor";

/* Email and these three are the only ways in. No phone number on a public
   page, and no form: a mailto reaches the same inbox without a third-party
   relay in between. */
const links = [
  {
    label: "GitHub",
    value: "Divyansh3105",
    href: profile.github,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    value: "divyanshgarg3105",
    href: profile.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "Résumé",
    value: "View PDF",
    href: profile.resume,
    icon: FileIcon,
  },
];

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      sound.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      // Clipboard blocked (insecure context, denied permission). The address
      // is right there in the label, so there is nothing to recover from.
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.from(".contact-eyebrow", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          ".contact-line",
          {
            clipPath: "inset(0 0 105% 0)",
            yPercent: 16,
            duration: 1.05,
            stagger: 0.12,
            ease: "expo.out",
          },
          "-=0.3",
        )
        .from(".contact-mail", { y: 26, opacity: 0, duration: 0.9 }, "-=0.55")
        .from(
          ".contact-link",
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.7",
        )
        .from(
          ".contact-drape",
          { yPercent: -100, opacity: 0, duration: 1.5, ease: "expo.out" },
          "-=1.2",
        )
        .from(
          ".contact-foot",
          { opacity: 0, duration: 0.8, stagger: 0.06 },
          "-=0.8",
        );

      if (reduced) tl.progress(1);

      if (!reduced) {
        gsap.to(".contact-orb", {
          rotation: 360,
          duration: 240,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
        gsap.to(".contact-spider", {
          y: 12,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={root}
      className="relative overflow-hidden bg-ink pt-24 pb-10 text-paper md:pt-36"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <WebDrape
          width={1400}
          depth={200}
          strands={19}
          className="contact-drape absolute inset-x-0 top-0 h-[13rem] w-full text-blood/35"
        />
        <div className="absolute -left-[18%] -bottom-[28%]">
          <WebOrb
            size={720}
            spokes={18}
            rings={10}
            className="contact-orb block text-paper/8"
          />
        </div>
        <WebCorner
          corner="br"
          size={320}
          className="!-right-10 !-bottom-10 text-blood/25"
        />
      </div>

      <div className="relative mx-auto max-w-[112rem] px-5 sm:px-8">
        <p className="contact-eyebrow label-mono mb-8 flex items-center gap-3 text-blood-soft">
          <Spider size={16} withDragline className="contact-spider" />
          <span>Contact</span>
          <span className="h-px w-14 bg-blood-soft/35" />
          <span className="text-paper/40">05</span>
        </p>

        <h2 className="display-tight text-[clamp(2.8rem,11vw,10rem)]">
          <span className="contact-line block">Let&apos;s build</span>
          <span className="contact-line block italic text-blood-soft">
            something.
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <p className="max-w-md text-[0.98rem] leading-[1.75] text-paper/60">
            I&apos;m looking for a team where I can ship real product from day
            one — internships or entry-level engineering roles. Freelance and
            collaboration are open too. Email is the fastest way to reach me; I
            usually reply within a day.
          </p>

          <div>
            <div className="contact-mail">
              <p className="label-mono mb-3 text-paper/40">Direct</p>
              <div className="flex flex-wrap items-center gap-3 border-b border-paper/20 pb-4">
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => sound.click()}
                  onMouseEnter={() => sound.hover()}
                  className="text-[clamp(1rem,2.4vw,1.6rem)] font-medium tracking-tight transition-colors duration-400 hover:text-blood-soft"
                >
                  {profile.email}
                </a>

                <button
                  type="button"
                  onClick={copyEmail}
                  onMouseEnter={() => sound.hover()}
                  className="label-mono ml-auto flex items-center gap-2 border border-paper/25 px-3.5 py-2 text-paper/75 transition-colors duration-300 hover:border-blood-soft hover:text-blood-soft"
                >
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
              {links.map((link) => {
                const LinkIcon = link.icon;
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label} className="contact-link">
                    <p className="label-mono mb-2 text-paper/40">
                      {link.label}
                    </p>
                    <a
                      href={link.href}
                      target={
                        external || link.href.endsWith(".pdf")
                          ? "_blank"
                          : undefined
                      }
                      rel={external ? "noreferrer" : undefined}
                      onClick={() => sound.click()}
                      onMouseEnter={() => sound.hover()}
                      className="group inline-flex items-center gap-2.5 text-[0.95rem] text-paper/85 transition-colors duration-300 hover:text-blood-soft"
                    >
                      <LinkIcon size={15} />
                      {link.value}
                      <span className="h-px w-0 bg-blood-soft transition-[width] duration-400 ease-web group-hover:w-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="contact-foot label-mono text-paper/40">
            &copy; {new Date().getFullYear()} {profile.first} {profile.last}
          </p>
          <p className="contact-foot label-mono text-paper/40">
            {profile.location}
          </p>
          <a
            href="#top"
            onClick={() => sound.click()}
            className="contact-foot label-mono text-paper/60 transition-colors duration-300 hover:text-blood-soft"
          >
            Back to top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
