-- Seeds the tables with the current site content.
-- Warning: this replaces everything in artworks, work_entries, logo_items,
-- social_links and site_content. Uploaded media rows are left untouched.

begin;

truncate table public.artworks;
truncate table public.work_entries;
truncate table public.logo_items;
truncate table public.social_links;
truncate table public.site_content;

insert into public.artworks (title, detail, category, image_url, position) values
  ('Marina Cityscape · Coastal Futures, 2023', 'Environment Concept Art · Blueprint Studio · Blender & Photoshop', 'concept-art', '/images/hero-coastal-city.png', 0),
  ('Town by the Sea · Havenfall, 2024', 'Environment Concept Art · Atlas Pictures · Blender & Photoshop', 'concept-art', '/images/hero-town-by-the-sea.png', 1),
  ('The Drowned Gate · Original IP, 2024', 'Environment Concept Art · Halcyon Interactive · Blender & Photoshop', 'concept-art', '/images/work-underwater-ruin.png', 2),
  ('Seaside Castle · Personal Work, 2024', 'Environment Concept Art · Personal · Blender & Photoshop', 'concept-art', '/images/work-seaside-castle.png', 3),
  ('Redshift · Book Cover, 2025', 'Illustration · Personal · Photoshop', 'illustration', '/images/illustration-redshift.png', 0),
  ('Dive · 2024', 'Illustration · Personal · Photoshop', 'illustration', '/images/illustration-dive.png', 1),
  ('Harpy · 2024', 'Character Illustration · Personal · Photoshop', 'illustration', '/images/illustration-harpy.png', 2),
  ('Grand Staircase · 2020', 'Historical Illustration · Personal · Photoshop', 'illustration', '/images/illustration-grand-staircase.png', 3);

insert into public.work_entries
  (column_key, title, category, description, meta, made_in, tags, position)
values
  ('personal', 'Seaside Castle', 'Environment Concept Art',
   'Clifftop fortress sheltering a harbour from the open ocean.',
   null, 'Blender & Photoshop',
   '["seaside castle", "environment design", "cinematic landscape"]'::jsonb, 0),
  ('personal', 'Medieval Street', 'Environment Concept Art',
   'Believable medieval street built for fantasy worldbuilding.',
   null, 'Blender & Photoshop',
   '["medieval street", "fantasy architecture", "environment art"]'::jsonb, 1),
  ('personal', 'Dark Castle', 'Environment Concept Art',
   'Dark fantasy fortress with monumental scale and atmospheric light.',
   null, 'Blender & Photoshop',
   '["dark fantasy", "castle architecture", "3d blockout"]'::jsonb, 2),
  ('personal', 'Dark Castle II', 'Environment Concept Art',
   'Companion mood piece: quiet courtyards, cold light, abandonment.',
   null, 'Blender & Photoshop',
   '["dark fantasy", "castle architecture", "mood piece"]'::jsonb, 3),
  ('work', 'The Drowned Gate', 'Environment Concept Art',
   'Submerged temple set piece for an underwater sequence.',
   'Client: Halcyon Interactive · Original IP', 'Blender & Photoshop',
   '["underwater ruin", "submerged temple", "set piece"]'::jsonb, 0),
  ('work', 'Havenfall · Feature Film, 2024', 'Environment Concept Art',
   'Cliffside capital and harbour for a fantasy feature.',
   'Client: Atlas Pictures · Outpost Studio', 'Blender & Photoshop',
   '["fantasy city", "cliffside architecture", "matte painting"]'::jsonb, 1),
  ('work', 'Northern Reach · Open-World RPG, 2023', 'Environment Concept Art',
   'Snowbound open world: settlements, watchtowers, mountain passes.',
   null, 'Blender & Photoshop',
   '["open world", "snow biome", "settlement design"]'::jsonb, 2),
  ('work', 'Marina Cityscape · Coastal Futures, 2023', 'Environment Concept Art',
   'Artificial-island marina painted for a speculative pitch.',
   'Client: Blueprint Studio', 'Blender & Photoshop',
   '["speculative architecture", "coastal city", "matte painting"]'::jsonb, 3),
  ('work', 'Slums · Dystopian City, 2020', 'Environment Concept Art',
   'Dystopian slums and level exploration for a noir game.',
   null, 'Photoshop',
   '["dystopian city", "game environment", "sci-fi noir"]'::jsonb, 4),
  ('work', 'City Mood · Dystopian City, 2020', 'Environment Concept Art',
   'Fog, sodium light and silhouettes for a cyberpunk colour script.',
   null, 'Photoshop',
   '["mood painting", "colour script", "cyberpunk"]'::jsonb, 5),
  ('illustration', 'Redshift', 'Illustration',
   'Expanding universe imagined as a sci-fi book cover.',
   null, 'Photoshop',
   '["sci-fi illustration", "space art", "book cover"]'::jsonb, 0),
  ('illustration', 'Succubi', 'Illustration',
   'Statuesque dark fantasy character with a restrained silhouette.',
   null, 'Photoshop',
   '["character design", "dark fantasy", "digital painting"]'::jsonb, 1),
  ('illustration', 'Talia', 'Illustration',
   'Portrait study in warm rim light and deep shadow.',
   null, 'Photoshop',
   '["portrait", "fantasy illustration", "digital painting"]'::jsonb, 2),
  ('illustration', 'Dive', 'Illustration',
   'Quiet descent into a flooded cathedral of light.',
   null, 'Photoshop',
   '["underwater", "illustration", "digital painting"]'::jsonb, 3),
  ('illustration', 'Harpy', 'Illustration',
   'Folded wings and painterly feathers on a dark fantasy creature.',
   null, 'Photoshop',
   '["creature design", "dark fantasy", "digital painting"]'::jsonb, 4),
  ('illustration', 'Grand Staircase · 2020', 'Illustration',
   'Ocean liner staircase painted as a 2020 jigsaw puzzle.',
   null, 'Photoshop',
   '["historical interior", "digital painting", "illustration"]'::jsonb, 5);

insert into public.logo_items (kind, label, style, position) values
  ('clients', 'HALCYON', 'font-semibold tracking-[0.15em]', 0),
  ('clients', 'ATLAS PICTURES', 'font-black tracking-tight', 1),
  ('clients', 'NORD', 'font-serif italic tracking-wide', 2),
  ('clients', 'EMBER GAMES', 'font-bold tracking-[0.2em]', 3),
  ('clients', 'PALE HORIZON', 'font-light tracking-[0.22em]', 4),
  ('clients', 'BLUEPRINT', 'font-semibold tracking-tight', 5),
  ('projects', 'NORTHERN REACH', 'font-light tracking-[0.2em]', 0),
  ('projects', 'The Drowned Gate', 'font-serif italic', 1),
  ('projects', 'COASTAL FUTURES', 'font-black tracking-tight', 2),
  ('projects', 'HAVENFALL', 'font-semibold tracking-[0.16em]', 3),
  ('projects', 'SEVEN SEAS', 'font-serif tracking-[0.12em]', 4);

insert into public.social_links (label, href, icon, position) values
  ('Instagram', 'https://www.instagram.com', 'instagram', 0),
  ('X', 'https://x.com', 'x', 1),
  ('Facebook', 'https://www.facebook.com', 'facebook', 2),
  ('LinkedIn', 'https://www.linkedin.com', 'linkedin', 3);

insert into public.site_content (key, value) values
  ('hero_eyebrow', 'Elysocrates Digital'),
  ('hero_title', 'Environment Concept Artist & Illustrator'),
  ('hero_intro', 'Freelance environment concept artist and illustrator working with film, games and publishing studios on cinematic worlds: underwater ruins, cliffside cities and quiet spaces that carry a story.'),
  ('hero_image', '/images/hero-coastal-city.png'),
  ('hero_image_alt', 'Aerial view of a futuristic marina city built on artificial islands in a turquoise sea'),
  ('hero_caption', 'Selected environments · 2023—2026'),
  ('hero_primary_label', 'View Concept Art'),
  ('hero_primary_href', '/concept-art'),
  ('hero_secondary_label', 'Illustration'),
  ('hero_secondary_href', '/illustration'),
  ('hero_tools', 'Film · Games · Publishing'),
  ('about_eyebrow', 'About'),
  ('about_heading', 'Elysocrates Digital'),
  ('about_subheading', 'Concept art & illustration studio'),
  ('about_image', '/images/about-studio.png'),
  ('about_image_alt', 'Concept artist studio at dusk with a monitor showing a fantasy landscape and sketches pinned to the wall'),
  ('about_image_caption', 'The studio, late evening · 2026'),
  ('about_bio_1', 'Elysocrates Digital is an independent concept art and illustration studio working across film, games and publishing. The work spans environment design (worldbuilding, keyframe art and set design support) as well as prop and character illustration that bring cinematic worlds to life.'),
  ('about_bio_2', 'Seven years of professional experience in the film and games industries, with a background in traditional drawing and painting. Recent environments were used in live-action production, open-world games and print.'),
  ('about_clients_note', 'Clients include Halcyon, Atlas Pictures, Nord Studio, Ember Games, Pale Horizon and Blueprint'),
  ('links_heading', 'Links & Resources'),
  ('links_social_heading', 'Social media'),
  ('links_studio_heading', 'Studio'),
  ('links_email_label', 'Email'),
  ('links_commission_label', 'Commission enquiry'),
  ('links_newsletter_label', 'Newsletter'),
  ('links_questions_heading', 'Common Questions'),
  ('links_questions_body', 'How the studio started, how long the work took to learn and what a typical production looks like. If anything is missing, get in touch.'),
  ('links_about_label', 'Read about the studio'),
  ('newsletter_heading', 'Newsletter'),
  ('newsletter_body_1', 'Leave your email to see new work first, free from the algorithm.'),
  ('newsletter_body_2', 'No spam. An email with new work every 3–6 months.'),
  ('newsletter_subscribe_label', 'Subscribe'),
  ('contact_email', 'hello@elysocrates.digital'),
  ('footer_newsletter_label', 'Newsletter'),
  ('footer_blurb', 'New work and studio notes, a few times a year. No spam.'),
  ('footer_copyright', '© 2026 Elysocrates Digital. All rights reserved. Do not copy or use images without permission.');

commit;
