import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSettings, getSocialLinks } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elysocrates Digital — Concept Art & Illustration",
  description:
    "Environment concept art and illustration for film, games and publishing. Cinematic worlds, keyframe art and set design by Elysocrates Digital.",
};

async function HeaderData() {
  const socials = await getSocialLinks();
  return <SiteHeader socials={socials} />;
}

async function FooterData() {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);
  return <SiteFooter settings={settings} socials={socials} />;
}

function HeaderSkeleton() {
  return (
    <header
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md"
    >
      <div className="mx-auto h-[86px] max-w-[1560px] px-5 md:px-8 lg:px-10" />
    </header>
  );
}

function FooterSkeleton() {
  return (
    <footer aria-hidden className="border-t border-line">
      <div className="mx-auto min-h-[280px] max-w-[1560px] px-5 py-16 md:px-8 lg:px-10" />
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderData />
        </Suspense>
        <main className="flex-1 pt-[86px]">{children}</main>
        <Suspense fallback={<FooterSkeleton />}>
          <FooterData />
        </Suspense>
      </body>
    </html>
  );
}
