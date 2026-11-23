export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Concept Art", href: "/concept-art" },
  { label: "Illustration", href: "/illustration" },
  { label: "About", href: "/about" },
  { label: "Links", href: "/links" },
  { label: "Newsletter", href: "/newsletter" },
];

export type ArtworkCategory = "concept-art" | "illustration";

export type Artwork = {
  src: string;
  alt: string;
  title: string;
  detail: string;
  category: ArtworkCategory;
};

export const artworks: Artwork[] = [
  {
    src: "/images/hero-coastal-city.png",
    alt: "Aerial view of a futuristic marina city built on artificial islands in a turquoise sea",
    title: "Marina Cityscape · Coastal Futures, 2023",
    detail: "Environment Concept Art · Blueprint Studio · Blender & Photoshop",
    category: "concept-art",
  },
  {
    src: "/images/hero-town-by-the-sea.png",
    alt: "Medieval cliffside town with terracotta roofs above a turquoise harbour",
    title: "Town by the Sea · Havenfall, 2024",
    detail: "Environment Concept Art · Atlas Pictures · Blender & Photoshop",
    category: "concept-art",
  },
  {
    src: "/images/work-underwater-ruin.png",
    alt: "Submerged temple gate with statues and coral on the ocean floor",
    title: "The Drowned Gate · Original IP, 2024",
    detail: "Environment Concept Art · Halcyon Interactive · Blender & Photoshop",
    category: "concept-art",
  },
  {
    src: "/images/work-seaside-castle.png",
    alt: "Stone castle on a stormy coastal cliff with waves breaking below",
    title: "Seaside Castle · Personal Work, 2024",
    detail: "Environment Concept Art · Personal · Blender & Photoshop",
    category: "concept-art",
  },
  {
    src: "/images/illustration-redshift.png",
    alt: "Crimson spiral galaxy stretching across deep space",
    title: "Redshift · Book Cover, 2025",
    detail: "Illustration · Personal · Photoshop",
    category: "illustration",
  },
  {
    src: "/images/illustration-dive.png",
    alt: "Diver below the vaulted nave of a flooded cathedral lit by a rose window",
    title: "Dive · 2024",
    detail: "Illustration · Personal · Photoshop",
    category: "illustration",
  },
  {
    src: "/images/illustration-harpy.png",
    alt: "Harpy standing on a cliff edge with folded wings at dusk",
    title: "Harpy · 2024",
    detail: "Character Illustration · Personal · Photoshop",
    category: "illustration",
  },
  {
    src: "/images/illustration-grand-staircase.png",
    alt: "Grand ocean liner staircase in polished wood with a stained-glass dome",
    title: "Grand Staircase · 2020",
    detail: "Historical Illustration · Personal · Photoshop",
    category: "illustration",
  },
];

export const conceptArtworks = artworks.filter(
  (artwork) => artwork.category === "concept-art",
);
export const illustrationArtworks = artworks.filter(
  (artwork) => artwork.category === "illustration",
);

export type LogoStripItem = { label: string; className: string };

export const clients: LogoStripItem[] = [
  { label: "HALCYON", className: "font-semibold tracking-[0.15em]" },
  { label: "ATLAS PICTURES", className: "font-black tracking-tight" },
  { label: "NORD", className: "font-serif italic tracking-wide" },
  { label: "EMBER GAMES", className: "font-bold tracking-[0.2em]" },
  { label: "PALE HORIZON", className: "font-light tracking-[0.22em]" },
  { label: "BLUEPRINT", className: "font-semibold tracking-tight" },
];

export const projects: LogoStripItem[] = [
  { label: "NORTHERN REACH", className: "font-light tracking-[0.2em]" },
  { label: "The Drowned Gate", className: "font-serif italic" },
  { label: "COASTAL FUTURES", className: "font-black tracking-tight" },
  { label: "HAVENFALL", className: "font-semibold tracking-[0.16em]" },
  { label: "SEVEN SEAS", className: "font-serif tracking-[0.12em]" },
];

export type WorkEntry = {
  title: string;
  category: string;
  description: string;
  meta?: string;
  madeIn?: string;
  tags: string[];
};

export type WorkColumn = { label: string; entries: WorkEntry[] };

export const workColumns: WorkColumn[] = [
  {
    label: "Personal",
    entries: [
      {
        title: "Seaside Castle",
        category: "Environment Concept Art",
        description:
          "Clifftop fortress sheltering a harbour from the open ocean.",
        madeIn: "Blender & Photoshop",
        tags: ["seaside castle", "environment design", "cinematic landscape"],
      },
      {
        title: "Medieval Street",
        category: "Environment Concept Art",
        description:
          "Believable medieval street built for fantasy worldbuilding.",
        madeIn: "Blender & Photoshop",
        tags: ["medieval street", "fantasy architecture", "environment art"],
      },
      {
        title: "Dark Castle",
        category: "Environment Concept Art",
        description:
          "Dark fantasy fortress with monumental scale and atmospheric light.",
        madeIn: "Blender & Photoshop",
        tags: ["dark fantasy", "castle architecture", "3d blockout"],
      },
      {
        title: "Dark Castle II",
        category: "Environment Concept Art",
        description:
          "Companion mood piece: quiet courtyards, cold light, abandonment.",
        madeIn: "Blender & Photoshop",
        tags: ["dark fantasy", "castle architecture", "mood piece"],
      },
    ],
  },
  {
    label: "Work",
    entries: [
      {
        title: "The Drowned Gate",
        category: "Environment Concept Art",
        description:
          "Submerged temple set piece for an underwater sequence.",
        meta: "Client: Halcyon Interactive · Original IP",
        madeIn: "Blender & Photoshop",
        tags: ["underwater ruin", "submerged temple", "set piece"],
      },
      {
        title: "Havenfall · Feature Film, 2024",
        category: "Environment Concept Art",
        description:
          "Cliffside capital and harbour for a fantasy feature.",
        meta: "Client: Atlas Pictures · Outpost Studio",
        madeIn: "Blender & Photoshop",
        tags: ["fantasy city", "cliffside architecture", "matte painting"],
      },
      {
        title: "Northern Reach · Open-World RPG, 2023",
        category: "Environment Concept Art",
        description:
          "Snowbound open world: settlements, watchtowers, mountain passes.",
        madeIn: "Blender & Photoshop",
        tags: ["open world", "snow biome", "settlement design"],
      },
      {
        title: "Marina Cityscape · Coastal Futures, 2023",
        category: "Environment Concept Art",
        description:
          "Artificial-island marina painted for a speculative pitch.",
        meta: "Client: Blueprint Studio",
        madeIn: "Blender & Photoshop",
        tags: ["speculative architecture", "coastal city", "matte painting"],
      },
      {
        title: "Slums · Dystopian City, 2020",
        category: "Environment Concept Art",
        description:
          "Dystopian slums and level exploration for a noir game.",
        madeIn: "Photoshop",
        tags: ["dystopian city", "game environment", "sci-fi noir"],
      },
      {
        title: "City Mood · Dystopian City, 2020",
        category: "Environment Concept Art",
        description:
          "Fog, sodium light and silhouettes for a cyberpunk colour script.",
        madeIn: "Photoshop",
        tags: ["mood painting", "colour script", "cyberpunk"],
      },
    ],
  },
  {
    label: "Illustration",
    entries: [
      {
        title: "Redshift",
        category: "Illustration",
        description:
          "Expanding universe imagined as a sci-fi book cover.",
        madeIn: "Photoshop",
        tags: ["sci-fi illustration", "space art", "book cover"],
      },
      {
        title: "Succubi",
        category: "Illustration",
        description:
          "Statuesque dark fantasy character with a restrained silhouette.",
        madeIn: "Photoshop",
        tags: ["character design", "dark fantasy", "digital painting"],
      },
      {
        title: "Talia",
        category: "Illustration",
        description:
          "Portrait study in warm rim light and deep shadow.",
        madeIn: "Photoshop",
        tags: ["portrait", "fantasy illustration", "digital painting"],
      },
      {
        title: "Dive",
        category: "Illustration",
        description:
          "Quiet descent into a flooded cathedral of light.",
        madeIn: "Photoshop",
        tags: ["underwater", "illustration", "digital painting"],
      },
      {
        title: "Harpy",
        category: "Illustration",
        description:
          "Folded wings and painterly feathers on a dark fantasy creature.",
        madeIn: "Photoshop",
        tags: ["creature design", "dark fantasy", "digital painting"],
      },
      {
        title: "Grand Staircase · 2020",
        category: "Illustration",
        description:
          "Ocean liner staircase painted as a 2020 jigsaw puzzle.",
        madeIn: "Photoshop",
        tags: ["historical interior", "digital painting", "illustration"],
      },
    ],
  },
];

export type SocialIconName = "whatsapp" | "x" | "link";

export type SiteSocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
  ariaLabel: string;
};

export const socials: SiteSocialLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/447882508820",
    icon: "whatsapp",
    ariaLabel: "Message Elysocrates Digital on WhatsApp",
  },
  {
    label: "X",
    href: "https://x.com/danae_is_bear",
    icon: "x",
    ariaLabel: "Elysocrates Digital on X",
  },
];

// Mirrors backend/app/site_fields.py (site root) defaults; used only when the API is unreachable.
// contact_email is the exception: it is pinned for display regardless of the API.
export const siteContentDefaults: Record<string, string> = {
  hero_eyebrow: "Elysocrates Digital",
  hero_title: "Environment Concept Artist & Illustrator",
  hero_intro:
    "Freelance environment concept artist and illustrator working with film, games and publishing studios on cinematic worlds: underwater ruins, cliffside cities and quiet spaces that carry a story.",
  hero_image: "/images/hero-coastal-city.png",
  hero_image_alt:
    "Aerial view of a futuristic marina city built on artificial islands in a turquoise sea",
  hero_caption: "Selected environments · 2023—2026",
  hero_primary_label: "View Concept Art",
  hero_primary_href: "/concept-art",
  hero_secondary_label: "Illustration",
  hero_secondary_href: "/illustration",
  hero_tools: "Film · Games · Publishing",
  about_eyebrow: "About",
  about_heading: "Elysocrates Digital",
  about_subheading: "Concept art & illustration studio",
  about_image: "/images/about-studio.png",
  about_image_alt:
    "Concept artist studio at dusk with a monitor showing a fantasy landscape and sketches pinned to the wall",
  about_image_caption: "The studio, late evening · 2026",
  about_bio_1:
    "Elysocrates Digital is an independent concept art and illustration studio working across film, games and publishing. The work spans environment design (worldbuilding, keyframe art and set design support) as well as prop and character illustration that bring cinematic worlds to life.",
  about_bio_2:
    "Seven years of professional experience in the film and games industries, with a background in traditional drawing and painting. Recent environments were used in live-action production, open-world games and print.",
  about_clients_note:
    "Clients include Halcyon, Atlas Pictures, Nord Studio, Ember Games, Pale Horizon and Blueprint",
  links_heading: "Links & Resources",
  links_social_heading: "Social media",
  links_studio_heading: "Studio",
  links_email_label: "Email",
  links_commission_label: "Commission enquiry",
  links_newsletter_label: "Newsletter",
  links_questions_heading: "Common Questions",
  links_questions_body:
    "How the studio started, how long the work took to learn and what a typical production looks like. If anything is missing, get in touch.",
  links_about_label: "Read about the studio",
  newsletter_heading: "Newsletter",
  newsletter_body_1:
    "Leave your email to see new work first, free from the algorithm.",
  newsletter_body_2: "No spam. An email with new work every 3–6 months.",
  newsletter_subscribe_label: "Subscribe",
  contact_email: "elysocratesdigital@gmail.com",
  footer_newsletter_label: "Newsletter",
  footer_blurb: "New work and studio notes, a few times a year. No spam.",
  footer_copyright:
    "© 2026 Elysocrates Digital. All rights reserved. Do not copy or use images without permission.",
};
