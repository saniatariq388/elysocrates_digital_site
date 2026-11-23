import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { getSiteSettings } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image-url";

export const metadata: Metadata = {
  title: "About — Elysocrates Digital",
  description:
    "Elysocrates Digital is an independent concept art and illustration studio working across film, games and publishing.",
};

async function AboutContent() {
  const settings = await getSiteSettings();
  const text = (key: string) => settings[key] ?? "";
  const image = resolveImageUrl(text("about_image"));

  return (
    <div
      className={`grid gap-10 lg:gap-16 ${image ? "lg:grid-cols-[420px_1fr]" : "lg:grid-cols-1"}`}
    >
      {image && (
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden bg-panel">
            <Image
              src={image}
              alt={text("about_image_alt")}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
          {text("about_image_caption") && (
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-faint">
              {text("about_image_caption")}
            </figcaption>
          )}
        </figure>
      )}

      <div>
        {text("about_eyebrow") && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-faint">
            {text("about_eyebrow")}
          </p>
        )}
        {text("about_heading") && (
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#e6e6e6] md:text-[40px]">
            {text("about_heading")}
          </h1>
        )}
        {text("about_subheading") && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">
            {text("about_subheading")}
          </p>
        )}

        {text("about_bio_1") && (
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted">
            {text("about_bio_1")}
          </p>
        )}
        {text("about_bio_2") && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            {text("about_bio_2")}
          </p>
        )}
        {text("about_clients_note") && (
          <p className="mt-8 text-[12px] uppercase leading-relaxed tracking-[0.14em] text-faint">
            {text("about_clients_note")}
          </p>
        )}
      </div>
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div
      aria-hidden
      className="grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-16"
    >
      <div className="aspect-[4/3] bg-panel/40" />
      <div className="min-h-[320px]" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1560px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
      <Suspense fallback={<AboutSkeleton />}>
        <AboutContent />
      </Suspense>
    </div>
  );
}
