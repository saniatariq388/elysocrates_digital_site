import { Suspense } from "react";
import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Newsletter — Elysocrates Digital",
  description:
    "Subscribe to the Elysocrates Digital newsletter for new work and studio notes, a few times a year.",
};

async function NewsletterContent() {
  const settings = await getSiteSettings();
  const text = (key: string) => settings[key] ?? "";
  const email = text("contact_email");

  return (
    <>
      {text("newsletter_heading") && (
        <h1 className="text-3xl font-semibold tracking-tight text-[#e6e6e6] md:text-[36px]">
          {text("newsletter_heading")}
        </h1>
      )}
      {text("newsletter_body_1") && (
        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">
          {text("newsletter_body_1")}
        </p>
      )}
      {text("newsletter_body_2") && (
        <p className="mt-1 max-w-md text-[14px] leading-relaxed text-faint">
          {text("newsletter_body_2")}
        </p>
      )}

      {email && (
        <a
          href={`mailto:${email}?subject=Newsletter%20subscription`}
          className="mt-10 block w-full rounded-md bg-panel px-6 py-5 text-center text-[14px] text-fg transition-colors duration-200 hover:bg-[#252525] hover:text-white"
        >
          {text("newsletter_subscribe_label")}
        </a>
      )}

      {email && (
        <p className="mt-6 text-[12px] text-faint">
          Or write to{" "}
          <a
            href={`mailto:${email}`}
            className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {email}
          </a>
        </p>
      )}
    </>
  );
}

function NewsletterSkeleton() {
  return <div aria-hidden className="min-h-[360px]" />;
}

export default function NewsletterPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center md:py-32">
      <Suspense fallback={<NewsletterSkeleton />}>
        <NewsletterContent />
      </Suspense>
    </div>
  );
}
