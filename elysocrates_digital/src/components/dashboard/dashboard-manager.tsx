"use client";

import { useState } from "react";

import { ArtworksManager } from "@/components/dashboard/artworks-manager";
import { LogosManager } from "@/components/dashboard/logos-manager";
import { MediaManager } from "@/components/dashboard/media-manager";
import { SiteContentManager } from "@/components/dashboard/site-content-manager";
import { SocialLinksManager } from "@/components/dashboard/social-links-manager";
import { WorkEntriesManager } from "@/components/dashboard/work-entries-manager";

type Tab = "artworks" | "works" | "content" | "logos" | "socials" | "media";

const tabs: { id: Tab; label: string }[] = [
  { id: "artworks", label: "Artwork cards" },
  { id: "works", label: "Selected works" },
  { id: "content", label: "Site content" },
  { id: "logos", label: "Clients & projects" },
  { id: "socials", label: "Social links" },
  { id: "media", label: "Media" },
];

export function DashboardManager() {
  const [tab, setTab] = useState<Tab>("artworks");

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b border-line">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px shrink-0 border-b px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
              tab === item.id
                ? "border-accent text-white"
                : "border-transparent text-faint hover:text-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "artworks" && <ArtworksManager />}
        {tab === "works" && <WorkEntriesManager />}
        {tab === "content" && <SiteContentManager />}
        {tab === "logos" && <LogosManager />}
        {tab === "socials" && <SocialLinksManager />}
        {tab === "media" && <MediaManager />}
      </div>
    </div>
  );
}
