"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, type SiteSocialLink } from "@/lib/content";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";

export function SiteHeader({ socials }: { socials: SiteSocialLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-[86px] max-w-[1560px] items-center justify-between px-5 md:px-8 lg:px-10">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                      active
                        ? "text-white underline decoration-accent decoration-1 underline-offset-[10px]"
                        : "text-fg hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center md:flex">
          <SocialLinks links={socials} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-fg transition-colors hover:text-accent lg:hidden"
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-ink px-5 pb-8 pt-5 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-5">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-accent ${
                      pathname === item.href ? "text-white" : "text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 border-t border-line pt-6 md:hidden">
            <SocialLinks links={socials} />
          </div>
        </div>
      )}
    </header>
  );
}
