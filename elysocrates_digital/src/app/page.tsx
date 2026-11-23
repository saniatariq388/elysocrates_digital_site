import { Suspense } from "react";

import {
  ArtworkGallery,
  ArtworkGallerySkeleton,
} from "@/components/artwork-gallery";
import { Clients } from "@/components/home/clients";
import { Hero } from "@/components/home/hero";
import { SelectedWorks } from "@/components/home/selected-works";
import {
  getArtworks,
  getLogoStrips,
  getSiteSettings,
  getWorkColumns,
} from "@/lib/api";

async function HeroSection() {
  const settings = await getSiteSettings();
  return <Hero settings={settings} />;
}

async function ClientsSection() {
  const logos = await getLogoStrips();
  return <Clients clients={logos.clients} projects={logos.projects} />;
}

async function GallerySection() {
  const artworks = await getArtworks();
  return <ArtworkGallery artworks={artworks} />;
}

async function SelectedWorksSection() {
  const columns = await getWorkColumns();
  return <SelectedWorks columns={columns} />;
}

function HeroSkeleton() {
  return (
    <section
      aria-hidden
      className="grid border-b border-line lg:h-[calc(100svh-86px)] lg:max-h-[820px] lg:min-h-[520px] lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="h-[380px] bg-panel/40 md:h-[460px] lg:h-auto" />
      <div className="border-t border-line bg-[#131313] lg:border-l lg:border-t-0" />
    </section>
  );
}

function ClientsSkeleton() {
  return (
    <section
      aria-hidden
      className="mx-auto max-w-[1560px] px-5 md:px-8 lg:px-10"
    >
      <div className="min-h-[260px]" />
    </section>
  );
}

function SelectedWorksSkeleton() {
  return (
    <section aria-hidden className="border-t border-line">
      <div className="mx-auto min-h-[480px] max-w-[1560px] px-5 py-16 md:px-8 lg:px-10 lg:py-20" />
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsSection />
      </Suspense>
      <div className="mx-auto max-w-[1560px] px-5 py-8 md:px-8 md:py-10 lg:px-10">
        <Suspense fallback={<ArtworkGallerySkeleton />}>
          <GallerySection />
        </Suspense>
      </div>
      <Suspense fallback={<SelectedWorksSkeleton />}>
        <SelectedWorksSection />
      </Suspense>
    </>
  );
}
