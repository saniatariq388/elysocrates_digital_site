import Image from "next/image";
import Link from "next/link";

import { resolveImageUrl } from "@/lib/image-url";

export function Hero({ settings }: { settings: Record<string, string> }) {
  const text = (key: string) => settings[key] ?? "";
  const image = resolveImageUrl(text("hero_image"));

  return (
    <section className="grid border-b border-line lg:h-[calc(100svh-86px)] lg:max-h-[820px] lg:min-h-[520px] lg:grid-cols-[1.15fr_0.85fr]">
      {image && (
        <div className="relative h-[380px] overflow-hidden md:h-[460px] lg:h-auto">
          <Image
            src={image}
            alt={text("hero_image_alt")}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          {text("hero_caption") && (
            <p className="absolute inset-x-0 bottom-0 px-5 pb-6 text-[11px] uppercase tracking-[0.2em] text-white/70 md:px-8 lg:px-10">
              {text("hero_caption")}
            </p>
          )}
        </div>
      )}

      <div
        id="brand"
        className={`flex flex-col justify-center border-t border-line bg-[#131313] px-5 py-14 md:px-8 md:py-16 lg:border-l lg:border-t-0 lg:px-12 xl:px-16 ${image ? "" : "lg:col-span-2"}`}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center bg-accent text-lg font-black leading-none tracking-tighter text-ink"
          >
            ED
          </span>
          {text("hero_eyebrow") && (
            <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.3em] text-muted">
              {text("hero_eyebrow")}
            </p>
          )}
        </div>

        {text("hero_title") && (
          <h1 className="mt-8 text-[32px] font-semibold leading-[1.1] tracking-tight text-[#e6e6e6] md:text-[40px] xl:text-[46px]">
            {text("hero_title")}
          </h1>
        )}
        {text("hero_intro") && (
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
            {text("hero_intro")}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {text("hero_primary_label") && text("hero_primary_href") && (
            <Link
              href={text("hero_primary_href")}
              className="bg-accent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-[#e6dac9]"
            >
              {text("hero_primary_label")}
            </Link>
          )}
          {text("hero_secondary_label") && text("hero_secondary_href") && (
            <Link
              href={text("hero_secondary_href")}
              className="border border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {text("hero_secondary_label")}
            </Link>
          )}
        </div>

        {text("hero_tools") && (
          <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-faint">
            {text("hero_tools")}
          </p>
        )}
      </div>
    </section>
  );
}
