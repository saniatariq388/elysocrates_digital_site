import type { Artwork } from "@/lib/content";
import { ArtworkCard } from "@/components/artwork-card";

export function ArtworkGallery({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.src} artwork={artwork} />
      ))}
    </div>
  );
}

export function ArtworkGallerySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden className="grid gap-4 md:grid-cols-2 md:gap-5">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="aspect-[4/3] bg-panel/50" />
      ))}
    </div>
  );
}
