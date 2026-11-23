import { Suspense } from "react";
import type { Metadata } from "next";

import {
  ArtworkGallery,
  ArtworkGallerySkeleton,
} from "@/components/artwork-gallery";
import { getArtworks } from "@/lib/api";

export const metadata: Metadata = {
  title: "Concept Art — Elysocrates Digital",
  description:
    "Environment concept art for film and games: coastal cities, cliffside towns, underwater ruins and dark fantasy castles.",
};

async function ConceptArtGallery() {
  const artworks = await getArtworks("concept-art");
  return <ArtworkGallery artworks={artworks} />;
}

export default function ConceptArtPage() {
  return (
    <div className="mx-auto max-w-[1560px] px-5 pb-16 md:px-8 lg:px-10 lg:pb-20">
      <div className="pb-8 pt-12 md:pb-10 md:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[#e6e6e6] md:text-[40px]">
          Concept Art
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Environment designs developed from 3D blockouts and painted in
          Photoshop: worlds built for live-action production, open-world games
          and print.
        </p>
      </div>
      <Suspense fallback={<ArtworkGallerySkeleton />}>
        <ConceptArtGallery />
      </Suspense>
    </div>
  );
}
