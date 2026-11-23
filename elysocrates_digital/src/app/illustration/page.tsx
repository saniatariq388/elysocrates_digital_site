import { Suspense } from "react";
import type { Metadata } from "next";

import {
  ArtworkGallery,
  ArtworkGallerySkeleton,
} from "@/components/artwork-gallery";
import { getArtworks } from "@/lib/api";

export const metadata: Metadata = {
  title: "Illustration — Elysocrates Digital",
  description:
    "Book covers, character illustrations and historical interior pieces painted in Photoshop.",
};

async function IllustrationGallery() {
  const artworks = await getArtworks("illustration");
  return <ArtworkGallery artworks={artworks} />;
}

export default function IllustrationPage() {
  return (
    <div className="mx-auto max-w-[1560px] px-5 pb-16 md:px-8 lg:px-10 lg:pb-20">
      <div className="pb-8 pt-12 md:pb-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[#e6e6e6] md:text-[40px]">
          Illustration
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Narrative illustration for covers, characters and historical
          subjects: painterly work built on traditional drawing and light.
        </p>
      </div>
      <Suspense fallback={<ArtworkGallerySkeleton />}>
        <IllustrationGallery />
      </Suspense>
    </div>
  );
}
