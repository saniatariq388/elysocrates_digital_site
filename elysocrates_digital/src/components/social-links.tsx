import type { ComponentType } from "react";
import type { SiteSocialLink, SocialIconName } from "@/lib/content";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  XIcon,
} from "@/components/icons";

const iconByName: Record<SocialIconName, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  x: XIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  link: LinkIcon,
};

export function SocialLinks({
  links,
  className = "",
}: {
  links: SiteSocialLink[];
  className?: string;
}) {
  if (links.length === 0) return null;

  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {links.map((social) => {
        const Icon = iconByName[social.icon] ?? LinkIcon;
        return (
          <li key={`${social.label}-${social.href}`}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="block text-fg transition-colors duration-200 hover:text-accent"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
