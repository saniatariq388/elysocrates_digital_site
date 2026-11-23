import type { ComponentType } from "react";
import type { SiteSocialLink, SocialIconName } from "@/lib/content";
import { LinkIcon, WhatsAppIcon, XIcon } from "@/components/icons";

const iconByName: Record<SocialIconName, ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  x: XIcon,
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
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
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
