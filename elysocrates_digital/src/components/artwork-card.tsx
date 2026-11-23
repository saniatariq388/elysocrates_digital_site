import Image from "next/image";
import type { Artwork } from "@/lib/content";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <figure className="group relative aspect-[4/3] overflow-hidden bg-panel">
      <Image
        src={artwork.src}
        alt={artwork.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1560px) 50vw, 760px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-5 pt-20">
        <figcaption>
          <p className="text-[15px] font-semibold text-white">
            {artwork.title}
          </p>
          <p className="mt-1 text-[12px] text-white/60">{artwork.detail}</p>
        </figcaption>
      </div>
    </figure>
  );
}
