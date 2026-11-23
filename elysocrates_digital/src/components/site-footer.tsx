import Link from "next/link";

import { SocialLinks } from "@/components/social-links";
import type { SiteSocialLink } from "@/lib/content";

export function SiteFooter({
  settings,
  socials,
}: {
  settings: Record<string, string>;
  socials: SiteSocialLink[];
}) {
  const text = (key: string) => settings[key] ?? "";
  const email = text("contact_email");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1560px] flex-col items-center px-5 py-16 text-center md:px-8 lg:px-10">
        <SocialLinks links={socials} className="justify-center" />

        <div className="mt-10 flex flex-col items-center">
          {text("footer_newsletter_label") && (
            <Link
              href="/newsletter"
              className="text-[11px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-accent"
            >
              {text("footer_newsletter_label")}
            </Link>
          )}
          {text("footer_blurb") && (
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-faint">
              {text("footer_blurb")}
            </p>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-4 text-sm text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {email}
            </a>
          )}
        </div>

        {text("footer_copyright") && (
          <p className="mt-12 text-[11px] text-[#5f5f5f]">
            {text("footer_copyright")}
          </p>
        )}
      </div>
    </footer>
  );
}
