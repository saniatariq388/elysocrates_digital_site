import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { getSiteSettings, getSocialLinks } from "@/lib/api";

export const metadata: Metadata = {
  title: "Links — Elysocrates Digital",
  description:
    "Social media, studio links and commission information for Elysocrates Digital.",
};

const buttonClass =
  "block rounded-md bg-panel px-6 py-4 text-center text-[13.5px] text-fg transition-colors duration-200 hover:bg-[#252525] hover:text-white";

async function LinksContent() {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);
  const text = (key: string) => settings[key] ?? "";
  const email = text("contact_email");

  return (
    <>
      {text("links_heading") && (
        <h1 className="text-center text-3xl font-semibold tracking-tight text-[#e6e6e6] md:text-[36px]">
          {text("links_heading")}
        </h1>
      )}

      {socialLinks.length > 0 && (
        <section
          aria-label={text("links_social_heading") || "Social media"}
          className="mt-14"
        >
          {text("links_social_heading") && (
            <h2 className="text-center text-lg font-semibold text-[#dedede]">
              {text("links_social_heading")}
            </h2>
          )}
          <ul className="mx-auto mt-6 flex max-w-2xl flex-col gap-3">
            {socialLinks.map((social) => (
              <li key={`${social.label}-${social.href}`}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr className="my-12 border-line" />

      <section aria-label={text("links_studio_heading") || "Studio"}>
        {text("links_studio_heading") && (
          <h2 className="text-center text-lg font-semibold text-[#dedede]">
            {text("links_studio_heading")}
          </h2>
        )}
        <ul className="mx-auto mt-6 flex max-w-2xl flex-col gap-3">
          {email && text("links_email_label") && (
            <li>
              <a href={`mailto:${email}`} className={buttonClass}>
                {text("links_email_label")}
              </a>
            </li>
          )}
          {email && text("links_commission_label") && (
            <li>
              <a
                href={`mailto:${email}?subject=Commission%20enquiry`}
                className={buttonClass}
              >
                {text("links_commission_label")}
              </a>
            </li>
          )}
          {text("links_newsletter_label") && (
            <li>
              <Link href="/newsletter" className={buttonClass}>
                {text("links_newsletter_label")}
              </Link>
            </li>
          )}
        </ul>
      </section>

      <hr className="my-12 border-line" />

      <section
        aria-label={text("links_questions_heading") || "Common Questions"}
        className="text-center"
      >
        {text("links_questions_heading") && (
          <h2 className="text-lg font-semibold text-[#dedede]">
            {text("links_questions_heading")}
          </h2>
        )}
        {text("links_questions_body") && (
          <p className="mx-auto mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted">
            {text("links_questions_body")}
          </p>
        )}
        {text("links_about_label") && (
          <div className="mx-auto mt-6 max-w-2xl">
            <Link href="/about" className={buttonClass}>
              {text("links_about_label")}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

function LinksSkeleton() {
  return <div aria-hidden className="min-h-[560px]" />;
}

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Suspense fallback={<LinksSkeleton />}>
        <LinksContent />
      </Suspense>
    </div>
  );
}
